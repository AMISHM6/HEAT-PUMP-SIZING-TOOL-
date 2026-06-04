import React from "react";
import { CITIES } from "../../data/climateData";

const BUILDING_TYPES = ["Hotel", "Hospital", "Residential", "Commercial", "Industrial"];

const UNIT_LABELS = {
  Hotel: "Number of Rooms",
  Hospital: "Number of Beds",
  Residential: "Number of Flats / Units",
  Commercial: "Number of Occupants",
  Industrial: "Number of Workers",
};

const DEFAULT_PERSONS = {
  "Hotel": 2, "Hospital": 2, "Residential": 4, "Commercial": 1, "Industrial": 1,
};

const DEFAULT_LITRES = {
  "Hotel": 40, "Hospital": 100, "Residential": 30, "Commercial": 15, "Industrial": 25,
};

export default function StepProjectInfo({ data, onChange }) {
  const cityData = data.city ? CITIES[data.city] : null;

  return (
    <div className="step-body">
      <div className="step-eyebrow">Step 01</div>
      <h2 className="step-heading">Project Details</h2>
      <p className="step-sub">Tell us about your building and location</p>

      <div className="field-group">
        <label className="field-label">Project Name <span className=""></span></label>
        <input
          className="field-input"
          type="text"
          placeholder=""
          value={data.projectName || ""}
          onChange={(e) => onChange("projectName", e.target.value)}
        />
      </div>

      <div className="field-row">
        <div className="field-group">
          <label className="field-label">City</label>
          <select
            className="field-input"
            value={data.city || ""}
            onChange={(e) => onChange("city", e.target.value)}
          >
            <option value="">Select city…</option>
            {Object.keys(CITIES).sort().map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="field-group">
          <label className="field-label">IS Climate Zone</label>
          <input
            className="field-input readonly"
            type="text"
            readOnly
            value={cityData ? cityData.zone : "— auto-filled —"}
          />
        </div>
      </div>

      {cityData && (
        <div className="climate-strip">
          <div className="climate-pill">
            <span className="cpill-icon">☀️</span>
            <span className="cpill-label">Cooling Design Temp</span>
            <strong>{cityData.designTempC}°C</strong>
          </div>
          <div className="climate-pill">
            <span className="cpill-icon">❄️</span>
            <span className="cpill-label">Heating Design Temp</span>
            <strong>{cityData.designTempH}°C</strong>
          </div>
        </div>
      )}

      <div className="field-group">
        <label className="field-label">Building Type</label>
        <div className="type-grid">
          {BUILDING_TYPES.map((bt) => (
            <button
              key={bt}
              type="button"
              className={`type-btn ${data.buildingType === bt ? "selected" : ""}`}
              onClick={() => onChange("buildingType", bt)}
            >
              {bt}
            </button>
          ))}
        </div>
      </div>

      {data.buildingType && (
        <div className="field-group">
          <label className="field-label">{UNIT_LABELS[data.buildingType]}</label>
          <input
            className="field-input"
            type="number"
            min="1"
            placeholder="e.g. 200"
            value={data.units || ""}
            onChange={(e) => onChange("units", parseInt(e.target.value) || "")}
          />
        </div>
      )}

      {data.buildingType && (
        <div className="field-row">
          <div className="field-group">
            <label className="field-label">Avg Persons per Unit</label>
            <input
              className="field-input"
              type="number"
              min="1"
              step="1"
              placeholder={String(DEFAULT_PERSONS[data.buildingType] ?? 2)}
              value={data.personsPerUnit ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                onChange("personsPerUnit", v === "" ? "" : parseInt(v, 10));
              }}
            />
            <span className="field-hint">
              Default: {DEFAULT_PERSONS[data.buildingType]} persons per unit
            </span>
            
          </div>

          <div className="field-group">
            <label className="field-label">Hot Water per Person (L/day)</label>
            <input
              className="field-input"
              type="number"
              min="1"
              value={data.litresPerPerson || DEFAULT_LITRES[data.buildingType] || 40}
              onChange={(e) => onChange("litresPerPerson", parseFloat(e.target.value) || 40)}
            />
            <span className="field-hint">
              Default: {DEFAULT_LITRES[data.buildingType]}L — IS/NBC standard
            </span>
          </div>
        </div>
      )}

    </div>
  );
}