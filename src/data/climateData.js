export const CITIES = {
  "New Delhi":  { zone: "Composite",   designTempC: 43, designTempH: 4,  wetBulb: 28 },
  "Mumbai":     { zone: "Warm & Humid",designTempC: 38, designTempH: 16, wetBulb: 30 },
  "Bangalore":  { zone: "Temperate",   designTempC: 34, designTempH: 14, wetBulb: 24 },
  "Chennai":    { zone: "Warm & Humid",designTempC: 40, designTempH: 22, wetBulb: 30 },
  "Hyderabad":  { zone: "Composite",   designTempC: 40, designTempH: 10, wetBulb: 26 },
  "Ahmedabad":  { zone: "Hot & Dry",   designTempC: 44, designTempH: 8,  wetBulb: 26 },
  "Pune":       { zone: "Composite",   designTempC: 38, designTempH: 10, wetBulb: 25 },
  "Kolkata":    { zone: "Warm & Humid",designTempC: 38, designTempH: 12, wetBulb: 30 },
  "Jaipur":     { zone: "Hot & Dry",   designTempC: 44, designTempH: 5,  wetBulb: 24 },
  "Lucknow":    { zone: "Composite",   designTempC: 42, designTempH: 4,  wetBulb: 27 },
  "Chandigarh": { zone: "Composite",   designTempC: 42, designTempH: 2,  wetBulb: 26 },
  "Nagpur":     { zone: "Hot & Dry",   designTempC: 45, designTempH: 10, wetBulb: 26 },
  "Surat":      { zone: "Warm & Humid",designTempC: 38, designTempH: 14, wetBulb: 28 },
  "Kochi":      { zone: "Warm & Humid",designTempC: 36, designTempH: 22, wetBulb: 29 },
  "Shimla":     { zone: "Cold",        designTempC: 28, designTempH: -4, wetBulb: 18 },
  "Dehradun":   { zone: "Composite",   designTempC: 38, designTempH: 2,  wetBulb: 24 },
};

export const HP_TYPES = {
  "Air-to-Water (ASHP)": { ratedCOP: 3.5, icon: "💧", desc: "Best for hotels & hospitals — hot water generation" },
  "Air-to-Air (VRF)":    { ratedCOP: 3.2, icon: "💨", desc: "Splits / VRF systems — space heating/cooling" },
  "Water-to-Water":      { ratedCOP: 4.0, icon: "🌊", desc: "Cooling tower / water body — large campus" },
  "Ground Source (GSHP)":{ ratedCOP: 4.5, icon: "🌍", desc: "Highest efficiency — large commercial" },
};

export const BUILDING_HW = {
  "Hotel":       { litresPerRoom: 40,  publicFactor: 0.5, personsPerRoom: 1.8 },
  "Hospital":    { litresPerBed: 100,  publicFactor: 0.3, personsPerBed: 1 },
  "Residential": { litresPerFlat: 120, publicFactor: 0.1, personsPerFlat: 4 },
  "Commercial":  { litresPerPerson: 15,publicFactor: 0.2, personsPerSqm: 0.1 },
  "Industrial":  { litresPerPerson: 25,publicFactor: 0.1, personsPerSqm: 0.05 },
};

export const getCOPCorrection = (t) => {
  if (t <= 35) return 1.00;
  if (t <= 38) return 0.95;
  if (t <= 41) return 0.90;
  if (t <= 44) return 0.85;
  return 0.80;
};

// Physics constants
export const KCAL_PER_KWH   = 860;
export const PNG_NCV_KCAL   = 9500;   // kCal per SCM of PNG
export const BOILER_EFF     = 0.80;
export const HEAT_LOSS_FACTOR= 0.95;  // piping / storage losses
export const PEAK_FRACTION  = 0.50;   // 50% of daily demand in peak period
export const PEAK_HOURS     = 3;      // hours
export const DELTA_T        = 30;     // °C (cold water to hot water rise, e.g. 15→45°C)
export const SAFETY_MARGIN  = 1.15;   // 15% per IS 1391
export const ELECTRICITY_RATE = 11;   // ₹/kWh (commercial)
export const PNG_RATE       = 70;     // ₹/SCM
export const GRID_EMISSION_FACTOR = 0.708; // kgCO2 per kWh (India grid avg)
export const PNG_EMISSION_FACTOR = 2.0;    // kgCO2 per SCM
