import {
  CITIES, getCOPCorrection, HP_TYPES,
  KCAL_PER_KWH, PNG_NCV_KCAL, BOILER_EFF,
  HEAT_LOSS_FACTOR, PEAK_FRACTION, PEAK_HOURS,
  DELTA_T, SAFETY_MARGIN, ELECTRICITY_RATE, PNG_RATE,
  GRID_EMISSION_FACTOR, PNG_EMISSION_FACTOR,
} from "../data/climateData";

/**
 * STEP 1 — Daily hot water demand (kL/day)
 * Formula: (Units × litres/unit) + public area allowance
 */
export function calcDailyHotWater({ buildingType, units, personsPerUnit: customPersons, litresPerPerson: customLitres }) {
  // Persons per unit (rooms/beds/flats)
  const PERSONS_PER_UNIT = {
    "Hotel":       2,    // 2 persons per room (average occupancy)
    "Hospital":    2,    // 1 patient + 1 attendee per bed
    "Residential": 4,    // 4 persons per flat
    "Commercial":  1,
    "Industrial":  1,
  };

  // Hot water litres per PERSON per day (IS/ECBC standard)
  const LPP = {
    "Hotel":       40,   // 40 litres per person
    "Hospital":    100,  // 100 litres per person (medical grade)
    "Residential": 30,   // 30 litres per person
    "Commercial":  15,
    "Industrial":  25,
  };

  const personsPerUnit =
    customPersons != null && customPersons !== ""
      ? Number(customPersons)
      : (PERSONS_PER_UNIT[buildingType] ?? 2);
  const litresPerPerson =
    customLitres != null && customLitres !== ""
      ? Number(customLitres)
      : (LPP[buildingType] ?? 40);

  const totalPersons = units * personsPerUnit;
  const mainDemand = totalPersons * litresPerPerson;
  const publicArea = mainDemand * 0.50; // 50% allowance for public areas
  const dailyKL = (mainDemand + publicArea) / 1000;

  return {
    dailyKL: +dailyKL.toFixed(2),
    personsPerUnit,
    litresPerPerson,
    totalPersons,
    mainDemandL: +mainDemand.toFixed(0),
    publicAreaL: +publicArea.toFixed(0),
  };
}

/**
 * STEP 2 — Peak load demand (kL in peak period)
 */
export function calcPeakDemand(dailyKL) {
  return dailyKL * PEAK_FRACTION; // 50% of daily in 3 hrs
}

/**
 * STEP 3 — Heating energy required (kCal)
 * Formula from Aloft project: (Peak_kL × 1000 × ΔT) / (HeatLoss × StorageLoss)
 */
export function calcHeatingEnergy(peakKL) {
  return (peakKL * 1000 * DELTA_T) / (HEAT_LOSS_FACTOR * HEAT_LOSS_FACTOR);
}

/**
 * STEP 4 — Convert kCal → kWh → HP capacity in kW
 */
export function calcHPCapacity(heatingKCal) {
  const heatingKWh = heatingKCal / KCAL_PER_KWH;
  const rawKW = heatingKWh / PEAK_HOURS;
  const withMargin = rawKW;
  return {
    heatingKWh: +heatingKWh.toFixed(2),
    rawKW: +rawKW.toFixed(2),
    capacityKW: +withMargin.toFixed(2),
    capacityTR: +(withMargin / 3.517).toFixed(2),
  };
}

/**
 * STEP 5 — Corrected COP based on city outdoor temp
 */
export function calcCorrectedCOP(city, hpType) {
  const cityData = CITIES[city];
  const rated = HP_TYPES[hpType]?.ratedCOP ?? 3.5;
  const corr = getCOPCorrection(cityData.designTempC);
  return +(rated * corr).toFixed(2);
}

/**
 * STEP 6 — Annual energy & cost savings (PNG vs HP)
 * Formula: PNG saved = heating energy / (PNG_NCV × boiler_eff)
 */
