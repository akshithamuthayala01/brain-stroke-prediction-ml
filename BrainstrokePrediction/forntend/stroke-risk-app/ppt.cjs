const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "Brain Stroke Prediction";

// ── Palette ──────────────────────────────────────────────
const C = {
  navy:    "1E2A3A",   // dark bg for title/section headers
  white:   "FFFFFF",
  offWhite:"F7F9FC",
  text:    "1E2A3A",
  muted:   "64748B",
  emerald: "059669",
  emeraldLight: "D1FAE5",
  slate:   "E2E8F0",
  accent:  "0EA5E9",
};

// ── Helpers ───────────────────────────────────────────────
const makeShadow = () => ({ type: "outer", color: "000000", blur: 4, offset: 2, angle: 45, opacity: 0.08 });

// Small tag chip (colored pill label)
function addTag(slide, text, x, y, bgColor, txtColor) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 1.6, h: 0.28, fill: { color: bgColor }, rectRadius: 0.05, line: { color: bgColor } });
  slide.addText(text, { x, y, w: 1.6, h: 0.28, fontSize: 9, bold: true, color: txtColor, align: "center", valign: "middle", margin: 0 });
}

// Section header bar (simple colored rect behind title)
function addSlideHeader(slide, title, subtitle) {
  slide.background = { color: C.white };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.72, fill: { color: C.navy }, line: { color: C.navy } });
  slide.addText(title, { x: 0.4, y: 0, w: 8, h: 0.72, fontSize: 20, bold: true, color: C.white, valign: "middle", margin: 0 });
  if (subtitle) {
    slide.addText(subtitle, { x: 0.4, y: 0.72, w: 9.2, h: 0.35, fontSize: 11, color: C.muted, italic: true, margin: 0 });
  }
}

// Card box
function addCard(slide, x, y, w, h, fillColor) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h,
    fill: { color: fillColor || C.offWhite },
    rectRadius: 0.08,
    line: { color: C.slate, width: 0.5 },
    shadow: makeShadow(),
  });
}

// ═══════════════════════════════════════════════════════════
// SLIDE 1 – Title
// ═══════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  // Subtle top-right circle decoration
  s.addShape(pres.shapes.OVAL, { x: 7.8, y: -0.6, w: 3.2, h: 3.2, fill: { color: "0EA5E9", transparency: 88 }, line: { color: "0EA5E9", transparency: 88 } });
  s.addShape(pres.shapes.OVAL, { x: 8.5, y: 3.8, w: 2, h: 2, fill: { color: "059669", transparency: 88 }, line: { color: "059669", transparency: 88 } });

  // Internship badge
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 0.55, w: 3.6, h: 0.32, fill: { color: "059669", transparency: 20 }, rectRadius: 0.06, line: { color: "059669" } });
  s.addText("1M1B × IBM SkillsBuild × AICTE Internship", { x: 0.5, y: 0.55, w: 3.6, h: 0.32, fontSize: 8.5, bold: true, color: "D1FAE5", align: "center", valign: "middle", margin: 0 });

  s.addText("Brain Stroke", { x: 0.5, y: 1.05, w: 8.5, h: 0.9, fontSize: 48, bold: true, color: C.white, fontFace: "Cambria", margin: 0 });
  s.addText("Prediction", { x: 0.5, y: 1.9, w: 8.5, h: 0.9, fontSize: 48, bold: true, color: "34D399", fontFace: "Cambria", margin: 0 });

  s.addText("AI-powered early risk screening using machine learning", {
    x: 0.5, y: 2.92, w: 7, h: 0.4, fontSize: 14, color: "94A3B8", italic: true, margin: 0,
  });

  // Divider line
  s.addShape(pres.shapes.LINE, { x: 0.5, y: 3.52, w: 3, h: 0, line: { color: "34D399", width: 1.5 } });

  // Name & College
  s.addText("Muthyala Venkata Sai Akshitha", { x: 0.5, y: 3.72, w: 7, h: 0.32, fontSize: 13, bold: true, color: C.white, margin: 0 });
  s.addText("GIET College", { x: 0.5, y: 4.06, w: 7, h: 0.28, fontSize: 11, color: "94A3B8", margin: 0 });

  // SDG tag bottom-right
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.8, y: 4.9, w: 1.7, h: 0.32, fill: { color: "0EA5E9", transparency: 20 }, rectRadius: 0.06, line: { color: "0EA5E9" } });
  s.addText("SDG 3: Good Health", { x: 7.8, y: 4.9, w: 1.7, h: 0.32, fontSize: 8, bold: true, color: "E0F2FE", align: "center", valign: "middle", margin: 0 });
}

