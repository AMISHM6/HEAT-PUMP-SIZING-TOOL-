import React, { useState } from "react";
import StepProjectInfo from "./components/steps/StepProjectInfo";
import StepHPType from "./components/steps/StepHPType";
import Results from "./components/Results";
import BackgroundMachines from "./components/BackgroundMachines";
import { runSizingEngine } from "./utils/sizingEngine";
import "./styles.css";

const defaultData = {
  projectName: "", city: "", buildingType: "", units: "",
  personsPerUnit: "", litresPerPerson: "",
  hpType: "", investment: "", electricityRate: "", pngRate: "",
  baseline: "PNG Boiler",
};

const STEPS = ["Project Info", "HP Selection", "Results"];

function validate(step, d) {
  if (step === 1) return d.city && d.buildingType && d.units > 0;
  if (step === 2) return !!d.hpType;
  return true;
}

export default function App() {
  const [step, setStep]             = useState(1);
  const [furthestStep, setFurthest] = useState(1);
  const [data, setData]             = useState(defaultData);
  const [results, setResults]       = useState(null);
  const [error, setError]           = useState("");

  const set = (k, v) => { setData((p) => ({ ...p, [k]: v })); setError(""); };

  const goToStep = (target) => {
    if (target < 1 || target > 3 || target > furthestStep) return;
    if (target === 3 && !results) return;
    setStep(target);
    setError("");
  };

  const back = () => {
    if (step > 1) goToStep(step - 1);
  };

  const next = () => {
    if (!validate(step, data)) {
      setError("Please complete all required fields.");
      return;
    }
    setError("");
    if (step === 2) {
      try {
        const r = runSizingEngine(data);
        setResults(r);
        setFurthest(3);
        setStep(3);
      } catch (e) {
        setError("Calculation error: " + e.message);
      }
    } else {
      const nextStep = step + 1;
      setFurthest((f) => Math.max(f, nextStep));
      setStep(nextStep);
    }
  };

  const reset = () => {
    setData(defaultData);
    setResults(null);
    setStep(1);
    setFurthest(1);
    setError("");
  };

  return (
    <div className="shell">
      <div className="bg-mesh" />
      <BackgroundMachines />

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
            <nav className="step-dots" aria-label="Form progress">
              {STEPS.map((label, i) => {
                const n = i + 1;
                const isCurrent = n === step;
                const isDone = n < step;
                const reachable = n <= furthestStep && (n !== 3 || results);
                return (
                  <button
                    key={label}
                    type="button"
                    className={`dot ${isCurrent ? "active" : ""} ${isDone ? "done" : ""}`}
                    disabled={!reachable}
                    onClick={() => goToStep(n)}
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    <span>{isDone ? "✓" : n}</span>
                    <label>{label}</label>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      <main className="main">
        <div className={`card ${step === 3 ? "card-wide" : ""}`}>
          {step === 1 && <StepProjectInfo data={data} onChange={set} />}
          {step === 2 && <StepHPType data={data} onChange={set} />}
          {step === 3 && <Results results={results} onReset={reset} />}

          {error && <div className="err-bar">⚠ {error}</div>}

          <div className="nav-bar">
            {step > 1 && (
              <button type="button" className="btn-back" onClick={back}>
                ← Back
              </button>
            )}
            <div style={{ flex: 1 }} />
            {step < 3 && (
              <button type="button" className="btn-next" onClick={next}>
                {step === 2 ? "Calculate →" : "Continue →"}
              </button>
            )}
          </div>
        </div>
      </main>

      <footer className="foot">
        IS 1391 · IS 655 · ECBC 2017 · NBC 2016 &nbsp;·&nbsp; Built for MEP / HVAC Consultants
      </footer>
    </div>
  );
}