export function calcAnnualSavings({ heatingKWh, correctedCOP, dailyKL }) {
  // Daily heating demand in kCal
  const dailyKCal = dailyKL * 1000 * DELTA_T / (HEAT_LOSS_FACTOR * HEAT_LOSS_FACTOR);

  // Annual PNG (boiler) consumption
  const annualKCal = dailyKCal * 365;
  const annualSCM  = annualKCal / (PNG_NCV_KCAL * BOILER_EFF);   // SCM/year
  const annualPNGCost = annualSCM * PNG_RATE;                      // ₹/year

  // Annual electricity (heat pump)
  const annualElecKWh  = (dailyKCal / KCAL_PER_KWH / correctedCOP) * 365;
  const annualElecCost = annualElecKWh * ELECTRICITY_RATE;         // ₹/year

  const annualSavings  = annualPNGCost - annualElecCost;
  const savingsPct     = +((annualSavings / annualPNGCost) * 100).toFixed(1);
  const baselineCO2Kg = annualSCM * PNG_EMISSION_FACTOR;
  const hpCO2Kg = annualElecKWh * GRID_EMISSION_FACTOR;
  const co2AvoidedKg = baselineCO2Kg - hpCO2Kg;
  const co2AvoidedTons = co2AvoidedKg > 0 ? co2AvoidedKg / 1000 : 0;
  const costPerTonCO2Avoided = co2AvoidedTons > 0
    ? +((annualElecCost - annualPNGCost) / co2AvoidedTons).toFixed(0)
    : null;

  return {
    annualSCM:      +annualSCM.toFixed(0),
    annualPNGCost:  +annualPNGCost.toFixed(0),
    annualElecKWh:  +annualElecKWh.toFixed(0),
    annualElecCost: +annualElecCost.toFixed(0),
    annualSavings:  +annualSavings.toFixed(0),
    savingsPct,
    baselineCO2Kg: +baselineCO2Kg.toFixed(0),
    hpCO2Kg: +hpCO2Kg.toFixed(0),
    co2AvoidedKg: +co2AvoidedKg.toFixed(0),
    co2AvoidedTons: +co2AvoidedTons.toFixed(2),
    costPerTonCO2Avoided,
  };
}

/**
 * MASTER ENGINE — runs all steps
 */
export function runSizingEngine(inputs) {
  const {
    city, buildingType, units, hpType, projectName, investment,
    personsPerUnit, litresPerPerson,
  } = inputs;
  const cityData = CITIES[city];

  const hotWater = calcDailyHotWater({
    buildingType,
    units,
    personsPerUnit,
    litresPerPerson,
  });
  const dailyKL = hotWater.dailyKL;
  const peakKL         = calcPeakDemand(dailyKL);
  const heatingKCal    = calcHeatingEnergy(peakKL);
  const capacity       = calcHPCapacity(heatingKCal);
  const correctedCOP   = calcCorrectedCOP(city, hpType);
  const savings        = calcAnnualSavings({
    heatingKWh: capacity.heatingKWh,
    correctedCOP,
    dailyKL,
  });

  const paybackMonths = investment && savings.annualSavings > 0
    ? +((investment / savings.annualSavings) * 12).toFixed(1)
    : null;

  return {
    projectName,
    city,
    climateZone:   cityData.zone,
    designTemp:    cityData.designTempC,
    designTempH:   cityData.designTempH,
    buildingType,
    units,
    hpType,
    personsPerUnit:   hotWater.personsPerUnit,
    litresPerPerson:  hotWater.litresPerPerson,
    totalPersons:     hotWater.totalPersons,
    mainDemandL:      hotWater.mainDemandL,
    publicAreaL:      hotWater.publicAreaL,

    dailyHotWaterKL:  hotWater.dailyKL,
    peakDemandKL:     +peakKL.toFixed(2),
    heatingKCal:      +heatingKCal.toFixed(0),
    heatingKWh:       capacity.heatingKWh,
    capacityKW:       capacity.capacityKW,
    capacityTR:       capacity.capacityTR,
    correctedCOP,

    ...savings,
    investment:       investment ? +investment : null,
    paybackMonths,
  };
}
