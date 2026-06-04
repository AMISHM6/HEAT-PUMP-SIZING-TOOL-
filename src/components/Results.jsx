import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend,
} from "recharts";

const cr = (n) => n?.toLocaleString("en-IN");
const inr = (n) => `₹${cr(n)}`;

const KPI = ({ label, value, sub, color }) => (
  <div className="kpi" style={{ "--kc": color }}>
    <div className="kpi-label">{label}</div>
    <div className="kpi-value">{value}</div>
    {sub && <div className="kpi-sub">{sub}</div>}
  </div>
);

export default function Results({ results, onReset }) {
  if (!results) return null;

  const barData = [
    { name: "PNG Boiler\n(Baseline)", cost: results.annualPNGCost, fill: "#8a7a72" },
    { name: `Heat Pump\n(${results.hpType?.split(" ")[0]})`, cost: results.annualElecCost, fill: "#CA3604" },
  ];

  const pieData = [
    { name: "HP Electricity Cost", value: results.annualElecCost, fill: "#E85A20" },
    { name: "Annual Savings", value: results.annualSavings, fill: "#CA3604" },
  ];

  const steps = [
    {
      label: "Total Persons",
      value: `${cr(results.units)} units × ${results.personsPerUnit} persons = ${cr(results.totalPersons)} persons`,
    },
    {
      label: "Hot Water (occupancy)",
      value: `${cr(results.totalPersons)} × ${results.litresPerPerson} L/day = ${cr(results.mainDemandL)} L/day`,
    },
    {
      label: "Public Area Allowance (50%)",
      value: `${cr(results.publicAreaL)} L/day`,
    },
    { label: "Daily Hot Water Demand", value: `${results.dailyHotWaterKL} kL/day` },
    { label: "Peak Demand (50% in 3 hrs)", value: `${results.peakDemandKL} kL` },
    { label: "Peak Heating Energy", value: `${cr(results.heatingKCal)} kCal` },
    { label: "Peak Energy (kWh)", value: `${results.heatingKWh} kWh` },
    { label: "Raw HP Capacity", value: `${results.capacityKW / 1.15 | 0} kW` },
    { label: "With 15% Safety Margin", value: `${results.capacityKW} kW / ${results.capacityTR} TR` },
  ];

  return (
    <div className="results-root">
      {/* Header */}
      <div className="res-header">
        <div>
          <div className="step-eyebrow">Results</div>
          <h2 className="step-heading" style={{ marginBottom: 4 }}>
            {results.projectName || "Sizing Report"}
          </h2>
          <p className="step-sub">
            {results.buildingType} · {results.city} · {results.climateZone} Zone ·
            Outdoor {results.designTemp}°C
          </p>
        </div>
        <div className="res-header-actions">
          <button className="btn-ghost" onClick={() => window.print()}>🖨 Print</button>
          <button className="btn-ghost" onClick={onReset}>+ New</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-row">
        <KPI color="#CA3604" label="HP Capacity" value={`${results.capacityKW} kW`} sub={`${results.capacityTR} TR · incl. 15% margin`} />
        <KPI color="#E85A20" label="Corrected COP" value={results.correctedCOP} sub={`At ${results.designTemp}°C outdoor`} />
        <KPI color="#E07850" label="Annual PNG Saved" value={`${cr(results.annualSCM)} SCM`} sub="vs boiler baseline" />
        <KPI color="#CA3604" label="Annual Savings" value={inr(results.annualSavings)} sub={`${results.savingsPct}% reduction`} />
        <KPI color="#B84A1A" label="CO₂ Avoided" value={`${cr(results.co2AvoidedTons)} tonnes of CO₂/year`} sub="Baseline vs heat pump" />
        {results.paybackMonths && (
          <KPI color="#9A2A03" label="Payback Period" value={`${results.paybackMonths} mo`} sub={`Investment: ${inr(results.investment)}`} />
        )}
      </div>

      {/* Calculation Steps */}
      <div className="calc-steps-card">
        <h3 className="card-title">📐 Step-by-Step Calculation</h3>
        <div className="calc-steps">
          {steps.map((s, i) => (
            <div className="calc-step" key={i}>
              <span className="cs-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="cs-label">{s.label}</span>
              <span className="cs-value">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        {/* Bar Chart */}
        <div className="chart-card">
          <h3 className="card-title">Annual Cost Comparison</h3>
          <p className="card-sub">Heat Pump vs PNG Boiler (₹/year)</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(25,19,18,0.08)" />
              <XAxis dataKey="name" tick={{ fill: "#6b5f58", fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} tick={{ fill: "#6b5f58", fontSize: 11 }} />
              <Tooltip
                formatter={(v) => [inr(v), "Annual Cost"]}
                contentStyle={{ background: "#ffffff", border: "1px solid rgba(25,19,18,0.14)", borderRadius: 10 }}
                labelStyle={{ color: "#191312" }}
              />
              <Bar dataKey="cost" radius={[8, 8, 0, 0]}>
                {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="chart-card">
          <h3 className="card-title">Savings Breakdown</h3>
          <p className="card-sub">Where your money goes vs baseline</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip
                formatter={(v) => inr(v)}
                contentStyle={{ background: "#ffffff", border: "1px solid rgba(25,19,18,0.14)", borderRadius: 10 }}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: "#9ca3af" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Full Summary Table */}
      <div className="summary-card">
        <h3 className="card-title">Full Calculation Summary</h3>
        <table className="summary-table">
          <tbody>
            <tr className="section-row"><td colSpan={2}>🏗 Project</td></tr>
            <tr><td>City</td><td>{results.city}</td></tr>
            <tr><td>IS Climate Zone</td><td>{results.climateZone}</td></tr>
            <tr><td>Outdoor Design Temp (Cooling)</td><td>{results.designTemp}°C</td></tr>
            <tr><td>Outdoor Design Temp (Heating)</td><td>{results.designTempH}°C</td></tr>
            <tr><td>Building Type</td><td>{results.buildingType}</td></tr>
            <tr><td>Units (Rooms / Beds / Flats)</td><td>{results.units}</td></tr>

            <tr className="section-row"><td colSpan={2}>💧 Hot Water Demand</td></tr>
            <tr><td>Persons per Unit</td><td>{results.personsPerUnit}</td></tr>
            <tr><td>Hot Water per Person</td><td>{results.litresPerPerson} L/day</td></tr>
            <tr><td>Total Persons</td><td>{cr(results.units)} × {results.personsPerUnit} = {cr(results.totalPersons)}</td></tr>
            <tr><td>Occupancy Demand</td><td>{cr(results.totalPersons)} × {results.litresPerPerson} L = {cr(results.mainDemandL)} L/day</td></tr>
            <tr><td>Public Area Allowance (50%)</td><td>{cr(results.publicAreaL)} L/day</td></tr>
            <tr><td>Daily Hot Water Demand</td><td>{results.dailyHotWaterKL} kL/day</td></tr>
            <tr><td>Peak Demand (50% in 3 hrs)</td><td>{results.peakDemandKL} kL</td></tr>
            <tr><td>Peak Heating Energy</td><td>{cr(results.heatingKCal)} kCal</td></tr>
            <tr><td>Peak Heating Energy (kWh)</td><td>{results.heatingKWh} kWh</td></tr>

            <tr className="section-row"><td colSpan={2}>⚡ HP Sizing</td></tr>
            <tr><td>Heat Pump Type</td><td>{results.hpType}</td></tr>
            <tr><td>Corrected COP (at site conditions)</td><td>{results.correctedCOP}</td></tr>
            <tr><td>Required Capacity (incl. 15% margin)</td><td><strong>{results.capacityKW} kW / {results.capacityTR} TR</strong></td></tr>

            <tr className="section-row"><td colSpan={2}>💰 Economics</td></tr>
            <tr><td>Annual PNG Saved</td><td>{cr(results.annualSCM)} SCM/year</td></tr>
            <tr><td>Annual PNG Cost (Baseline)</td><td>{inr(results.annualPNGCost)}/year</td></tr>
            <tr><td>Annual Electricity (HP)</td><td>{cr(results.annualElecKWh)} kWh/year</td></tr>
            <tr><td>Annual Electricity Cost (HP)</td><td>{inr(results.annualElecCost)}/year</td></tr>
            <tr className="highlight-row">
              <td>Annual Savings</td>
              <td>{inr(results.annualSavings)}/year ({results.savingsPct}%)</td>
            </tr>
            {results.paybackMonths && (
              <tr className="highlight-row">
                <td>Simple Payback Period</td>
                <td>{results.paybackMonths} months</td>
              </tr>
            )}

            <tr className="section-row"><td colSpan={2}>🌿 ESG Carbon Accounting</td></tr>
            <tr><td>Baseline Emissions (PNG Boiler)</td><td>{cr(results.baselineCO2Kg)} kilograms of CO₂/year</td></tr>
            <tr><td>Heat Pump Emissions (Grid Electricity)</td><td>{cr(results.hpCO2Kg)} kilograms of CO₂/year</td></tr>
            <tr className="highlight-row">
              <td>Annual CO₂ Avoided</td>
              <td>{cr(results.co2AvoidedKg)} kilograms of CO₂/year ({cr(results.co2AvoidedTons)} tonnes of CO₂/year)</td>
            </tr>
            <tr>
              <td>Cost per tonne of CO₂ avoided</td>
              <td>
                {results.costPerTonCO2Avoided === null
                  ? "N/A"
                  : `${inr(results.costPerTonCO2Avoided)} per tonne of CO₂`}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="standards-bar">
        Standards: IS 1391 · IS 655 · ECBC 2017 · NBC 2016 | Safety margin 15% | ΔT = 30°C | Peak = 50% daily in 3 hrs
      </div>
    </div>
  );
}