// ═══════════════════════════════════════════════════════════
// SLIDE 2 – Problem Statement
// ═══════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addSlideHeader(s, "Problem Statement", "Why does early stroke prediction matter?");

  // 3 stat cards
  const stats = [
    { num: "12M+",  label: "stroke cases\nper year globally",  col: C.emerald },
    { num: "~80%",  label: "strokes are\npreventable",         col: C.accent  },
    { num: "1 in 4",label: "people will have\na stroke in their lifetime", col: "E11D48" },
  ];
  stats.forEach((st, i) => {
    const x = 0.4 + i * 3.1;
    addCard(s, x, 1.22, 2.8, 1.55, C.offWhite);
    s.addText(st.num, { x, y: 1.3, w: 2.8, h: 0.65, fontSize: 34, bold: true, color: st.col, align: "center", fontFace: "Cambria", margin: 0 });
    s.addText(st.label, { x, y: 1.98, w: 2.8, h: 0.6, fontSize: 11, color: C.muted, align: "center", margin: 0 });
  });

  // Problem text
  addCard(s, 0.4, 3.0, 9.2, 1.2, "FEF9C3");
  s.addText("Problem Statement", { x: 0.6, y: 3.08, w: 4, h: 0.28, fontSize: 10, bold: true, color: "92400E", margin: 0 });
  s.addText(
    "How might we use AI to predict a person's stroke risk early so that individuals and healthcare providers can take preventive action and improve health outcomes — aligning with SDG 3: Good Health & Well-being?",
    { x: 0.6, y: 3.36, w: 9.0, h: 0.75, fontSize: 12, color: C.text, italic: true, margin: 0 }
  );
}

