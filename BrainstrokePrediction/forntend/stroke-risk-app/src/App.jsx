import React, { useState } from "react";
import {
  Brain,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Smile,
  Hand,
  MessageCircle,
  Clock,
  Droplet,
  Scale,
  Cigarette,
  HeartPulse,
  ShieldAlert,
  Info,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Point this at your running Flask backend (see final_stroke_prediction app).
// Example: const API_URL = "http://localhost:3000/predict";
// ---------------------------------------------------------------------------
const API_URL = "http://localhost:3000/predict";

const FAST_SIGNS = [
  {
    letter: "F",
    word: "Face",
    detail: "One side droops or feels numb when smiling.",
    Icon: Smile,
  },
  {
    letter: "A",
    word: "Arms",
    detail: "One arm drifts downward when both are raised.",
    Icon: Hand,
  },
  {
    letter: "S",
    word: "Speech",
    detail: "Words come out slurred or hard to understand.",
    Icon: MessageCircle,
  },
  {
    letter: "T",
    word: "Time",
    detail: "Call emergency services the moment signs appear.",
    Icon: Clock,
  },
];

const RISK_FACTS = [
  {
    Icon: HeartPulse,
    title: "Blood flow, interrupted",
    body: "A stroke happens when blood supply to part of the brain is cut off or a vessel bursts, starving brain cells of oxygen within minutes.",
  },
  {
    Icon: ShieldAlert,
    title: "Often preventable",
    body: "Blood pressure, glucose, weight, and smoking status are the levers most strongly linked to risk, and most of them are manageable.",
  },
  {
    Icon: Clock,
    title: "Minutes shape the outcome",
    body: "Treatment within the first hours after symptoms start meaningfully changes the chance of recovery.",
  },
];

const initialForm = {
  gender: "Female",
  age: 45,
  hypertension: "0",
  heart_disease: "0",
  ever_married: "Yes",
  work_type: "Private",
  Residence_type: "Urban",
  avg_glucose_level: 100,
  bmi: 24,
  smoking_status: "never smoked",
};



function simulateLocal(f) {
  let score = 0.03;
  score += (Number(f.age) / 100) * 0.42;
  score += Number(f.hypertension) * 0.14;
  score += Number(f.heart_disease) * 0.16;
  score += Number(f.avg_glucose_level) > 150 ? 0.14 : 0.02;
  score += Number(f.bmi) > 30 ? 0.08 : 0;
  score += f.smoking_status === "smokes" ? 0.09 : 0;
  score += f.smoking_status === "formerly smoked" ? 0.04 : 0;
  const probability = Math.min(0.95, Math.max(0.02, score));
  return {
    prediction: probability >= 0.18 ? 1 : 0,
    probability_of_stroke: probability,
  };
}

function PulseLine({ tone = "calm", className = "" }) {
  const colorClass =
    tone === "calm"
      ? "text-emerald-400"
      : tone === "alert"
      ? "text-rose-400"
      : "text-cyan-300";
  const path =
    tone === "alert"
      ? "M0,40 L60,40 L80,40 L95,8 L110,72 L125,40 L160,40 L180,40 L195,15 L210,40 L260,40 L280,40 L300,8 L320,72 L335,40 L420,40 L440,40 L455,15 L470,40 L520,40 L540,40 L555,8 L575,72 L590,40 L640,40"
      : "M0,40 L70,40 L90,40 L100,26 L115,54 L130,40 L160,40 L350,40 L370,40 L380,26 L395,54 L410,40 L440,40 L640,40";

  return (
    <svg
      viewBox="0 0 640 80"
      className={`pulse-svg ${colorClass} ${className}`}
      preserveAspectRatio="none"
    >
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400";

function Toggle({ value, onChange, leftLabel, rightLabel, leftValue, rightValue }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {[
        [leftLabel, leftValue],
        [rightLabel, rightValue],
      ].map(([label, val]) => (
        <button
          type="button"
          key={val}
          onClick={() => onChange(val)}
          className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
            value === val
              ? "border-emerald-400 bg-emerald-400/10 text-emerald-300"
              : "border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default function StrokeRiskApp() {
  const [page, setPage] = useState("home");
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [notice, setNotice] = useState(null);

  const set = (key) => (e) =>
    setForm((f) => ({
      ...f,
      [key]: e && e.target ? e.target.value : e,
    }));

  async function handlePredict() {
    setLoading(true);
    setNotice(null);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
  gender: form.gender,
  age: Number(form.age),
  hypertension: Number(form.hypertension),
  heart_disease: Number(form.heart_disease),
  ever_married: form.ever_married,
  work_type: form.work_type,
  Residence_type: form.Residence_type,
  avg_glucose_level: Number(form.avg_glucose_level),
  bmi: Number(form.bmi),
  smoking_status: form.smoking_status
}),
      });
      if (!res.ok) throw new Error("Server responded with an error");
      const data = await res.json();
      setResult(data);
      setPage("result");
    } catch (err) {
      setResult(simulateLocal(form));
      setNotice(
        "Couldn't reach the prediction server, so this is a simulated estimate. Connect API_URL to your Flask backend for real predictions."
      );
      setPage("result");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-mono-data { font-family: 'JetBrains Mono', monospace; }
        .pulse-svg { width: 100%; height: 64px; }
        @keyframes pulseTravel {
          0% { stroke-dashoffset: 640; }
          100% { stroke-dashoffset: 0; }
        }
        .pulse-svg path {
          stroke-dasharray: 640;
          animation: pulseTravel 2.6s linear infinite;
        }
        .pulse-svg.slow path { animation-duration: 4s; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease both; }
      `}</style>

      {page === "home" && <Home onStart={() => setPage("form")} />}
      {page === "form" && (
        <FormPage
          form={form}
          set={set}
          setForm={setForm}
          loading={loading}
          onBack={() => setPage("home")}
          onSubmit={handlePredict}
        />
      )}
      {page === "result" && (
        <ResultPage
          result={result}
          notice={notice}
          onRetry={() => setPage("form")}
          onHome={() => {
            setPage("home");
            setResult(null);
          }}
        />
      )}
    </div>
  );
}

function Home({ onStart }) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      {/* Hero */}
      <div className="fade-up">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-emerald-300">
          <Brain className="h-3.5 w-3.5" />
          Brain Stroke Risk Screening
        </div>
        <h1 className="font-display max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
          When blood stops reaching the brain,{" "}
          <span className="text-emerald-400">every minute matters.</span>
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
          Stroke remains one of the leading causes of death and long-term
          disability worldwide — and one of the most preventable, once you
          know your risk factors. Answer a few questions about your health
          to see where you stand.
        </p>

        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <PulseLine tone="calm" />
        </div>

        <button
          onClick={onStart}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 active:scale-[0.98]"
        >
          Check Your Risk
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Facts */}
      <div className="mt-24 grid gap-5 sm:grid-cols-3">
        {RISK_FACTS.map(({ Icon, title, body }) => (
          <div
            key={title}
            className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6"
          >
            <Icon className="h-6 w-6 text-emerald-400" />
            <h3 className="font-display mt-4 text-lg font-semibold text-white">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              {body}
            </p>
          </div>
        ))}
      </div>

      {/* FAST signs */}
      <div className="mt-24">
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
          Know the warning signs: F.A.S.T.
        </h2>
        <p className="mt-2 max-w-xl text-sm text-slate-400">
          Each letter marks a check worth doing the moment something looks
          off — in order, in under a minute.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          {FAST_SIGNS.map(({ letter, word, detail, Icon }) => (
            <div
              key={letter}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-3xl font-bold text-emerald-400">
                  {letter}
                </span>
                <Icon className="h-5 w-5 text-slate-500" />
              </div>
              <h4 className="font-display mt-3 text-sm font-semibold text-white">
                {word}
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                {detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA repeat */}
      <div className="mt-24 flex flex-col items-start justify-between gap-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-8 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-display text-xl font-semibold text-white">
            Ready to see your estimate?
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Takes about a minute. Ten quick health details, one risk
            readout.
          </p>
        </div>
        <button
          onClick={onStart}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 active:scale-[0.98]"
        >
          Start Assessment
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-10 flex items-start gap-2 text-xs leading-relaxed text-slate-600">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        This tool produces a statistical estimate, not a medical diagnosis.
        Always consult a qualified clinician for evaluation or concerns
        about stroke symptoms.
      </p>
    </div>
  );
}

function FormPage({ form, set, setForm, loading, onBack, onSubmit }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-slate-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <h1 className="font-display mt-6 text-2xl font-bold text-white sm:text-3xl">
        Your health details
      </h1>
      <p className="mt-1 text-sm text-slate-400">
        Used only to compute this estimate — nothing is stored.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="mt-8 space-y-8"
      >
        {/* Personal */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="font-display text-xs font-semibold uppercase tracking-wider text-slate-500">
            Personal
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Gender">
              <select
                className={inputCls}
                value={form.gender}
                onChange={set("gender")}
              >
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </select>
            </Field>
            <Field label="Age">
              <input
                type="number"
                min="0"
                max="120"
                className={inputCls}
                value={form.age}
                onChange={set("age")}
              />
            </Field>
            <Field label="Marital status">
              <Toggle
                value={form.ever_married}
                onChange={(v) => setForm((f) => ({ ...f, ever_married: v }))}
                leftLabel="Married"
                leftValue="Yes"
                rightLabel="Never married"
                rightValue="No"
              />
            </Field>
            <Field label="Residence">
              <Toggle
                value={form.Residence_type}
                onChange={(v) =>
                  setForm((f) => ({ ...f, Residence_type: v }))
                }
                leftLabel="Urban"
                leftValue="Urban"
                rightLabel="Rural"
                rightValue="Rural"
              />
            </Field>
            <Field label="Work type">
              <select
                className={inputCls}
                value={form.work_type}
                onChange={set("work_type")}
              >
                <option value="Private">Private</option>
                <option value="Self-employed">Self-employed</option>
                <option value="Govt_job">Government job</option>
                <option value="children">Child / student</option>
                <option value="Never_worked">Never worked</option>
              </select>
            </Field>
          </div>
        </section>

        {/* Vitals */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="font-display flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Droplet className="h-3.5 w-3.5" />
            Vitals
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Average glucose level (mg/dL)">
              <input
                type="number"
                step="0.1"
                className={inputCls}
                value={form.avg_glucose_level}
                onChange={set("avg_glucose_level")}
              />
            </Field>
            <Field label="BMI (kg/m²)">
              <input
                type="number"
                step="0.1"
                className={inputCls}
                value={form.bmi}
                onChange={set("bmi")}
              />
            </Field>
          </div>
        </section>

        {/* History */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="font-display flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Scale className="h-3.5 w-3.5" />
            Health history
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Hypertension">
              <Toggle
                value={form.hypertension}
                onChange={(v) => setForm((f) => ({ ...f, hypertension: v }))}
                leftLabel="No"
                leftValue="0"
                rightLabel="Yes"
                rightValue="1"
              />
            </Field>
            <Field label="Heart disease">
              <Toggle
                value={form.heart_disease}
                onChange={(v) =>
                  setForm((f) => ({ ...f, heart_disease: v }))
                }
                leftLabel="No"
                leftValue="0"
                rightLabel="Yes"
                rightValue="1"
              />
            </Field>
            <Field label="Smoking status">
              <select
                className={inputCls}
                value={form.smoking_status}
                onChange={set("smoking_status")}
              >
                <option value="never smoked">Never smoked</option>
                <option value="formerly smoked">Formerly smoked</option>
                <option value="smokes">Currently smokes</option>
                <option value="Unknown">Prefer not to say</option>
              </select>
            </Field>
          </div>
        </section>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Calculating...
            </>
          ) : (
            <>
              <Activity className="h-4 w-4" />
              Predict My Risk
            </>
          )}
        </button>
      </form>
    </div>
  );
}

function ResultPage({ result, notice, onRetry, onHome }) {
  const probability =
  result?.stroke_probability ??
  result?.probability_of_stroke ??
  0;

const pct = (probability * 100).toFixed(2);

const isStroke = result?.prediction === 1;
  const band =
    probability < 0.1 ? "Low" : probability < 0.25 ? "Moderate" : "High";
  const tone = isStroke ? "alert" : "calm";

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="fade-up rounded-3xl border border-slate-800 bg-slate-900/50 p-8 sm:p-10">
        <div
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider ${
            isStroke
              ? "bg-rose-400/10 text-rose-300"
              : "bg-emerald-400/10 text-emerald-300"
          }`}
        >
          {isStroke ? (
            <AlertTriangle className="h-3.5 w-3.5" />
          ) : (
            <CheckCircle2 className="h-3.5 w-3.5" />
          )}
          {band} estimated risk
        </div>

        <h1 className="font-display mt-5 text-3xl font-bold leading-tight text-white sm:text-4xl">
  {isStroke
    ? "⚠️ You may get a Stroke"
    : "✅ You are unlikely to get a Stroke"}
</h1>
        <p className="mt-2 text-sm text-slate-400">
  {isStroke
    ? `Prediction: STROKE DETECTED`
    : `Prediction: NO STROKE DETECTED`}
</p>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-6">
          <PulseLine tone={tone} />
        </div>
        <div
  className={`mt-6 rounded-xl p-5 text-center font-bold text-lg ${
    isStroke
      ? "bg-red-500/20 text-red-400 border border-red-500"
      : "bg-green-500/20 text-green-400 border border-green-500"
  }`}
>
  {isStroke
    ? "⚠️ You may get a Stroke"
    : "✅ You are unlikely to get a Stroke"}
</div>

<div className="mt-4 rounded-xl border border-slate-700 p-5">
  <div className="text-sm text-slate-400">
    Stroke Probability
  </div>

  <div className="mt-2 text-5xl font-bold text-white">
    {pct}%
  </div>

  <div className="mt-2 text-xs text-slate-500">
    Threshold Used: {((result?.threshold || 0) * 100).toFixed(2)}%
  </div>
</div>

        {/* <div className="mt-8 flex items-end justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-500">
              Estimated probability
            </span>
            <div
              className={`font-mono-data mt-1 text-5xl font-bold ${
                isStroke ? "text-rose-400" : "text-emerald-400"
              }`}
            >
              {pct}%
            </div>
          </div>
          <div className="w-1/2">
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full rounded-full ${
                  isStroke ? "bg-rose-400" : "bg-emerald-400"
                }`}
                style={{ width: `${Math.min(100, pct)}%` }}
              />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-slate-600">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        </div> */}

        {notice && (
          <div className="mt-6 flex items-start gap-2 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-xs leading-relaxed text-amber-300">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {notice}
          </div>
        )}

        <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-slate-600">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          This is a statistical estimate, not a medical diagnosis. If you or
          someone nearby is showing F.A.S.T. warning signs right now, treat
          it as an emergency and seek immediate medical care.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onRetry}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-slate-600"
          >
            <Activity className="h-4 w-4" />
            Run Another Check
          </button>
          <button
            onClick={onHome}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-800 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}