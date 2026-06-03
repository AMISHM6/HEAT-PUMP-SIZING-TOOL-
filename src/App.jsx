import React, { useState } from "react";
import StepProjectInfo from "./components/steps/StepProjectInfo";
import StepHPType from "./components/steps/StepHPType";
import Results from "./components/Results";
import { runSizingEngine } from "./utils/sizingEngine";
import "./styles.css";

const defaultData = {
  projectName: "", city: "", buildingType: "", units: "",
  hpType: "", investment: "", electricityRate: "", pngRate: "",
  baseline: "PNG Boiler",
};

function validate(step, d) {
  if (step === 1) return d.city && d.buildingType && d.units > 0;
  if (step === 2) return !!d.hpType;
  return true;
}

export default function App() {
  const [step, setStep]       = useState(1);
  const [data, setData]       = useState(defaultData);
  const [results, setResults] = useState(null);
  const [error, setError]     = useState("");

  const set = (k, v) => { setData((p) => ({ ...p, [k]: v })); setError(""); };

  const next = () => {
    if (!validate(step, data)) { setError("Please complete all required fields."); return; }
    setError("");
    if (step === 2) {
      try {
        const r = runSizingEngine(data);
        setResults(r);
        setStep(3);
      } catch (e) { setError("Calculation error: " + e.message); }
    } else { setStep(step + 1); }
  };

  const reset = () => { setData(defaultData); setResults(null); setStep(1); setError(""); };

  const STEPS = ["Project Info", "HP Selection", "Results"];

  return (
    <div className="shell">
      {/* Ambient background */}
      <div className="bg-mesh" />

      {/* Header */}
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <div className="brand-mark">HP</div>
            <div>
              <div className="brand-name">HeatPump<span>Pro</span></div>
              <div className="brand-sub">IS / ECBC Sizing Engine</div>
            </div>
          </div>
          <div className="topbar-right">
            {step < 3 && (
              <div className="step-dots">
                {STEPS.map((s, i) => (
                  <div key={i} className={`dot ${i + 1 === step ? "active" : ""} ${i + 1 < step ? "done" : ""}`}>
                    <span>{i + 1 < step ? "✓" : i + 1}</span>
                    <label>{s}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="main">
        <div className={`card ${step === 3 ? "card-wide" : ""}`}>
          {step === 1 && <StepProjectInfo data={data} onChange={set} />}
          {step === 2 && <StepHPType data={data} onChange={set} />}
          {step === 3 && <Results results={results} onReset={reset} />}

          {error && <div className="err-bar">⚠ {error}</div>}

          {step < 3 && (
            <div className="nav-bar">
              {step > 1 && <button className="btn-back" onClick={() => { setStep(step - 1); setError(""); }}>← Back</button>}
              <div style={{ flex: 1 }} />
              <button className="btn-next" onClick={next}>
                {step === 2 ? "Calculate →" : "Continue →"}
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="foot">
        IS 1391 · IS 655 · ECBC 2017 · NBC 2016 &nbsp;·&nbsp; Built for MEP / HVAC Consultants
      </footer>
    </div>
  );
}