// ═══════════════════════════════════════════════════════════
// SLIDE 3 – SDG Alignment
// ═══════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addSlideHeader(s, "SDG Alignment");

  // Primary SDG card
  addCard(s, 0.4, 1.1, 4.4, 2.5, "ECFDF5");
  s.addText("Primary SDG", { x: 0.6, y: 1.18, w: 4, h: 0.28, fontSize: 9, bold: true, color: C.muted, margin: 0 });
  s.addShape(pres.shapes.OVAL, { x: 0.65, y: 1.52, w: 0.7, h: 0.7, fill: { color: C.emerald }, line: { color: C.emerald } });
  s.addText("3", { x: 0.65, y: 1.52, w: 0.7, h: 0.7, fontSize: 22, bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
  s.addText("Good Health\n& Well-being", { x: 1.5, y: 1.52, w: 3.1, h: 0.7, fontSize: 15, bold: true, color: C.text, valign: "middle", margin: 0 });
  s.addText([
    { text: "• ", options: { bullet: false } },
    { text: "Reduce premature mortality from non-communicable diseases\n", options: {} },
    { text: "• ", options: { bullet: false } },
    { text: "Promote mental health and well-being\n", options: {} },
    { text: "• ", options: { bullet: false } },
    { text: "Universal access to health-care services", options: {} },
  ], { x: 0.6, y: 2.35, w: 4.0, h: 1.1, fontSize: 11, color: C.text, margin: 0 });

  // Secondary SDGs
  addCard(s, 5.1, 1.1, 4.5, 2.5, C.offWhite);
  s.addText("Secondary SDGs", { x: 5.3, y: 1.18, w: 4, h: 0.28, fontSize: 9, bold: true, color: C.muted, margin: 0 });

  const sec = [
    { n: "10", label: "Reduced Inequalities", sub: "Accessible to all income levels", col: "7C3AED" },
    { n: "17", label: "Partnerships for Goals", sub: "IBM × AICTE × 1M1B", col: "0EA5E9" },
  ];
  sec.forEach((sg, i) => {
    const y = 1.52 + i * 1.0;
    s.addShape(pres.shapes.OVAL, { x: 5.25, y, w: 0.55, h: 0.55, fill: { color: sg.col }, line: { color: sg.col } });
    s.addText(sg.n, { x: 5.25, y, w: 0.55, h: 0.55, fontSize: 14, bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
    s.addText(sg.label, { x: 5.95, y, w: 3.5, h: 0.28, fontSize: 12, bold: true, color: C.text, valign: "middle", margin: 0 });
    s.addText(sg.sub, { x: 5.95, y: y + 0.28, w: 3.5, h: 0.25, fontSize: 10, color: C.muted, margin: 0 });
  });

  // How project aligns
  addCard(s, 0.4, 3.75, 9.2, 1.0, "EFF6FF");
  s.addText("Project Alignment:", { x: 0.6, y: 3.83, w: 2, h: 0.25, fontSize: 10, bold: true, color: C.accent, margin: 0 });
  s.addText("This project uses AI/ML to predict stroke risk from health parameters, enabling early intervention and promoting accessible, preventive healthcare — directly supporting SDG 3 targets.", {
    x: 0.6, y: 4.1, w: 9.0, h: 0.5, fontSize: 11, color: C.text, margin: 0
  });
}

// ═══════════════════════════════════════════════════════════
// SLIDE 4 – AI Solution Overview
// ═══════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addSlideHeader(s, "AI Solution Overview", "A full-stack stroke risk prediction system");

  const components = [
    { title: "ML Model",       body: "Logistic Regression trained on Kaggle stroke dataset with GridSearchCV hyperparameter tuning & threshold optimization",            col: C.emeraldLight, tc: "065F46" },
    { title: "Flask API",      body: "Python backend exposing /predict endpoint. Loads saved artifacts (scaler, IQR bounds, dummy columns) for consistent preprocessing", col: "DBEAFE",        tc: "1E40AF" },
    { title: "React Frontend", body: "3-page app (Home → Form → Result). Collects 10 health inputs, calls API, shows stroke probability with risk level indicator",       col: "FEE2E2",        tc: "991B1B" },
  ];

  components.forEach((c, i) => {
    const y = 1.15 + i * 1.38;
    addCard(s, 0.4, y, 9.2, 1.22, c.col);
    s.addShape(pres.shapes.OVAL, { x: 0.55, y: y + 0.28, w: 0.55, h: 0.55, fill: { color: c.tc }, line: { color: c.tc } });
    s.addText(String(i + 1), { x: 0.55, y: y + 0.28, w: 0.55, h: 0.55, fontSize: 14, bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
    s.addText(c.title, { x: 1.25, y: y + 0.1, w: 7.8, h: 0.3, fontSize: 13, bold: true, color: c.tc, margin: 0 });
    s.addText(c.body,  { x: 1.25, y: y + 0.44, w: 8.0, h: 0.6, fontSize: 11, color: C.text, margin: 0 });
  });
}

// ═══════════════════════════════════════════════════════════
// SLIDE 5 – System Architecture
// ═══════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addSlideHeader(s, "System Architecture");

  const steps = [
    { label: "Dataset",         sub: "Kaggle Stroke\nCSV Data",        col: "DBEAFE", tc: "1E40AF" },
    { label: "ML Pipeline",     sub: "Notebook:\nTrain & Save",        col: C.emeraldLight, tc: "065F46" },
    { label: "Artifacts",       sub: ".joblib file\n(model + scaler)", col: "FEF3C7", tc: "92400E" },
    { label: "Flask API",       sub: "Preprocess\n+ Predict",          col: "FEE2E2", tc: "991B1B" },
    { label: "React UI",        sub: "User inputs\n& Results",         col: "F3E8FF", tc: "6D28D9" },
  ];

  const boxW = 1.55, boxH = 1.35, startX = 0.3, y = 1.6, gap = 0.25;

  steps.forEach((st, i) => {
    const x = startX + i * (boxW + gap + 0.38);
    addCard(s, x, y, boxW, boxH, st.col);
    s.addText(st.label, { x, y: y + 0.14, w: boxW, h: 0.32, fontSize: 11, bold: true, color: st.tc, align: "center", margin: 0 });
    s.addText(st.sub,   { x, y: y + 0.52, w: boxW, h: 0.6,  fontSize: 9.5, color: C.text, align: "center", margin: 0 });

    // Arrow (not after last)
    if (i < steps.length - 1) {
      const ax = x + boxW + 0.06;
      s.addShape(pres.shapes.LINE, { x: ax, y: y + boxH / 2, w: 0.3, h: 0, line: { color: C.muted, width: 1.5 } });
      // arrowhead triangle approximation via text
      s.addText("▶", { x: ax + 0.22, y: y + boxH / 2 - 0.15, w: 0.18, h: 0.3, fontSize: 9, color: C.muted, margin: 0 });
    }
  });

  // Legend note
  s.addText("Data flows from raw CSV → trained model saved as .joblib → loaded by Flask → queried by React frontend", {
    x: 0.4, y: 3.2, w: 9.2, h: 0.4, fontSize: 10.5, color: C.muted, italic: true, align: "center", margin: 0
  });

  // Key inputs label
  addCard(s, 0.4, 3.72, 9.2, 1.0, C.offWhite);
  s.addText("10 Input Features:", { x: 0.6, y: 3.8, w: 2.2, h: 0.25, fontSize: 10, bold: true, color: C.text, margin: 0 });
  s.addText("Gender  ·  Age  ·  Hypertension  ·  Heart Disease  ·  Ever Married  ·  Work Type  ·  Residence Type  ·  Avg Glucose Level  ·  BMI  ·  Smoking Status", {
    x: 0.6, y: 4.08, w: 9.0, h: 0.45, fontSize: 11, color: C.muted, margin: 0
  });
}

// ═══════════════════════════════════════════════════════════
// SLIDE 6 – ML Pipeline
// ═══════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addSlideHeader(s, "ML Pipeline", "Notebook-based training workflow");

  const steps = [
    { n:"1", title:"Data Loading",          body:"Kaggle stroke dataset (CSV). Handle missing BMI values, drop irrelevant columns.",                                 col:"DBEAFE", tc:"1E40AF"  },
    { n:"2", title:"IQR Clipping",          body:"Clip numeric outliers (age, BMI, avg_glucose_level) using IQR bounds saved to artifacts.",                       col:C.emeraldLight, tc:"065F46" },
    { n:"3", title:"Feature Engineering",  body:"Create bmi_age_interaction = age × BMI. One-hot encode categorical features (gender, work_type, etc.).",          col:"FEF3C7", tc:"92400E"  },
    { n:"4", title:"StandardScaler + Model", body:"Z-score normalize numeric features. Train Logistic Regression with GridSearchCV. Optimize threshold via PR curve.", col:"FEE2E2", tc:"991B1B"  },
    { n:"5", title:"Save Artifacts",       body:"Export model, scaler, IQR bounds, dummy columns & best threshold to stroke_model_artifacts.joblib via joblib.",    col:"F3E8FF", tc:"6D28D9"  },
  ];

  steps.forEach((st, i) => {
    const col1 = i < 3;
    const x = col1 ? 0.35 : 5.2;
    const y = col1 ? 1.1 + i * 1.4 : 1.1 + (i - 3) * 1.4;
    // Only 2 in col2, so skip if i>4
    if (i > 4) return;
    addCard(s, x, y, 4.5, 1.18, st.col);
    s.addShape(pres.shapes.OVAL, { x: x + 0.12, y: y + 0.32, w: 0.44, h: 0.44, fill: { color: st.tc }, line: { color: st.tc } });
    s.addText(st.n, { x: x + 0.12, y: y + 0.32, w: 0.44, h: 0.44, fontSize: 12, bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
    s.addText(st.title, { x: x + 0.7,  y: y + 0.08, w: 3.6, h: 0.3,  fontSize: 11, bold: true, color: st.tc, margin: 0 });
    s.addText(st.body,  { x: x + 0.7,  y: y + 0.42, w: 3.65, h: 0.65, fontSize: 9.5, color: C.text, margin: 0 });
  });
}

// ═══════════════════════════════════════════════════════════
// SLIDE 7 – Frontend (App.jsx)
// ═══════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addSlideHeader(s, "Frontend — React App", "3-page user flow built with React + Tailwind CSS");

  const pages = [
    {
      title: "1. Home Page",
      bullets: ["Stroke awareness — FAST signs (Face, Arms, Speech, Time)", "3 risk facts with icons", "Animated ECG pulse line", '"Check Your Risk" CTA button'],
      col: "DBEAFE", tc: "1E40AF",
    },
    {
      title: "2. Form Page",
      bullets: ["10 health input fields", "Toggle buttons for binary fields (hypertension, heart disease)", "Dropdowns for work type, smoking, gender", "POST request to Flask /predict"],
      col: C.emeraldLight, tc: "065F46",
    },
    {
      title: "3. Result Page",
      bullets: ["Shows stroke probability %", "Low / Medium / High risk level", "Animated pulse line changes tone", "Fallback: local simulation if API offline"],
      col: "FEE2E2", tc: "991B1B",
    },
  ];

  pages.forEach((pg, i) => {
    const x = 0.35 + i * 3.15;
    addCard(s, x, 1.1, 2.95, 3.6, pg.col);
    s.addText(pg.title, { x: x + 0.15, y: 1.18, w: 2.65, h: 0.32, fontSize: 11, bold: true, color: pg.tc, margin: 0 });
    s.addText(pg.bullets.map(b => b).join("\n\n"), {
      x: x + 0.15, y: 1.55, w: 2.7, h: 2.9, fontSize: 10, color: C.text,
      bullet: false, margin: 0,
    });
  });

  // Tech stack note
  addCard(s, 0.35, 4.85, 9.3, 0.45, C.offWhite);
  s.addText("Tech Stack: React 18  ·  Tailwind CSS  ·  Lucide Icons  ·  Fetch API  ·  Space Grotesk / JetBrains Mono fonts", {
    x: 0.55, y: 4.88, w: 9.0, h: 0.38, fontSize: 10, color: C.muted, align: "center", margin: 0
  });
}

// ═══════════════════════════════════════════════════════════
// SLIDE 8 – Target Users & Expected Impact
// ═══════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addSlideHeader(s, "Target Users & Expected Impact");

  // Users
  s.addText("Who benefits?", { x: 0.4, y: 0.88, w: 9, h: 0.3, fontSize: 13, bold: true, color: C.text, margin: 0 });

  const users = [
    { label: "Patients",         sub: "Self-screen risk\nbefore visiting doctors",   col: C.emeraldLight, tc: "065F46" },
    { label: "General Public",   sub: "Raise awareness of\npreventable risk factors", col: "DBEAFE",        tc: "1E40AF" },
    { label: "Rural Clinics",    sub: "Quick triage tool\nwhere specialists are scarce", col: "FEF3C7",    tc: "92400E" },
    { label: "Researchers",      sub: "Baseline ML model\nfor stroke studies",        col: "F3E8FF",        tc: "6D28D9" },
  ];

  users.forEach((u, i) => {
    const x = 0.4 + i * 2.35;
    addCard(s, x, 1.25, 2.15, 1.3, u.col);
    s.addText(u.label, { x, y: 1.33, w: 2.15, h: 0.3, fontSize: 11, bold: true, color: u.tc, align: "center", margin: 0 });
    s.addText(u.sub,   { x, y: 1.68, w: 2.15, h: 0.65, fontSize: 9.5, color: C.text, align: "center", margin: 0 });
  });

  // Impact
  s.addText("Expected Impact", { x: 0.4, y: 2.72, w: 9, h: 0.3, fontSize: 13, bold: true, color: C.text, margin: 0 });

  const impacts = [
    { icon: "↓", text: "Earlier detection of high-risk individuals, reducing emergency stroke cases" },
    { icon: "↑", text: "Increased public awareness of modifiable risk factors (BMI, glucose, smoking)" },
    { icon: "⚖", text: "Democratised healthcare access — free, open, usable on any device" },
    { icon: "📊", text: "Data-driven preventive care, contributing to SDG 3 health targets" },
  ];

  impacts.forEach((imp, i) => {
    const y = 3.1 + i * 0.56;
    s.addShape(pres.shapes.OVAL, { x: 0.4, y: y + 0.02, w: 0.38, h: 0.38, fill: { color: C.emerald }, line: { color: C.emerald } });
    s.addText(imp.icon, { x: 0.4, y: y + 0.02, w: 0.38, h: 0.38, fontSize: 12, color: C.white, align: "center", valign: "middle", margin: 0 });
    s.addText(imp.text, { x: 0.9, y, w: 8.7, h: 0.44, fontSize: 11, color: C.text, valign: "middle", margin: 0 });
  });
}

// ═══════════════════════════════════════════════════════════
// SLIDE 9 – Responsible AI
// ═══════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addSlideHeader(s, "Responsible AI Considerations", "Mandatory ethical framework");

  const items = [
    { title: "Fairness",      body: "Model trained on diverse demographic data. No discrimination by gender, age group, or residence type. Inputs are limited to medically relevant features only.",        col: C.emeraldLight, tc: "065F46", icon: "⚖" },
    { title: "Transparency",  body: "Logistic Regression chosen for interpretability over black-box models. Probability and decision threshold are displayed to users. No hidden scoring.",                col: "DBEAFE",        tc: "1E40AF", icon: "🔍" },
    { title: "Privacy",       body: "No personal data is stored. All predictions are stateless. The API does not log user inputs. No PII is collected by the frontend.",                                  col: "FEF3C7",        tc: "92400E", icon: "🔒" },
    { title: "Ethics",        body: "Tool is for screening only — not a clinical diagnosis. Users are advised to consult a doctor. Results include a clear disclaimer on the result page.",               col: "FEE2E2",        tc: "991B1B", icon: "⚕" },
  ];

  items.forEach((it, i) => {
    const col1 = i < 2;
    const x = col1 ? 0.35 : 5.1;
    const y = col1 ? 1.1 + i * 1.95 : 1.1 + (i - 2) * 1.95;
    addCard(s, x, y, 4.4, 1.75, it.col);
    s.addShape(pres.shapes.OVAL, { x: x + 0.15, y: y + 0.15, w: 0.52, h: 0.52, fill: { color: it.tc }, line: { color: it.tc } });
    s.addText(it.icon, { x: x + 0.15, y: y + 0.15, w: 0.52, h: 0.52, fontSize: 14, color: C.white, align: "center", valign: "middle", margin: 0 });
    s.addText(it.title, { x: x + 0.82, y: y + 0.12, w: 3.4, h: 0.32, fontSize: 13, bold: true, color: it.tc, margin: 0 });
    s.addText(it.body,  { x: x + 0.15, y: y + 0.72, w: 4.1, h: 0.88, fontSize: 10, color: C.text, margin: 0 });
  });
}

// ═══════════════════════════════════════════════════════════
// SLIDE 10 – Conclusion
// ═══════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  s.addShape(pres.shapes.OVAL, { x: 7.5, y: -0.5, w: 3.5, h: 3.5, fill: { color: "0EA5E9", transparency: 90 }, line: { color: "0EA5E9", transparency: 90 } });
  s.addShape(pres.shapes.OVAL, { x: -0.5, y: 3.5, w: 2.5, h: 2.5, fill: { color: "059669", transparency: 88 }, line: { color: "059669", transparency: 88 } });

  s.addText("Conclusion", { x: 0.5, y: 0.35, w: 9, h: 0.55, fontSize: 28, bold: true, color: C.white, fontFace: "Cambria", margin: 0 });
  s.addShape(pres.shapes.LINE, { x: 0.5, y: 0.96, w: 2.5, h: 0, line: { color: "34D399", width: 1.5 } });

  const bullets = [
    { t: "Full-stack AI system", b: " — React frontend → Flask API → Logistic Regression model" },
    { t: "End-to-end ML pipeline", b: " — data cleaning, feature engineering, threshold tuning, artifact saving" },
    { t: "SDG 3 aligned", b: " — promotes preventive healthcare and early stroke detection" },
    { t: "Responsible AI", b: " — transparent, fair, private and ethically designed" },
  ];

  bullets.forEach((b, i) => {
    s.addText([
      { text: b.t, options: { bold: true, color: "34D399" } },
      { text: b.b, options: { color: "CBD5E1" } },
    ], { x: 0.5, y: 1.18 + i * 0.62, w: 9, h: 0.52, fontSize: 13, valign: "middle", margin: 0 });
  });

  // Future scope
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 3.7, w: 9, h: 1.25, fill: { color: "0F3460", transparency: 10 }, rectRadius: 0.1, line: { color: "0EA5E9", width: 0.5 } });
  s.addText("Future Scope", { x: 0.7, y: 3.78, w: 3, h: 0.28, fontSize: 11, bold: true, color: "7DD3FC", margin: 0 });
  s.addText("Deploy on cloud (Render / Vercel)  ·  Add more features (ECG, family history)  ·  Try ensemble models (XGBoost, Random Forest)  ·  Mobile-responsive PWA", {
    x: 0.7, y: 4.1, w: 8.6, h: 0.65, fontSize: 11, color: "94A3B8", margin: 0
  });

  // Footer
  s.addText("Muthyala Venkata Sai Akshitha  ·  GIET College  ·  1M1B AI for Sustainability Virtual Internship", {
    x: 0.5, y: 5.25, w: 9, h: 0.25, fontSize: 8.5, color: "475569", align: "center", margin: 0
  });
}

// ═══════════════════════════════════════════════════════════
// WRITE
// ═══════════════════════════════════════════════════════════
pres.writeFile({ fileName: "Brain_Stroke_Prediction.pptx" })
  .then(() => console.log("✅ PPT written successfully in the current directory!"))
  .catch(e => console.error("❌", e));
