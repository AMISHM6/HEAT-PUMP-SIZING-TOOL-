import React from "react";
import { HP_TYPES } from "../../data/climateData";

const HP_IMAGES = {
  "Air-to-Air (VRF)": "/air_to_air_heat_pump_correct.svg",
  "Water-to-Water": "/water_to_water_heat_pump.svg",
  "Air-to-Water (ASHP)": "/air_to_water_heat_pump.svg",
  "Ground Source (GSHP)": "/ground_source_heat_pump.svg",
};

export default function StepHPType({ data, onChange }) {
  return (
    <div className="step-body">
      <div className="step-eyebrow">Step 02</div>
      <h2 className="step-heading">Heat Pump Selection</h2>
      <p className="step-sub">Choose the technology and enter project investment</p>

      <div className="field-group">
        <label className="field-label">Heat Pump Technology</label>
        <div className="hp-grid">
          {Object.entries(HP_TYPES).map(([type, info]) => (
            <button
              key={type}
              type="button"
              className={`hp-tile ${data.hpType === type ? "selected" : ""}`}
              onClick={() => onChange("hpType", type)}
            >
              <div className="hp-img-wrap">
  {HP_IMAGES[type] && (
    <img className="hp-img" src={HP_IMAGES[type]} alt={type} />
  )}
</div>
              <span className="hp-name">{type}</span>
              
              
            </button>
          ))}
        </div>
      </div>

      <div className="field-row">
        <div className="field-group">
          <label className="field-label">Project Investment (₹) <span className="optional">(optional)</span></label>
          <input
            className="field-input"
            type="number"
            min="0"
            placeholder="e.g. 2127962"
            value={data.investment || ""}
            onChange={(e) => onChange("investment", parseFloat(e.target.value) || "")}
          />
          <span className="field-hint">Used to calculate payback period</span>
        </div>

        <div className="field-group">
          <label className="field-label">Electricity Tariff (₹/kWh)</label>
          <input
            className="field-input"
            type="number"
            step="0.5"
            placeholder="11"
            value={data.electricityRate || ""}
            onChange={(e) => onChange("electricityRate", parseFloat(e.target.value) || "")}
          />
          <span className="field-hint">Default: ₹11/kWh (commercial)</span>
        </div>
      </div>

      <div className="field-row">
        <div className="field-group">
          <label className="field-label">PNG Rate (₹/SCM)</label>
          <input
            className="field-input"
            type="number"
            step="1"
            placeholder="70"
            value={data.pngRate || ""}
            onChange={(e) => onChange("pngRate", parseFloat(e.target.value) || "")}
          />
          <span className="field-hint">Default: ₹70/SCM</span>
        </div>
        <div className="field-group">
          <label className="field-label">Baseline System</label>
          <select
            className="field-input"
            value={data.baseline || "PNG Boiler"}
            onChange={(e) => onChange("baseline", e.target.value)}
          >
            <option value="PNG Boiler">PNG Boiler (80% efficiency)</option>
            <option value="Electric Resistance">Electric Resistance (COP 1.0)</option>
            <option value="LPG Boiler">LPG Boiler (80% efficiency)</option>
          </select>
        </div>
      </div>
    </div>
  );
}