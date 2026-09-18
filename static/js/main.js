// EC2201 Digital Systems: AI Rule Engine Frontend Controller
// Upgraded for Indian Rupee (₹) Financial System & Next-Level Interactive K-Map Studio

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initSimulator();
  loadTruthTable();
  loadSimplification();
  initInteractiveKMap();
  initTestRunner();
  initPlayground();
  initAudioSynth();
  initTimingAnalyzer();
  initClockGenerator();
  initKMapCapsules();
  initLearningHub();
  initPracticeLab();
  initTestCenter();
  init3DScenes();
});

function init3DScenes() {
  if (typeof THREE === 'undefined' || !window.EC2201_3D) return;
  setTimeout(() => {
    try {
      window.EC2201_3D.initChip("chip-3d-canvas");
      window.EC2201_3D.initReactor("decision-3d-canvas");
      window.EC2201_3D.initKMapCube("kmap-3d-canvas");
    } catch (e) {
      console.warn("3D WebGL initialization notice:", e);
    }
  }, 100);
}

// 3D Microchip Interaction Handlers
window.toggleChipXRayBtn = function() {
  if (!window.EC2201_3D) return;
  const isXRay = window.EC2201_3D.toggleChipXRay();
  const label = document.getElementById("chip-xray-label");
  const btn = document.getElementById("chip-btn-xray");
  const hud = document.getElementById("chip-hud-text");
  if (label) label.textContent = isXRay ? "X-Ray: ON (Die Visible)" : "X-Ray: See Silicon Die";
  if (btn) btn.classList.toggle("active", isXRay);
  if (hud) hud.innerHTML = isXRay ? `<strong style="color:#38bdf8;">X-RAY ACTIVE:</strong> Internal silicon die & gold bond wires revealed!` : `Hover over or click any metal pin to probe live voltage`;
};

window.triggerChipPulse = function() {
  if (!window.EC2201_3D) return;
  window.EC2201_3D.pulseChipSignals();
  const hud = document.getElementById("chip-hud-text");
  if (hud) hud.innerHTML = `<strong style="color:#00f59b;">PULSING:</strong> High-speed clock signal swept across all 14 pins!`;
};

window.toggleChipSpinBtn = function() {
  if (!window.EC2201_3D) return;
  const isSpinning = window.EC2201_3D.toggleChipSpin();
  const label = document.getElementById("chip-spin-label");
  const btn = document.getElementById("chip-btn-spin");
  if (label) label.textContent = isSpinning ? "Auto-Spin: ON" : "Auto-Spin: PAUSED";
  if (btn) btn.classList.toggle("active", !isSpinning);
};

// 3D Decision Reactor Interaction Handlers
window.triggerReactorShockwaveBtn = function() {
  if (!window.EC2201_3D) return;
  window.EC2201_3D.triggerReactorPulse();
  const hud = document.getElementById("reactor-hud-text");
  if (hud) hud.innerHTML = `<strong style="color:#38bdf8;">SHOCKWAVE:</strong> Quantum decision pulse emitted!`;
};

window.toggleReactorTurboBtn = function() {
  if (!window.EC2201_3D) return;
  const isTurbo = window.EC2201_3D.toggleReactorTurbo();
  const label = document.getElementById("reactor-turbo-label");
  const btn = document.getElementById("reactor-btn-turbo");
  const hud = document.getElementById("reactor-hud-text");
  if (label) label.textContent = isTurbo ? "Turbo: 3.0x" : "Turbo: OFF";
  if (btn) btn.classList.toggle("active", isTurbo);
  if (hud) hud.innerHTML = isTurbo ? `<strong style="color:#fbbf24;">TURBO ACTIVE:</strong> Gimbal ring frequency elevated!` : `Click anywhere in 3D to burst`;
};

// 3D K-Map Hypercube Interaction Handlers
window.toggleKMapSpinBtn = function() {
  if (!window.EC2201_3D) return;
  const isSpinning = window.EC2201_3D.toggleKMapSpin();
  const label = document.getElementById("kmap-spin-label");
  const btn = document.getElementById("kmap-btn-spin");
  if (label) label.textContent = isSpinning ? "Auto-Spin: ON" : "Auto-Spin: PAUSED";
  if (btn) btn.classList.toggle("active", !isSpinning);
};

window.highlightCurrentSimMintermOn3D = function() {
  if (!window.EC2201_3D) return;
  window.EC2201_3D.highlightKMapMinterm(currentSimulatorMinterm);
  const hud = document.getElementById("kmap-3d-hud-text");
  if (hud) hud.innerHTML = `SNAPPED TO SIMULATOR: <strong style="color:#38bdf8;">m${currentSimulatorMinterm}</strong> active in current test vector`;
};

// Format numbers into Indian Rupee notation (e.g., 500000 -> ₹5,00,000)
function formatINR(amount) {
  const val = Math.round(Number(amount) || 0);
  const s = Math.abs(val).toString();
  const sign = val < 0 ? "-" : "";
  if (s.length <= 3) {
    return `${sign}₹${s}`;
  }
  const lastThree = s.substring(s.length - 3);
  let remaining = s.substring(0, s.length - 3);
  const parts = [];
  while (remaining.length > 2) {
    parts.unshift(remaining.substring(remaining.length - 2));
    remaining = remaining.substring(0, remaining.length - 2);
  }
  if (remaining.length > 0) {
    parts.unshift(remaining);
  }
  return `${sign}₹${parts.join(",")},${lastThree}`;
}

// 1. Navigation Tab Switching
function initTabs() {
  const tabs = document.querySelectorAll(".nav-tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-tab");
      switchTab(target);
    });
  });

  const hash = window.location.hash.replace("#", "");
  if (hash && document.getElementById(`tab-${hash}`)) {
    switchTab(hash);
  }
}

function switchTab(tabId) {
  document.querySelectorAll(".nav-tab").forEach(t => {
    t.classList.toggle("active", t.getAttribute("data-tab") === tabId);
  });
  document.querySelectorAll(".tab-pane").forEach(p => {
    p.classList.toggle("active", p.id === `tab-${tabId}`);
  });
  window.location.hash = tabId;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Tab-specific interactive triggers
  if (tabId === "simplification") {
    renderInteractiveKMapTable();
    highlightActiveSimulatorMintermOnKMap();
    if (typeof updateKMapLoopPills === "function") {
      updateKMapLoopPills(currentKMapOutput);
    }
    if (typeof selectedKMapMinterm === "number") {
      inspectKMapCellByMinterm(selectedKMapMinterm);
    }
    if (typeof drawKMapCapsules === "function") {
      setTimeout(drawKMapCapsules, 100);
    }
  } else if (tabId === "simulator" || tabId === "model") {
    updateInteractiveCircuit();
    if (tabId === "model" && typeof updatePlayground === "function") {
      updatePlayground();
    }
  } else if (tabId === "learning") {
    if (typeof updateTheoremProver === "function") updateTheoremProver();
  } else if (tabId === "practicing") {
    if (typeof loadTruthTableDrill === "function") loadTruthTableDrill();
  } else if (tabId === "testing") {
    // Keep test state preserved
  }

  if (window.EC2201_3D) {
    setTimeout(() => {
      window.EC2201_3D.refreshLayout();
    }, 120);
  }
}

// Global state for live simulator
let simState = {
  income: 55000,
  credit_score: 750,
  age: 29,
  has_default: false,
  has_collateral: true,
  loan_amount: 500000,
  collateral_value: 800000
};

let currentMatchedRow = null;
let currentSimulatorMinterm = 14; // Default A=1, B=1, C=1, D=0 -> m14

// Quick Rupee preset setter
window.setIncomePreset = function(amount) {
  simState.income = amount;
  const incSlider = document.getElementById("sim-income-slider");
  const incInput = document.getElementById("sim-income-input");
  const incDisplay = document.getElementById("sim-income-display");

  if (incSlider) incSlider.value = amount;
  if (incInput) incInput.value = amount;
  if (incDisplay) incDisplay.textContent = formatINR(amount);

  evaluateSimulator(simState);
};

// 2. Live Simulator Initialization
function initSimulator() {
  const incSlider = document.getElementById("sim-income-slider");
  const incInput = document.getElementById("sim-income-input");
  const incDisplay = document.getElementById("sim-income-display");

  const crSlider = document.getElementById("sim-credit-slider");
  const crInput = document.getElementById("sim-credit-input");
  const crDisplay = document.getElementById("sim-credit-display");

  const ageSlider = document.getElementById("sim-age-slider");
  const ageInput = document.getElementById("sim-age-input");
  const ageDisplay = document.getElementById("sim-age-display");

  const loanSlider = document.getElementById("sim-loan-slider");
  const loanInput = document.getElementById("sim-loan-input");
  const loanDisplay = document.getElementById("sim-loan-display");

  const colvalSlider = document.getElementById("sim-colval-slider");
  const colvalInput = document.getElementById("sim-colval-input");
  const colvalDisplay = document.getElementById("sim-colval-display");

  const defaultToggles = document.querySelectorAll("[data-field='default']");
  const collateralToggles = document.querySelectorAll("[data-field='collateral']");

  // Income syncing
  incSlider.addEventListener("input", (e) => {
    simState.income = Number(e.target.value);
    incInput.value = simState.income;
    incDisplay.textContent = formatINR(simState.income);
    evaluateSimulator(simState);
  });
  incInput.addEventListener("change", (e) => {
    simState.income = Math.max(0, Number(e.target.value));
    incSlider.value = simState.income;
    incDisplay.textContent = formatINR(simState.income);
    evaluateSimulator(simState);
  });

  // Credit Score syncing
  crSlider.addEventListener("input", (e) => {
    simState.credit_score = Number(e.target.value);
    crInput.value = simState.credit_score;
    crDisplay.textContent = simState.credit_score;
    evaluateSimulator(simState);
  });
  crInput.addEventListener("change", (e) => {
    simState.credit_score = Number(e.target.value);
    crSlider.value = simState.credit_score;
    crDisplay.textContent = simState.credit_score;
    evaluateSimulator(simState);
  });

  // Age syncing
  ageSlider.addEventListener("input", (e) => {
    simState.age = Number(e.target.value);
    ageInput.value = simState.age;
    ageDisplay.textContent = `${simState.age} yrs`;
    evaluateSimulator(simState);
  });
  ageInput.addEventListener("change", (e) => {
    simState.age = Number(e.target.value);
    ageSlider.value = simState.age;
    ageDisplay.textContent = `${simState.age} yrs`;
    evaluateSimulator(simState);
  });

  // Loan Amount syncing
  loanSlider.addEventListener("input", (e) => {
    simState.loan_amount = Number(e.target.value);
    loanInput.value = simState.loan_amount;
    loanDisplay.textContent = formatINR(simState.loan_amount);
    evaluateSimulator(simState);
  });
  loanInput.addEventListener("change", (e) => {
    simState.loan_amount = Math.max(0, Number(e.target.value));
    loanSlider.value = simState.loan_amount;
    loanDisplay.textContent = formatINR(simState.loan_amount);
    evaluateSimulator(simState);
  });

  // Collateral Valuation syncing
  colvalSlider.addEventListener("input", (e) => {
    simState.collateral_value = Number(e.target.value);
    colvalInput.value = simState.collateral_value;
    colvalDisplay.textContent = formatINR(simState.collateral_value);
    evaluateSimulator(simState);
  });
  colvalInput.addEventListener("change", (e) => {
    simState.collateral_value = Math.max(0, Number(e.target.value));
    colvalSlider.value = simState.collateral_value;
    colvalDisplay.textContent = formatINR(simState.collateral_value);
    evaluateSimulator(simState);
  });

  // Default toggle
  defaultToggles.forEach(btn => {
    btn.addEventListener("click", () => {
      defaultToggles.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      simState.has_default = btn.getAttribute("data-value") === "true";
      if (typeof playRelayClick === "function" && audioSynthEnabled) playRelayClick();
      evaluateSimulator(simState);
    });
  });

  // Collateral toggle
  collateralToggles.forEach(btn => {
    btn.addEventListener("click", () => {
      collateralToggles.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      simState.has_collateral = btn.getAttribute("data-value") === "true";
      const colValContainer = document.getElementById("sim-collateral-val-container");
      if (colValContainer) {
        colValContainer.style.display = simState.has_collateral ? "block" : "none";
      }
      if (typeof playRelayClick === "function" && audioSynthEnabled) playRelayClick();
      evaluateSimulator(simState);
    });
  });

  // Initial evaluation
  evaluateSimulator(simState);
}

async function evaluateSimulator(payload) {
  const errorBox = document.getElementById("sim-error-box");
  const resultCard = document.getElementById("sim-result-container");

  try {
    const res = await fetch("/api/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!data.success) {
      errorBox.style.display = "block";
      errorBox.textContent = `Input Exception: ${data.error}`;
      return;
    }

    errorBox.style.display = "none";
    resultCard.style.display = "block";

    // Boolean Chips
    const boolVars = data.boolean_variables;
    updateChip("chip-A", boolVars.A, "A");
    updateChip("chip-B", boolVars.B, "B");
    updateChip("chip-C", boolVars.C, "C");
    updateChip("chip-D", boolVars.D, "D");
    updateChip("chip-E", boolVars.E, "E");

    // Layer 1 Decision
    const decision = data.logic_result.decision;
    const badge = document.getElementById("sim-decision-badge");
    badge.className = `badge ${decision}`;
    badge.textContent = decision;

    // Update 3D Scenes & Plain-English Verdict
    if (window.EC2201_3D) {
      window.EC2201_3D.updateDecision(decision);
      window.EC2201_3D.updateChipPins(boolVars, { status: decision });
      window.EC2201_3D.highlightKMapMinterm(currentSimulatorMinterm);
    }
    const simpleVerdictEl = document.getElementById("sim-simple-verdict-text");
    if (simpleVerdictEl) {
      if (decision === "APPROVE") {
        simpleVerdictEl.innerHTML = `<strong style="color:#00f59b;">APPROVED:</strong> Meets all income and credit criteria! Zero loan defaults detected.`;
      } else if (decision === "REJECT") {
        simpleVerdictEl.innerHTML = `<strong style="color:#ff3b5c;">REJECTED:</strong> Disqualified due to active loan default or critically low credit profile.`;
      } else {
        simpleVerdictEl.innerHTML = `<strong style="color:#f59e0b;">REVIEW REQUIRED:</strong> Borderline application flagged for senior loan manager inspection.`;
      }
    }

    // Row & Minterm calculation
    currentMatchedRow = data.logic_result.row_index;
    currentSimulatorMinterm = (boolVars.A << 3) | (boolVars.B << 2) | (boolVars.C << 1) | boolVars.D;

    document.getElementById("sim-row-index").textContent = 
      `Row #${currentMatchedRow} (Minterm m${currentSimulatorMinterm}: ${boolVars.A}${boolVars.B}${boolVars.C}${boolVars.D})`;

    document.getElementById("sim-trace-approve").textContent = data.logic_result.trace.approve_term;
    document.getElementById("sim-trace-reject").textContent = data.logic_result.trace.reject_terms;
    document.getElementById("sim-trace-review").textContent = data.logic_result.trace.review_term;

    // Layer 2 AI Confidence
    const ai = data.ai_evaluation;
    document.getElementById("sim-confidence-val").textContent = `${ai.confidence_score}%`;
    const meterFill = document.getElementById("sim-confidence-meter");
    meterFill.style.width = `${ai.confidence_score}%`;
    
    if (ai.confidence_score >= 75) {
      meterFill.style.backgroundColor = "var(--color-approve)";
    } else if (ai.confidence_score >= 50) {
      meterFill.style.backgroundColor = "var(--color-review)";
    } else {
      meterFill.style.backgroundColor = "var(--color-reject)";
    }

    const riskBadge = document.getElementById("sim-risk-tier");
    riskBadge.className = `badge badge-${ai.badge_color}`;
    riskBadge.textContent = ai.risk_tier;

    document.getElementById("sim-summary-text").textContent = ai.summary;

    // Financial LTV Summary
    if (ai.financial_metrics) {
      const ltvDisplay = document.getElementById("sim-ltv-display");
      const loanSummary = document.getElementById("sim-loan-summary");
      if (ltvDisplay) ltvDisplay.textContent = ai.financial_metrics.ltv_ratio;
      if (loanSummary) loanSummary.textContent = ai.financial_metrics.loan_amount_formatted;
    }

    // Score Breakdown table
    const tbody = document.getElementById("sim-breakdown-tbody");
    tbody.innerHTML = "";
    ai.breakdown.forEach(item => {
      const tr = document.createElement("tr");
      const sign = item.impact > 0 ? "+" : "";
      tr.innerHTML = `
        <td style="font-weight:600;">${item.factor}</td>
        <td style="color:${item.impact > 0 ? 'var(--color-approve)' : (item.impact < 0 ? 'var(--color-reject)' : 'var(--text-secondary)')}; font-weight:bold;">${sign}${item.impact}%</td>
        <td style="color:var(--text-secondary);">${item.detail}</td>
      `;
      tbody.appendChild(tr);
    });

    // Update target beacon on K-Map
    highlightActiveSimulatorMintermOnKMap();

    // Update Live Gate-Level Interactive Circuit
    updateInteractiveCircuit(boolVars, data.logic_result);

  } catch (err) {
    console.error("Evaluation failed:", err);
  }
}

// Interactive Gate-Level Circuit State & Live Signal Controller
let lastBoolVars = { A: 1, B: 1, C: 1, D: 0, E: 1 };
let lastLogicResult = { APPROVE: 1, REJECT: 0, REVIEW: 0, DECISION: "APPROVED" };
let circuitCurrentSignals = {
  A: 1, B: 1, C: 1, D: 0,
  NOT_A: 0, NOT_B: 0, NOT_D: 1,
  AND_AB: 1, AND_CD: 1,
  AND_APPROVE: 1, AND_NOT_A_B: 0,
  OR_REJECT: 0, NOR_REVIEW: 0
};

function updateInteractiveCircuit(boolVars, logicResult) {
  if (!boolVars) boolVars = lastBoolVars;
  if (!logicResult) logicResult = lastLogicResult;
  lastBoolVars = boolVars;
  lastLogicResult = logicResult;

  const A = boolVars.A !== undefined ? boolVars.A : 1;
  const B = boolVars.B !== undefined ? boolVars.B : 1;
  const C = boolVars.C !== undefined ? boolVars.C : 1;
  const D = boolVars.D !== undefined ? boolVars.D : 0;

  const notA = A ? 0 : 1;
  const notB = B ? 0 : 1;
  const notD = D ? 0 : 1;

  // 2-Input AND Gate Tree:
  // Gate 1A: T1 = A·B (2-Input AND)
  const andAB = (A && B) ? 1 : 0;
  // Gate 1B: T2 = C·D' (2-Input AND)
  const andCD = (C && notD) ? 1 : 0;
  // Gate 1C: APPROVE = T1·T2 = (A·B)·(C·D') (2-Input AND)
  const andApprove = (andAB && andCD) ? 1 : 0;

  const andNotAB = notA && notB ? 1 : 0;
  const orReject = (D || andNotAB) ? 1 : 0;
  const norReview = (!andApprove && !orReject) ? 1 : 0;

  circuitCurrentSignals = {
    A, B, C, D,
    NOT_A: notA,
    NOT_B: notB,
    NOT_D: notD,
    AND_AB: andAB,
    AND_CD: andCD,
    AND_APPROVE: andApprove,
    AND_NOT_A_B: andNotAB,
    OR_REJECT: orReject,
    NOR_REVIEW: norReview
  };

  // Primary Bus Lines
  setWireState("wire-a", A);
  setWireState("wire-a-tap", A);
  setWireState("wire-a-to-not", A);

  setWireState("wire-b", B);
  setWireState("wire-b-tap", B);
  setWireState("wire-b-to-not", B);

  setWireState("wire-c", C);

  setWireState("wire-d", D);
  setWireState("wire-d-tap", D);
  setWireState("wire-d-to-or", D);

  // Inverter Outputs
  setWireState("wire-not-d-out", notD);
  setWireState("wire-not-d-to-and1", notD);
  setWireState("wire-not-d-in", notD);

  setWireState("wire-not-a-out", notA);
  setWireState("wire-not-b-out", notB);

  // 2-Input AND Gate 1A (T1 = A·B)
  setWireState("wire-and1a-in-a", A);
  setWireState("wire-and1a-in-b", B);
  setWireState("wire-and1a-out", andAB);
  setWireState("wire-and1a-to-out", andAB);
  setWireState("wire-and1a-in", andAB);

  // 2-Input AND Gate 1B (T2 = C·D')
  setWireState("wire-and1b-in-c", C);
  setWireState("wire-and1b-out", andCD);
  setWireState("wire-and1b-to-out", andCD);
  setWireState("wire-and1b-in", andCD);

  // 2-Input AND Gate 1C (APPROVE = T1·T2)
  setWireState("wire-approve-out", andApprove);

  // 2-Input AND Gate 2 (A'·B')
  setWireState("wire-and2-in-a", notA);
  setWireState("wire-and2-in-b", notB);
  setWireState("wire-and2-out", andNotAB);

  // 2-Input OR Gate (REJECT)
  setWireState("wire-reject-out", orReject);

  // Interconnects to 2-Input NOR Gate (REVIEW)
  setWireState("wire-app-to-nor", andApprove);
  setWireState("wire-app-nor-in", andApprove);
  setWireState("wire-rej-to-nor", orReject);
  setWireState("wire-rej-nor-in", orReject);

  // 2-Input NOR Gate (REVIEW)
  setWireState("wire-review-out", norReview);

  // Update Gate Active Highlights
  setGateActive("gate-and-ab", andAB);
  setGateActive("gate-and-cd", andCD);
  setGateActive("gate-and-approve", andApprove);
  setGateActive("gate-and2", andNotAB);
  setGateActive("gate-or-reject", orReject);
  setGateActive("gate-nor-review", norReview);

  // Update output probe values across both schematics
  ['', 'sim-'].forEach(prefix => {
    const valApp = document.getElementById(prefix + "val-approve-text");
    const valRej = document.getElementById(prefix + "val-reject-text");
    const valRev = document.getElementById(prefix + "val-review-text");
    if (valApp) valApp.textContent = `[${andApprove}]`;
    if (valRej) valRej.textContent = `[${orReject}]`;
    if (valRev) valRev.textContent = `[${norReview}]`;
  });

  // Output probe circle glows
  setProbeGlow("probe-approve", andApprove, "#10b981");
  setProbeGlow("probe-reject", orReject, "#ef4444");
  setProbeGlow("probe-review", norReview, "#fbbf24");

  // Stream signals to live digital timing analyzer (oscilloscope)
  if (typeof recordScopeSample === "function") {
    recordScopeSample({
      A, B, C, D,
      APPROVE: andApprove,
      REJECT: orReject,
      REVIEW: norReview
    });
  }

  // Audio acoustic feedback
  if (typeof triggerVerdictSound === "function") {
    triggerVerdictSound(logicResult.DECISION);
  }
}

function setWireState(id, isHigh) {
  ['', 'sim-'].forEach(prefix => {
    const el = document.getElementById(prefix + id);
    if (!el) return;
    if (isHigh) {
      el.classList.add("high");
      el.classList.remove("low");
    } else {
      el.classList.add("low");
      el.classList.remove("high");
    }
  });
}

function setGateActive(id, isActive) {
  ['', 'sim-'].forEach(prefix => {
    const el = document.getElementById(prefix + id);
    if (!el) return;
    if (isActive) {
      el.classList.add("active-gate");
    } else {
      el.classList.remove("active-gate");
    }
  });
}

function setProbeGlow(id, isHigh, color) {
  ['', 'sim-'].forEach(prefix => {
    const el = document.getElementById(prefix + id);
    if (!el) return;
    if (isHigh) {
      el.setAttribute("fill", color);
      el.style.filter = `drop-shadow(0 0 8px ${color})`;
      el.classList.add("probe-active");
    } else {
      el.setAttribute("fill", "#1e293b");
      el.style.filter = "none";
      el.classList.remove("probe-active");
    }
  });
}

// Clickable interactive gate / probe inspector
window.inspectCircuitNode = function(nodeKey) {
  const s = circuitCurrentSignals;
  const descriptions = {
    "NOT_D": {
      name: "Inverter NOT D",
      formula: "D' = NOT D",
      state: s.NOT_D,
      detail: `Input D = ${s.D} -> Output D' = ${s.NOT_D}`
    },
    "NOT_A": {
      name: "Inverter NOT A",
      formula: "A' = NOT A",
      state: s.NOT_A,
      detail: `Input A = ${s.A} -> Output A' = ${s.NOT_A}`
    },
    "NOT_B": {
      name: "Inverter NOT B",
      formula: "B' = NOT B",
      state: s.NOT_B,
      detail: `Input B = ${s.B} -> Output B' = ${s.NOT_B}`
    },
    "AND_AB": {
      name: "2-Input AND Gate 1A (A·B)",
      formula: "T₁ = A · B",
      state: s.AND_AB,
      detail: `Inputs: A=${s.A}, B=${s.B} -> Intermediate T₁ = ${s.AND_AB}`
    },
    "AND_CD": {
      name: "2-Input AND Gate 1B (C·D')",
      formula: "T₂ = C · D'",
      state: s.AND_CD,
      detail: `Inputs: C=${s.C}, D'=${s.NOT_D} -> Intermediate T₂ = ${s.AND_CD}`
    },
    "AND_APPROVE": {
      name: "2-Input AND Gate 1C (APPROVE)",
      formula: "APPROVE = T₁ · T₂ = (A · B) · (C · D')",
      state: s.AND_APPROVE,
      detail: `Inputs: T₁=${s.AND_AB}, T₂=${s.AND_CD} -> APPROVE = ${s.AND_APPROVE}`
    },
    "AND_NOT_A_B": {
      name: "2-Input AND Gate (Low Inflow & Low Credit)",
      formula: "Sub-term = A' · B'",
      state: s.AND_NOT_A_B,
      detail: `Inputs: A'=${s.NOT_A}, B'=${s.NOT_B} -> Output = ${s.AND_NOT_A_B}`
    },
    "OR_REJECT": {
      name: "2-Input OR Gate (REJECT)",
      formula: "REJECT = D + (A' · B')",
      state: s.OR_REJECT,
      detail: `Inputs: D=${s.D}, (A'·B')=${s.AND_NOT_A_B} -> Output = ${s.OR_REJECT}`
    },
    "NOR_REVIEW": {
      name: "2-Input NOR Gate (REVIEW)",
      formula: "REVIEW = (APPROVE + REJECT)'",
      state: s.NOR_REVIEW,
      detail: `Inputs: APPROVE=${s.AND_APPROVE}, REJECT=${s.OR_REJECT} -> Output = ${s.NOR_REVIEW}`
    }
  };

  const node = descriptions[nodeKey];
  if (!node) return;

  ['', 'sim-'].forEach(prefix => {
    const titleEl = document.getElementById(prefix + "circuit-node-title");
    const badgeEl = document.getElementById(prefix + "circuit-node-badge");
    if (!titleEl || !badgeEl) return;

    titleEl.innerHTML = `<strong style="color:var(--accent-cyan);">${node.name}:</strong> <code>${node.formula}</code> &mdash; ${node.detail}`;
    badgeEl.className = node.state === 1 ? "badge badge-success" : "badge badge-neutral";
    badgeEl.textContent = `Logic ${node.state}`;
  });

  if (typeof updateMultimeterHUD === "function") {
    updateMultimeterHUD(nodeKey, node);
  }
  if (typeof playTone === "function" && audioSynthEnabled) {
    playTone(node.state === 1 ? 987.77 : 440, 0.035, "sine", 0.06);
  }
};

function updateChip(id, val, label) {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = `bool-chip ${val === 1 ? 'active' : ''}`;
  el.innerHTML = `<strong>${label}:</strong> <span>${val}</span>`;
}

// Jump helpers
window.jumpToTruthTableRow = function() {
  if (currentMatchedRow === null) return;
  switchTab("truth-table");
  setTimeout(() => {
    const rowEl = document.getElementById(`tt-row-${currentMatchedRow}`);
    if (rowEl) {
      document.querySelectorAll(".truth-table tr").forEach(r => r.classList.remove("highlighted"));
      rowEl.classList.add("highlighted");
      rowEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 200);
};

window.jumpToKMapCell = function() {
  switchTab("simplification");
  setTimeout(() => {
    const cellEl = document.getElementById(`kmap-cell-${currentSimulatorMinterm}`);
    if (cellEl) {
      cellEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      cellEl.click();
    }
  }, 200);
};

window.jumpToCircuitSchematic = function() {
  switchTab("model");
  setTimeout(() => {
    const circuitEl = document.getElementById("live-circuit-svg");
    if (circuitEl) {
      circuitEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 200);
};

// 3. Truth Table Loader & Filters
let truthTableData = [];

async function loadTruthTable() {
  const tbody = document.getElementById("truth-table-body");
  if (!tbody) return;

  try {
    const res = await fetch("/api/truth-table");
    const data = await res.json();
    if (data.success) {
      truthTableData = data.rows;
      renderTruthTableRows(truthTableData);
    }
  } catch (e) {
    console.error("Failed to load truth table:", e);
  }

  // Filter buttons
  document.querySelectorAll(".tt-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tt-filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter");
      if (filter === "ALL") {
        renderTruthTableRows(truthTableData);
      } else {
        renderTruthTableRows(truthTableData.filter(r => r.DECISION === filter));
      }
    });
  });
}

function renderTruthTableRows(rows) {
  const tbody = document.getElementById("truth-table-body");
  tbody.innerHTML = "";

  rows.forEach((r) => {
    const rowIdx = (r.A << 4) | (r.B << 3) | (r.C << 2) | (r.D << 1) | r.E;
    const tr = document.createElement("tr");
    tr.id = `tt-row-${rowIdx}`;
    tr.innerHTML = `
      <td style="font-weight:bold; color:var(--text-muted);">${rowIdx}</td>
      <td style="font-family:monospace; color:${r.A ? 'var(--accent-cyan)' : 'var(--text-muted)'}">${r.A}</td>
      <td style="font-family:monospace; color:${r.B ? 'var(--accent-cyan)' : 'var(--text-muted)'}">${r.B}</td>
      <td style="font-family:monospace; color:${r.C ? 'var(--accent-cyan)' : 'var(--text-muted)'}">${r.C}</td>
      <td style="font-family:monospace; color:${r.D ? 'var(--color-reject)' : 'var(--text-muted)'}">${r.D}</td>
      <td style="font-family:monospace; color:${r.E ? 'var(--accent-purple)' : 'var(--text-muted)'}">${r.E}</td>
      <td><span style="font-weight:bold; color:${r.APPROVE ? 'var(--color-approve)' : 'var(--text-muted)'}">${r.APPROVE}</span></td>
      <td><span style="font-weight:bold; color:${r.REJECT ? 'var(--color-reject)' : 'var(--text-muted)'}">${r.REJECT}</span></td>
      <td><span style="font-weight:bold; color:${r.REVIEW ? 'var(--color-review)' : 'var(--text-muted)'}">${r.REVIEW}</span></td>
      <td><span class="badge ${r.DECISION}">${r.DECISION}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

// 4. Simplification Tab (Equations & Verification Proof)
async function loadSimplification() {
  try {
    const res = await fetch("/api/simplify");
    const data = await res.json();
    if (data.success) {
      const results = data.results;
      document.getElementById("sop-approve").textContent = results.sop_approve;
      document.getElementById("sop-reject").textContent = results.sop_reject;
      document.getElementById("sop-review").textContent = results.sop_review;
      document.getElementById("verify-status").textContent = 
        `✅ Formal Verification PASSED: All ${results.rows_checked} states tested against truth table with 0 discrepancies.`;
      
      const kmapImg = document.getElementById("kmap-img");
      if (kmapImg) kmapImg.src = `${data.kmap_url}?t=${Date.now()}`;
    }
  } catch (e) {
    console.error("Failed to load simplification:", e);
  }
}

// 5. NEXT-LEVEL INTERACTIVE KARNAUGH MAP STUDIO
const DEFAULT_KMAP_DATA = {
  gray_code: ["00", "01", "11", "10"],
  cells: [
    [
      { r:0, c:0, ab:"00", cd:"00", minterm:0, APPROVE:0, REJECT:1, REVIEW:0, literal:"A'·B'·C'·D'", tt_rows:[0,1], loops:{ REJECT:["loop-ab"] } },
      { r:0, c:1, ab:"00", cd:"01", minterm:1, APPROVE:0, REJECT:1, REVIEW:0, literal:"A'·B'·C'·D", tt_rows:[2,3], loops:{ REJECT:["loop-d","loop-ab"] } },
      { r:0, c:2, ab:"00", cd:"11", minterm:3, APPROVE:0, REJECT:1, REVIEW:0, literal:"A'·B'·C·D", tt_rows:[6,7], loops:{ REJECT:["loop-d","loop-ab"] } },
      { r:0, c:3, ab:"00", cd:"10", minterm:2, APPROVE:0, REJECT:1, REVIEW:0, literal:"A'·B'·C·D'", tt_rows:[4,5], loops:{ REJECT:["loop-ab"] } }
    ],
    [
      { r:1, c:0, ab:"01", cd:"00", minterm:4, APPROVE:0, REJECT:0, REVIEW:1, literal:"A'·B·C'·D'", tt_rows:[8,9], loops:{ REVIEW:["loop-rev2","loop-rev3"] } },
      { r:1, c:1, ab:"01", cd:"01", minterm:5, APPROVE:0, REJECT:1, REVIEW:0, literal:"A'·B·C'·D", tt_rows:[10,11], loops:{ REJECT:["loop-d"] } },
      { r:1, c:2, ab:"01", cd:"11", minterm:7, APPROVE:0, REJECT:1, REVIEW:0, literal:"A'·B·C·D", tt_rows:[14,15], loops:{ REJECT:["loop-d"] } },
      { r:1, c:3, ab:"01", cd:"10", minterm:6, APPROVE:0, REJECT:0, REVIEW:1, literal:"A'·B·C·D'", tt_rows:[12,13], loops:{ REVIEW:["loop-rev2"] } }
    ],
    [
      { r:2, c:0, ab:"11", cd:"00", minterm:12, APPROVE:0, REJECT:0, REVIEW:1, literal:"A·B·C'·D'", tt_rows:[24,25], loops:{ REVIEW:["loop-rev3"] } },
      { r:2, c:1, ab:"11", cd:"01", minterm:13, APPROVE:0, REJECT:1, REVIEW:0, literal:"A·B·C'·D", tt_rows:[26,27], loops:{ REJECT:["loop-d"] } },
      { r:2, c:2, ab:"11", cd:"11", minterm:15, APPROVE:0, REJECT:1, REVIEW:0, literal:"A·B·C·D", tt_rows:[30,31], loops:{ REJECT:["loop-d"] } },
      { r:2, c:3, ab:"11", cd:"10", minterm:14, APPROVE:1, REJECT:0, REVIEW:0, literal:"A·B·C·D'", tt_rows:[28,29], loops:{ APPROVE:["loop-app"] } }
    ],
    [
      { r:3, c:0, ab:"10", cd:"00", minterm:8, APPROVE:0, REJECT:0, REVIEW:1, literal:"A·B'·C'·D'", tt_rows:[16,17], loops:{ REVIEW:["loop-rev1"] } },
      { r:3, c:1, ab:"10", cd:"01", minterm:9, APPROVE:0, REJECT:1, REVIEW:0, literal:"A·B'·C'·D", tt_rows:[18,19], loops:{ REJECT:["loop-d"] } },
      { r:3, c:2, ab:"10", cd:"11", minterm:11, APPROVE:0, REJECT:1, REVIEW:0, literal:"A·B'·C·D", tt_rows:[22,23], loops:{ REJECT:["loop-d"] } },
      { r:3, c:3, ab:"10", cd:"10", minterm:10, APPROVE:0, REJECT:0, REVIEW:1, literal:"A·B'·C·D'", tt_rows:[20,21], loops:{ REVIEW:["loop-rev1"] } }
    ]
  ]
};

let kmapMatrixData = DEFAULT_KMAP_DATA;
let currentKMapOutput = "APPROVE";
let selectedKMapMinterm = 14;
let sandboxMinterms = new Set([14]); // Default to APPROVE minterm m14

async function initInteractiveKMap() {
  // Immediately render with built-in data so it never fails or lags
  renderInteractiveKMapTable();
  highlightActiveSimulatorMintermOnKMap();
  updateKMapLoopPills("APPROVE");
  inspectKMapCellByMinterm(selectedKMapMinterm);

  try {
    const res = await fetch("/api/kmap-interactive");
    const json = await res.json();
    if (json.success && json.data) {
      kmapMatrixData = json.data;
      renderInteractiveKMapTable();
      highlightActiveSimulatorMintermOnKMap();
      updateKMapLoopPills(currentKMapOutput);
      inspectKMapCellByMinterm(selectedKMapMinterm);
    }
  } catch (err) {
    console.warn("Using built-in K-Map matrix data:", err);
  }
}

function renderInteractiveKMapTable() {
  if (!kmapMatrixData) kmapMatrixData = DEFAULT_KMAP_DATA;
  const table = document.getElementById("interactive-kmap-table");
  if (!table) return;

  const gray = kmapMatrixData.gray_code; // ["00", "01", "11", "10"]
  let html = "";

  // Column Headers Row
  html += `<tr>`;
  html += `<th class="kmap-corner">
            <span class="kmap-corner-cd">CD</span>
            <div class="kmap-corner-line"></div>
            <span class="kmap-corner-ab">AB</span>
          </th>`;
  gray.forEach(cd => {
    html += `<th class="kmap-col-header">${cd}</th>`;
  });
  html += `</tr>`;

  // 4 Rows
  kmapMatrixData.cells.forEach((row, rIdx) => {
    const ab = gray[rIdx];
    html += `<tr>`;
    html += `<th class="kmap-row-header">${ab}</th>`;

    row.forEach(cell => {
      const m = cell.minterm;
      let val = 0;
      let cellClass = "";
      let loopClasses = "";

      if (currentKMapOutput === "SANDBOX") {
        val = sandboxMinterms.has(m) ? 1 : 0;
        cellClass = val === 1 ? "val-1 cell-approve-1" : "val-0";
      } else {
        val = cell[currentKMapOutput];
        cellClass = val === 1 ? `val-1 cell-${currentKMapOutput.toLowerCase()}-1` : "val-0";
        if (cell.loops && cell.loops[currentKMapOutput]) {
          loopClasses = cell.loops[currentKMapOutput].join(" ");
        }
      }

      const isSimTarget = (m === currentSimulatorMinterm) ? "sim-current-target" : "";
      const isSelected = (m === selectedKMapMinterm) ? "cell-selected" : "";

      html += `
        <td class="kmap-interactive-cell ${cellClass} ${loopClasses} ${isSimTarget} ${isSelected}" 
            id="kmap-cell-${m}" 
            data-minterm="${m}" 
            data-r="${cell.r}" 
            data-c="${cell.c}"
            onclick="handleKMapCellClick(${m})"
            onmouseenter="handleKMapCellHover(${m})">
          <span class="minterm-tag">m${m}</span>
          <span class="val">${val}</span>
          <span class="binary-tag">${cell.ab}${cell.cd}</span>
        </td>
      `;
    });
    html += `</tr>`;
  });

  table.innerHTML = html;
  if (typeof drawKMapCapsules === "function") {
    setTimeout(drawKMapCapsules, 20);
  }
}

// Function & Sandbox mode switcher
window.switchKMapOutput = function(output) {
  currentKMapOutput = output;
  document.querySelectorAll(".kmap-switch-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-output") === output);
  });

  const sandboxControls = document.getElementById("kmap-sandbox-controls");
  const sandboxOutput = document.getElementById("kmap-sandbox-output");

  if (output === "SANDBOX") {
    if (sandboxControls) sandboxControls.style.display = "flex";
    if (sandboxOutput) sandboxOutput.style.display = "block";
    solveSandboxSOP();
  } else {
    if (sandboxControls) sandboxControls.style.display = "none";
    if (sandboxOutput) sandboxOutput.style.display = "none";
  }

  renderInteractiveKMapTable();
  highlightActiveSimulatorMintermOnKMap();
  updateKMapLoopPills(output);
  if (selectedKMapMinterm !== null) {
    inspectKMapCellByMinterm(selectedKMapMinterm);
  }

  // Update 3D K-Map Hypercube
  if (window.EC2201_3D) {
    let activeSet = new Set();
    if (output === "APPROVE") activeSet = new Set([14]);
    else if (output === "REJECT") activeSet = new Set([0, 1, 2, 3, 5, 7, 9, 11, 13, 15]);
    else if (output === "REVIEW") activeSet = new Set([4, 6, 8, 10, 12]);
    else if (output === "SANDBOX") activeSet = sandboxMinterms;
    window.EC2201_3D.updateKMapMinterms(activeSet);
  }
};

window.toggleKMapLoops = function() {
  const wrapper = document.getElementById("kmap-board-wrapper");
  const chk = document.getElementById("kmap-loop-toggle");
  if (wrapper && chk) {
    wrapper.classList.toggle("highlight-loops", chk.checked);
  }
  if (typeof drawKMapCapsules === "function") {
    drawKMapCapsules();
  }
};

window.toggleStaticKmapModal = function() {
  const modal = document.getElementById("kmap-static-modal");
  if (modal) {
    modal.style.display = (modal.style.display === "none" || !modal.style.display) ? "block" : "none";
  }
};

window.resetSandboxKMap = function() {
  sandboxMinterms.clear();
  renderInteractiveKMapTable();
  solveSandboxSOP();
  if (window.EC2201_3D) {
    window.EC2201_3D.updateKMapMinterms(new Set());
  }
};

window.handleKMapCellClick = function(m) {
  selectedKMapMinterm = m;
  if (typeof playCellClickSound === "function") {
    playCellClickSound();
  }
  if (currentKMapOutput === "SANDBOX") {
    if (sandboxMinterms.has(m)) {
      sandboxMinterms.delete(m);
    } else {
      sandboxMinterms.add(m);
    }
    renderInteractiveKMapTable();
    solveSandboxSOP();
    if (window.EC2201_3D) {
      window.EC2201_3D.updateKMapMinterms(sandboxMinterms);
    }
  } else {
    document.querySelectorAll(".kmap-interactive-cell").forEach(c => c.classList.remove("cell-selected"));
    const cellEl = document.getElementById(`kmap-cell-${m}`);
    if (cellEl) cellEl.classList.add("cell-selected");
  }
  inspectKMapCellByMinterm(m);
  if (window.EC2201_3D) {
    window.EC2201_3D.highlightKMapMinterm(m);
  }
};

window.handleKMapCellHover = function(m) {
  inspectKMapCellByMinterm(m);
};

function inspectKMapCellByMinterm(m) {
  if (!kmapMatrixData) kmapMatrixData = DEFAULT_KMAP_DATA;
  let targetCell = null;

  for (const row of kmapMatrixData.cells) {
    for (const cell of row) {
      if (cell.minterm === m) {
        targetCell = cell;
        break;
      }
    }
    if (targetCell) break;
  }

  if (!targetCell) return;

  const titleEl = document.getElementById("kmap-inspector-title");
  if (titleEl) titleEl.textContent = `Cell Inspector: Minterm m${m} (Decimal ${m})`;

  const coordEl = document.getElementById("kmap-cell-coord");
  if (coordEl) coordEl.textContent = `AB = ${targetCell.ab}, CD = ${targetCell.cd}`;

  const literalEl = document.getElementById("kmap-cell-literal");
  if (literalEl) literalEl.textContent = targetCell.literal;

  const ttrowsEl = document.getElementById("kmap-cell-ttrows");
  if (ttrowsEl) ttrowsEl.textContent = `Row #${targetCell.tt_rows[0]} (E=0) & Row #${targetCell.tt_rows[1]} (E=1)`;

  const loopsText = document.getElementById("kmap-cell-loops-text");
  if (loopsText) {
    if (currentKMapOutput === "SANDBOX") {
      const isHigh = sandboxMinterms.has(m);
      loopsText.innerHTML = `<strong>Sandbox State:</strong> <span style="color:#c084fc; font-weight:700;">${isHigh ? '1 (Active Minterm in SOP)' : '0 (Inactive)'}</span>`;
    } else {
      const activeLoops = (targetCell.loops && targetCell.loops[currentKMapOutput]) ? targetCell.loops[currentKMapOutput] : [];
      const loopLabels = {
        "loop-app": "Single Minterm Group (1-Cell: A·B·C·D')",
        "loop-d": "Octet Group (8-Cells: D=1)",
        "loop-ab": "Quad Group (4-Cells: A'·B')",
        "loop-rev1": "Prime Pair 1 (2-Cells: A·B'·D')",
        "loop-rev2": "Prime Pair 2 (2-Cells: A'·B·D')",
        "loop-rev3": "Prime Pair 3 (2-Cells: B·C'·D')"
      };
      if (activeLoops.length > 0) {
        const formatted = activeLoops.map(l => loopLabels[l] || l).join(" AND ");
        loopsText.innerHTML = `<strong>Active in:</strong> <span style="color:var(--accent-cyan); font-weight:700;">${formatted}</span>`;
      } else {
        loopsText.textContent = `In ${currentKMapOutput}: Cell evaluates to ${targetCell[currentKMapOutput]} (Not in minimal essential implicants)`;
      }
    }
  }
}

// Interactive loop selector chips (hover lights up loop cells)
function updateKMapLoopPills(output) {
  const container = document.getElementById("kmap-interactive-loop-pills");
  if (!container) return;

  const loopDefs = {
    APPROVE: [
      { id: "loop-app", label: "Loop 1: A·B·C·D' (m14)", minterms: [14], color: "#10b981" }
    ],
    REJECT: [
      { id: "loop-d", label: "Octet: D = 1 (8 minterms)", minterms: [1, 3, 5, 7, 9, 11, 13, 15], color: "#ef4444" },
      { id: "loop-ab", label: "Quad: A'·B' (4 minterms)", minterms: [0, 1, 2, 3], color: "#f59e0b" }
    ],
    REVIEW: [
      { id: "loop-rev1", label: "Pair 1: A·B'·D' (m8, m10)", minterms: [8, 10], color: "#38bdf8" },
      { id: "loop-rev2", label: "Pair 2: A'·B·D' (m4, m6)", minterms: [4, 6], color: "#c084fc" },
      { id: "loop-rev3", label: "Pair 3: B·C'·D' (m4, m12)", minterms: [4, 12], color: "#f59e0b" }
    ],
    SANDBOX: [
      { id: "preset-app", label: "Preset: APPROVE", action: () => { sandboxMinterms = new Set([14]); renderInteractiveKMapTable(); solveSandboxSOP(); }, color: "#10b981" },
      { id: "preset-rej", label: "Preset: REJECT", action: () => { sandboxMinterms = new Set([0,1,2,3,5,7,9,11,13,15]); renderInteractiveKMapTable(); solveSandboxSOP(); }, color: "#ef4444" },
      { id: "preset-rev", label: "Preset: REVIEW", action: () => { sandboxMinterms = new Set([4,6,8,10,12]); renderInteractiveKMapTable(); solveSandboxSOP(); }, color: "#fbbf24" },
      { id: "preset-clear", label: "Clear Matrix", action: () => { sandboxMinterms.clear(); renderInteractiveKMapTable(); solveSandboxSOP(); }, color: "#94a3b8" }
    ]
  };

  const loops = loopDefs[output] || [];
  container.innerHTML = "";

  loops.forEach(lp => {
    const pill = document.createElement("button");
    pill.type = "button";
    pill.className = "kmap-loop-pill";
    pill.innerHTML = `<span class="pill-dot" style="background:${lp.color}; box-shadow:0 0 6px ${lp.color}"></span> ${lp.label}`;
    
    if (lp.minterms) {
      pill.addEventListener("mouseenter", () => {
        highlightLoopMinterms(lp.minterms, true);
      });
      pill.addEventListener("mouseleave", () => {
        highlightLoopMinterms(lp.minterms, false);
      });
      pill.addEventListener("click", () => {
        highlightLoopMinterms(lp.minterms, true);
        if (lp.minterms.length > 0) {
          inspectKMapCellByMinterm(lp.minterms[0]);
        }
      });
    } else if (lp.action) {
      pill.addEventListener("click", lp.action);
    }
    container.appendChild(pill);
  });
}

function highlightLoopMinterms(minterms, isActive) {
  minterms.forEach(m => {
    const el = document.getElementById(`kmap-cell-${m}`);
    if (el) {
      el.classList.toggle("hover-loop-active", isActive);
    }
  });
}

// Live solver for sandbox mode
let solveDebounceTimer = null;
function solveSandboxSOP() {
  clearTimeout(solveDebounceTimer);
  solveDebounceTimer = setTimeout(async () => {
    try {
      const mintermsList = Array.from(sandboxMinterms);
      const res = await fetch("/api/kmap-solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ minterms: mintermsList })
      });
      const data = await res.json();
      if (data.success) {
        const formulaEl = document.getElementById("kmap-sandbox-formula");
        if (formulaEl) {
          formulaEl.textContent = data.result.sop || "0";
        }
      }
    } catch (e) {
      console.error("Sandbox solve error:", e);
    }
  }, 150);
}

function highlightActiveSimulatorMintermOnKMap() {
  document.querySelectorAll(".kmap-interactive-cell").forEach(cell => {
    cell.classList.remove("sim-current-target");
  });
  const activeCell = document.getElementById(`kmap-cell-${currentSimulatorMinterm}`);
  if (activeCell) {
    activeCell.classList.add("sim-current-target");
  }
}

// 6. Interactive Elementary Logic Gate Playground Lab
let playgroundState = {
  gate: "AND",
  inputA: 0,
  inputB: 0
};

function initPlayground() {
  updatePlayground();
}

window.selectPlaygroundGate = function(gateName) {
  playgroundState.gate = gateName;
  document.querySelectorAll(".gate-btn").forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-gate") === gateName);
  });
  updatePlayground();
};

window.togglePlaygroundInput = function(pin) {
  if (pin === "A") {
    playgroundState.inputA = playgroundState.inputA === 1 ? 0 : 1;
  } else if (pin === "B") {
    playgroundState.inputB = playgroundState.inputB === 1 ? 0 : 1;
  }
  updatePlayground();
};

function updatePlayground() {
  const g = playgroundState.gate;
  const a = playgroundState.inputA;
  const b = playgroundState.inputB;

  const btnB = document.getElementById("gate-toggle-b");
  const thB = document.getElementById("playground-th-b");
  if (g === "NOT") {
    if (btnB) btnB.style.display = "none";
    if (thB) thB.style.display = "none";
  } else {
    if (btnB) btnB.style.display = "inline-block";
    if (thB) thB.style.display = "table-cell";
  }

  const valAEl = document.getElementById("gate-val-a");
  const valBEl = document.getElementById("gate-val-b");
  if (valAEl) valAEl.textContent = a;
  if (valBEl) valBEl.textContent = b;

  let y = 0;
  let formula = "";
  switch (g) {
    case "AND": y = (a && b) ? 1 : 0; formula = "Y = A · B"; break;
    case "OR":  y = (a || b) ? 1 : 0; formula = "Y = A + B"; break;
    case "NOT": y = (!a) ? 1 : 0; formula = "Y = A'"; break;
    case "NAND": y = !(a && b) ? 1 : 0; formula = "Y = (A · B)'"; break;
    case "NOR":  y = !(a || b) ? 1 : 0; formula = "Y = (A + B)'"; break;
    case "XOR":  y = (a ^ b) ? 1 : 0; formula = "Y = A ⊕ B"; break;
    case "XNOR": y = !(a ^ b) ? 1 : 0; formula = "Y = (A ⊕ B)'"; break;
  }

  const formEl = document.getElementById("playground-formula");
  if (formEl) formEl.textContent = `${formula}  ->  Output Y = ${y}`;

  renderPlaygroundSVG(g, a, b, y);
  renderPlaygroundTruthTable(g, a, b, y);
}

function renderPlaygroundSVG(gate, a, b, y) {
  const container = document.getElementById("playground-svg-container");
  if (!container) return;

  const aWire = a ? "stroke:#38bdf8; stroke-width:2.5; stroke-dasharray:6 4; animation:wireElectronFlow 0.5s linear infinite; filter:drop-shadow(0 0 5px #38bdf8);" : "stroke:#334155; stroke-width:1.5;";
  const bWire = b ? "stroke:#38bdf8; stroke-width:2.5; stroke-dasharray:6 4; animation:wireElectronFlow 0.5s linear infinite; filter:drop-shadow(0 0 5px #38bdf8);" : "stroke:#334155; stroke-width:1.5;";
  const yWire = y ? "stroke:#10b981; stroke-width:2.5; stroke-dasharray:6 4; animation:wireElectronFlow 0.5s linear infinite; filter:drop-shadow(0 0 6px #10b981);" : "stroke:#334155; stroke-width:1.5;";
  const yColor = y ? "#10b981" : "#475569";
  const gateColor = y ? "#38bdf8" : "#94a3b8";

  let gateSymbol = "";
  if (gate === "AND") {
    gateSymbol = `<path d="M 80,20 L 110,20 A 30,30 0 0,1 110,80 L 80,80 Z" fill="#141f35" stroke="${gateColor}" stroke-width="2"/>
                  <text x="96" y="55" fill="${gateColor}" font-size="11" font-weight="bold" font-family="monospace">AND</text>`;
  } else if (gate === "OR") {
    gateSymbol = `<path d="M 80,20 Q 95,50 80,80 Q 115,80 135,50 Q 115,20 80,20 Z" fill="#141f35" stroke="${gateColor}" stroke-width="2"/>
                  <text x="96" y="55" fill="${gateColor}" font-size="11" font-weight="bold" font-family="monospace">OR</text>`;
  } else if (gate === "NOT") {
    gateSymbol = `<polygon points="85,25 85,75 125,50" fill="#141f35" stroke="${gateColor}" stroke-width="2"/>
                  <circle cx="131" cy="50" r="5" fill="#070b14" stroke="${gateColor}" stroke-width="2"/>
                  <text x="95" y="54" fill="${gateColor}" font-size="10" font-family="monospace">NOT</text>`;
  } else if (gate === "NAND") {
    gateSymbol = `<path d="M 80,20 L 110,20 A 30,30 0 0,1 110,80 L 80,80 Z" fill="#141f35" stroke="${gateColor}" stroke-width="2"/>
                  <circle cx="145" cy="50" r="5" fill="#070b14" stroke="${gateColor}" stroke-width="2"/>
                  <text x="94" y="55" fill="${gateColor}" font-size="10" font-weight="bold" font-family="monospace">NAND</text>`;
  } else if (gate === "NOR") {
    gateSymbol = `<path d="M 80,20 Q 95,50 80,80 Q 115,80 135,50 Q 115,20 80,20 Z" fill="#141f35" stroke="${gateColor}" stroke-width="2"/>
                  <circle cx="141" cy="50" r="5" fill="#070b14" stroke="${gateColor}" stroke-width="2"/>
                  <text x="96" y="55" fill="${gateColor}" font-size="10" font-weight="bold" font-family="monospace">NOR</text>`;
  } else if (gate === "XOR") {
    gateSymbol = `<path d="M 72,20 Q 87,50 72,80" fill="none" stroke="${gateColor}" stroke-width="2"/>
                  <path d="M 80,20 Q 95,50 80,80 Q 115,80 135,50 Q 115,20 80,20 Z" fill="#141f35" stroke="${gateColor}" stroke-width="2"/>
                  <text x="96" y="55" fill="${gateColor}" font-size="10" font-weight="bold" font-family="monospace">XOR</text>`;
  } else if (gate === "XNOR") {
    gateSymbol = `<path d="M 72,20 Q 87,50 72,80" fill="none" stroke="${gateColor}" stroke-width="2"/>
                  <path d="M 80,20 Q 95,50 80,80 Q 115,80 135,50 Q 115,20 80,20 Z" fill="#141f35" stroke="${gateColor}" stroke-width="2"/>
                  <circle cx="141" cy="50" r="5" fill="#070b14" stroke="${gateColor}" stroke-width="2"/>
                  <text x="93" y="55" fill="${gateColor}" font-size="10" font-weight="bold" font-family="monospace">XNOR</text>`;
  }

  const outStartX = (gate === "NAND" || gate === "NOR" || gate === "XNOR") ? 147 : (gate === "NOT" ? 137 : 140);

  container.innerHTML = `
    <svg width="240" height="100" viewBox="0 0 240 100">
      ${gate === "NOT" ? `
        <line x1="20" y1="50" x2="85" y2="50" style="${aWire}"/>
        <circle cx="20" cy="50" r="4" fill="${a ? '#38bdf8' : '#334155'}"/>
        <text x="6" y="54" fill="#38bdf8" font-size="11" font-family="monospace">A</text>
      ` : `
        <line x1="20" y1="35" x2="80" y2="35" style="${aWire}"/>
        <circle cx="20" cy="35" r="4" fill="${a ? '#38bdf8' : '#334155'}"/>
        <text x="6" y="39" fill="#38bdf8" font-size="11" font-family="monospace">A</text>

        <line x1="20" y1="65" x2="80" y2="65" style="${bWire}"/>
        <circle cx="20" cy="65" r="4" fill="${b ? '#38bdf8' : '#334155'}"/>
        <text x="6" y="69" fill="#38bdf8" font-size="11" font-family="monospace">B</text>
      `}
      ${gateSymbol}
      <line x1="${outStartX}" y1="50" x2="200" y2="50" style="${yWire}"/>
      <circle cx="200" cy="50" r="5" fill="${yColor}" class="${y ? 'probe-active' : ''}"/>
      <text x="208" y="54" fill="${yColor}" font-size="11" font-weight="bold" font-family="monospace">Y=[${y}]</text>
    </svg>
  `;
}

function renderPlaygroundTruthTable(gate, activeA, activeB, activeY) {
  const tbody = document.getElementById("playground-tt-tbody");
  if (!tbody) return;

  const rows = gate === "NOT" 
    ? [{ a: 0, b: null }, { a: 1, b: null }]
    : [{ a: 0, b: 0 }, { a: 0, b: 1 }, { a: 1, b: 0 }, { a: 1, b: 1 }];

  tbody.innerHTML = "";
  rows.forEach(r => {
    let out = 0;
    switch (gate) {
      case "AND": out = (r.a && r.b) ? 1 : 0; break;
      case "OR":  out = (r.a || r.b) ? 1 : 0; break;
      case "NOT": out = (!r.a) ? 1 : 0; break;
      case "NAND": out = !(r.a && r.b) ? 1 : 0; break;
      case "NOR":  out = !(r.a || r.b) ? 1 : 0; break;
      case "XOR":  out = (r.a ^ r.b) ? 1 : 0; break;
      case "XNOR": out = !(r.a ^ r.b) ? 1 : 0; break;
    }

    const isCurrent = (gate === "NOT")
      ? (r.a === activeA)
      : (r.a === activeA && r.b === activeB);

    const tr = document.createElement("tr");
    if (isCurrent) {
      tr.style.background = "rgba(56, 189, 248, 0.16)";
      tr.style.fontWeight = "bold";
    }

    tr.innerHTML = `
      <td style="color:${r.a ? '#38bdf8' : 'inherit'}">${r.a}</td>
      ${gate !== "NOT" ? `<td style="color:${r.b ? '#38bdf8' : 'inherit'}">${r.b}</td>` : ''}
      <td style="color:${out ? '#10b981' : '#f87171'}; font-weight:bold;">${out}</td>
      <td>${isCurrent ? '<span class="badge badge-success" style="font-size:0.68rem; padding:0.15rem 0.4rem;">ACTIVE</span>' : '<span style="color:var(--text-muted); font-size:0.75rem;">&bull;</span>'}</td>
    `;
    tbody.appendChild(tr);
  });
}

// 6. Automated Test Runner
function initTestRunner() {
  const runBtn = document.getElementById("run-tests-btn");
  if (!runBtn) return;

  runBtn.addEventListener("click", async () => {
    runBtn.disabled = true;
    runBtn.innerHTML = "Executing Testbench...";

    try {
      const res = await fetch("/api/run-tests", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        renderTestResults(data.summary);
      }
    } catch (e) {
      console.error("Error executing tests:", e);
    } finally {
      runBtn.disabled = false;
      runBtn.innerHTML = "Re-execute Testbench";
    }
  });

  fetch("/api/run-tests")
    .then(r => r.json())
    .then(d => { if (d.success) renderTestResults(d.summary); });
}

function renderTestResults(summary) {
  const statBox = document.getElementById("test-stats");
  if (statBox) {
    statBox.innerHTML = `
      <div style="display:flex; gap:1.25rem; flex-wrap:wrap; margin-bottom:1.25rem;">
        <div class="card" style="flex:1; margin-bottom:0; text-align:center; padding:1rem;">
          <div style="font-size:1.8rem; font-weight:bold; color:var(--text-primary); font-family:var(--font-mono);">${summary.total}</div>
          <div style="font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase; font-weight:700;">Test Vectors</div>
        </div>
        <div class="card" style="flex:1; margin-bottom:0; text-align:center; padding:1rem; border-color:var(--logic-high-border);">
          <div style="font-size:1.8rem; font-weight:bold; color:#34d399; font-family:var(--font-mono);">${summary.passed}</div>
          <div style="font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase; font-weight:700;">Verified Assertions</div>
        </div>
        <div class="card" style="flex:1; margin-bottom:0; text-align:center; padding:1rem; border-color:${summary.failed > 0 ? 'var(--logic-low-border)' : 'var(--border-subtle)'};">
          <div style="font-size:1.8rem; font-weight:bold; color:${summary.failed > 0 ? '#f87171' : 'var(--text-muted)'}; font-family:var(--font-mono);">${summary.failed}</div>
          <div style="font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase; font-weight:700;">Discrepancies</div>
        </div>
        <div class="card" style="flex:1; margin-bottom:0; text-align:center; padding:1rem;">
          <div style="font-size:1.6rem; font-weight:bold; color:${summary.all_passed ? '#34d399' : '#f87171'}; font-family:var(--font-mono);">
            ${summary.all_passed ? '100% PASS' : 'FAIL'}
          </div>
          <div style="font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase; font-weight:700;">Testbench Result</div>
        </div>
      </div>
    `;
  }

  const tbody = document.getElementById("test-results-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  summary.cases.forEach(c => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-weight:bold; text-align:center;">#${c.id}</td>
      <td style="text-align:center;"><span class="badge ${c.type === 'Fault' ? 'badge-danger' : (c.type === 'Edge' ? 'badge-warning' : 'badge-success')}">${c.type}</span></td>
      <td style="color:var(--text-primary);">${c.description}</td>
      <td style="font-family:'Fira Code', monospace; font-size:0.8rem; color:var(--text-secondary);">${JSON.stringify(c.inputs_display)}</td>
      <td style="font-weight:600; color:var(--accent-cyan); text-align:center;">${c.expected}</td>
      <td style="font-weight:600; text-align:center;">${c.actual}</td>
      <td style="text-align:center;"><span class="badge ${c.status === 'PASS' ? 'badge-success' : 'badge-danger'}">${c.status}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

// ==========================================================================
// 7. WEB AUDIO ACOUSTIC SYNTHESIZER
// ==========================================================================
let audioCtx = null;
let audioSynthEnabled = false;

function initAudioSynth() {
  const btn = document.getElementById("audio-synth-btn");
  if (btn) {
    btn.classList.toggle("active", audioSynthEnabled);
  }
}

window.toggleAudioSynth = function() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  audioSynthEnabled = !audioSynthEnabled;
  const btn = document.getElementById("audio-synth-btn");
  const icon = document.getElementById("audio-icon");
  const label = document.getElementById("audio-label");
  if (btn) {
    btn.classList.toggle("active", audioSynthEnabled);
    if (icon) icon.textContent = audioSynthEnabled ? "🔊" : "🔇";
    if (label) label.textContent = audioSynthEnabled ? "Sound FX: ON" : "Sound FX: OFF";
  }
  if (audioSynthEnabled) {
    playTone(880, 0.08, "sine", 0.15);
  }
};

function playTone(freq, duration, type = "sine", gain = 0.1) {
  if (!audioSynthEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(gain, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.warn("Audio error:", e);
  }
}

function playRelayClick() {
  playTone(1600, 0.02, "triangle", 0.08);
}
function playCellClickSound() {
  playTone(1200, 0.04, "sine", 0.09);
}
let lastAudibleDecision = null;
function triggerVerdictSound(decision) {
  if (!audioSynthEnabled || decision === lastAudibleDecision) return;
  lastAudibleDecision = decision;
  if (decision === "APPROVED") {
    playTone(523.25, 0.12, "sine", 0.1);
    setTimeout(() => playTone(659.25, 0.18, "sine", 0.12), 90);
  } else if (decision === "REJECTED") {
    playTone(400, 0.1, "sawtooth", 0.06);
    setTimeout(() => playTone(280, 0.15, "sawtooth", 0.07), 80);
  } else if (decision === "REVIEW") {
    playTone(440, 0.1, "sine", 0.08);
    setTimeout(() => playTone(493.88, 0.14, "sine", 0.08), 80);
  }
}

// ==========================================================================
// 8. MULTI-CHANNEL DIGITAL LOGIC TIMING ANALYZER (OSCILLOSCOPE)
// ==========================================================================
let scopeCanvas = null;
let scopeCtx = null;
let scopeAnimFrame = null;
let isScopePaused = false;
let scopeSpeed = 1.0;
let scopeCurrentView = "circuit";

const SCOPE_CHANNELS = [
  { id: "A", name: "CH1: A", color: "#38bdf8", logic: 1 },
  { id: "B", name: "CH2: B", color: "#38bdf8", logic: 1 },
  { id: "C", name: "CH3: C", color: "#38bdf8", logic: 1 },
  { id: "D", name: "CH4: D", color: "#38bdf8", logic: 0 },
  { id: "APPROVE", name: "OUT: APP", color: "#10b981", logic: 1 },
  { id: "REJECT", name: "OUT: REJ", color: "#ef4444", logic: 0 },
  { id: "REVIEW", name: "OUT: REV", color: "#fbbf24", logic: 0 }
];

const SCOPE_MAX_SAMPLES = 280;
let scopeHistory = [];

function initTimingAnalyzer() {
  scopeCanvas = document.getElementById("timing-analyzer-canvas");
  if (!scopeCanvas) return;
  scopeCtx = scopeCanvas.getContext("2d");

  const initialSignals = {
    A: 1, B: 1, C: 1, D: 0,
    APPROVE: 1, REJECT: 0, REVIEW: 0
  };
  scopeHistory = [];
  for (let i = 0; i < SCOPE_MAX_SAMPLES; i++) {
    scopeHistory.push({ ...initialSignals });
  }

  startScopeLoop();
}

function recordScopeSample(signals) {
  SCOPE_CHANNELS.forEach(ch => {
    if (signals[ch.id] !== undefined) {
      ch.logic = signals[ch.id];
    }
  });
}

let scopeSweepProgress = 0;

function startScopeLoop() {
  if (scopeAnimFrame) cancelAnimationFrame(scopeAnimFrame);
  let lastTime = performance.now();
  let sampleAccumulator = 0;

  function loop(now) {
    const dt = Math.min(now - lastTime, 100);
    lastTime = now;

    if (!isScopePaused) {
      scopeSweepProgress = (scopeSweepProgress + (dt * 0.0004 * scopeSpeed)) % 1.0;
      sampleAccumulator += (dt / 16.66) * scopeSpeed;
      while (sampleAccumulator >= 1) {
        sampleAccumulator -= 1;
        const sample = {};
        SCOPE_CHANNELS.forEach(ch => {
          sample[ch.id] = ch.logic;
        });
        scopeHistory.push(sample);
        if (scopeHistory.length > SCOPE_MAX_SAMPLES) {
          scopeHistory.shift();
        }
      }
    }

    renderOscilloscope();
    scopeAnimFrame = requestAnimationFrame(loop);
  }

  scopeAnimFrame = requestAnimationFrame(loop);
}

function renderOscilloscope() {
  if (!scopeCtx || !scopeCanvas) return;
  const ctx = scopeCtx;

  // Razor-sharp High-DPI Display Scaling
  const rect = scopeCanvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const displayW = Math.max(300, Math.floor(rect.width || 800));
  const displayH = 230;

  if (scopeCanvas.width !== Math.floor(displayW * dpr) || scopeCanvas.height !== Math.floor(displayH * dpr)) {
    scopeCanvas.width = Math.floor(displayW * dpr);
    scopeCanvas.height = Math.floor(displayH * dpr);
  }

  ctx.save();
  ctx.scale(dpr, dpr);
  const w = displayW;
  const h = displayH;

  // CRT Phosphor Dark Backdrop
  ctx.fillStyle = "#020408";
  ctx.fillRect(0, 0, w, h);

  // Time Division Grid Reticle
  ctx.strokeStyle = "rgba(56, 189, 248, 0.08)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  const numGridCols = 16;
  for (let x = 0; x <= w; x += w / numGridCols) {
    ctx.moveTo(x, 18);
    ctx.lineTo(x, h);
  }
  ctx.stroke();

  // Metrics
  const marginL = 74;
  const marginR = 50;
  const traceWidth = Math.max(100, w - marginL - marginR);
  const numChannels = SCOPE_CHANNELS.length;
  const chanHeight = (h - 18) / numChannels;
  const highAmp = chanHeight * 0.58;

  // Draw Top Time Scale Graduations
  ctx.font = "600 9px 'Fira Code', monospace";
  ctx.fillStyle = "rgba(148, 163, 184, 0.7)";
  ctx.textAlign = "center";
  const numGrads = 8;
  for (let g = 0; g <= numGrads; g++) {
    const gx = marginL + (g / numGrads) * traceWidth;
    ctx.fillText(`${g * 5}ms`, gx, 12);
    ctx.strokeStyle = "rgba(56, 189, 248, 0.12)";
    ctx.beginPath();
    ctx.moveTo(gx, 15);
    ctx.lineTo(gx, h);
    ctx.stroke();
  }

  // Active Sweeping Beam Line (shows live sweep in real-time)
  if (!isScopePaused) {
    const sweepX = marginL + scopeSweepProgress * traceWidth;
    const sweepGrad = ctx.createLinearGradient(sweepX - 25, 0, sweepX + 3, 0);
    sweepGrad.addColorStop(0, "rgba(56, 189, 248, 0)");
    sweepGrad.addColorStop(0.85, "rgba(56, 189, 248, 0.06)");
    sweepGrad.addColorStop(1, "rgba(56, 189, 248, 0.35)");
    ctx.fillStyle = sweepGrad;
    ctx.fillRect(sweepX - 25, 16, 28, h - 16);

    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sweepX, 16);
    ctx.lineTo(sweepX, h);
    ctx.stroke();
  }

  SCOPE_CHANNELS.forEach((ch, idx) => {
    const baselineY = 18 + (idx + 1) * chanHeight - 5;
    const highY = baselineY - highAmp;

    // Channel Divider
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 18 + (idx + 1) * chanHeight);
    ctx.lineTo(w, 18 + (idx + 1) * chanHeight);
    ctx.stroke();

    // Channel Legend
    ctx.font = "bold 10px 'Fira Code', monospace";
    ctx.fillStyle = ch.color;
    ctx.textAlign = "left";
    ctx.fillText(ch.name, 8, baselineY - highAmp * 0.35);

    // Waveform Path (Crisp 2px vector lines with zero blur)
    if (scopeHistory.length > 1) {
      ctx.save();
      ctx.strokeStyle = ch.color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      const step = traceWidth / (SCOPE_MAX_SAMPLES - 1);

      for (let i = 0; i < scopeHistory.length; i++) {
        const val = scopeHistory[i][ch.id] || 0;
        const curY = val ? highY : baselineY;
        const curX = marginL + i * step;

        if (i === 0) {
          ctx.moveTo(curX, curY);
        } else {
          const prevVal = scopeHistory[i - 1][ch.id] || 0;
          const prevY = prevVal ? highY : baselineY;
          if (prevVal !== val) {
            ctx.lineTo(curX, prevY);
            ctx.lineTo(curX, curY);
          } else {
            ctx.lineTo(curX, curY);
          }
        }
      }
      ctx.stroke();
      ctx.restore();
    }

    // Right status readout
    const currentVal = ch.logic;
    ctx.font = "bold 11px 'Fira Code', monospace";
    ctx.fillStyle = currentVal ? ch.color : "#64748b";
    ctx.textAlign = "right";
    ctx.fillText(`[${currentVal}]`, w - 10, baselineY - highAmp * 0.35);
  });

  ctx.restore();
}

window.switchTraceView = function(view) {
  scopeCurrentView = view;
  document.querySelectorAll(".trace-view-btn").forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-view") === view);
  });

  const circuitView = document.getElementById("sim-circuit-schematic-view");
  const scopeView = document.getElementById("sim-timing-analyzer-view");

  if (view === "circuit") {
    if (circuitView) circuitView.style.display = "block";
    if (scopeView) scopeView.style.display = "none";
  } else if (view === "scope") {
    if (circuitView) circuitView.style.display = "none";
    if (scopeView) scopeView.style.display = "block";
  } else if (view === "both") {
    if (circuitView) circuitView.style.display = "block";
    if (scopeView) scopeView.style.display = "block";
  }
};

window.toggleScopePause = function() {
  isScopePaused = !isScopePaused;
  const btn = document.getElementById("scope-pause-btn");
  const badge = document.getElementById("scope-status-badge");
  if (btn) {
    btn.textContent = isScopePaused ? "▶ Resume" : "⏸ Freeze";
  }
  if (badge) {
    badge.textContent = isScopePaused ? "FROZEN" : "SWEEPING: 60 FPS";
    badge.style.color = isScopePaused ? "#fbbf24" : "var(--text-muted)";
  }
};

window.clearScopeData = function() {
  const current = {};
  SCOPE_CHANNELS.forEach(ch => { current[ch.id] = ch.logic; });
  scopeHistory = [];
  for (let i = 0; i < SCOPE_MAX_SAMPLES; i++) {
    scopeHistory.push({ ...current });
  }
};

window.setScopeSpeed = function(sp) {
  scopeSpeed = sp;
  document.querySelectorAll(".scope-speed-btn").forEach(b => {
    b.classList.toggle("active", parseFloat(b.getAttribute("data-speed")) === sp);
  });
};

// ==========================================================================
// 9. AUTOMATED DIGITAL CLOCK GENERATOR & MINTERM SEQUENCER
// ==========================================================================
let clockRunning = false;
let clockInterval = null;
let clockFrequency = 1200;
let clockMinterm = 14;

function initClockGenerator() {
  updateClockDisplay();
}

function updateClockDisplay() {
  window.clockMinterm = clockMinterm;
  window.clockRunning = clockRunning;
  const disp = document.getElementById("clock-step-display");
  if (!disp) return;
  const A = (clockMinterm >> 3) & 1;
  const B = (clockMinterm >> 2) & 1;
  const C = (clockMinterm >> 1) & 1;
  const D = clockMinterm & 1;
  disp.textContent = `m${clockMinterm} (${A}${B}${C}${D})`;
}

window.toggleClockGenerator = function() {
  clockRunning = !clockRunning;
  const btn = document.getElementById("clock-play-btn");
  const icon = document.getElementById("clock-play-icon");
  const text = document.getElementById("clock-play-text");

  if (clockRunning) {
    if (btn) btn.classList.add("running");
    if (icon) icon.textContent = "⏸";
    if (text) text.textContent = "Auto Clock: PAUSE";
    startClockTimer();
  } else {
    if (btn) btn.classList.remove("running");
    if (icon) icon.textContent = "▶";
    if (text) text.textContent = "Auto Clock: START";
    stopClockTimer();
  }
};

function startClockTimer() {
  if (clockInterval) clearInterval(clockInterval);
  clockInterval = setInterval(() => {
    clockStepNext();
  }, clockFrequency);
}

function stopClockTimer() {
  if (clockInterval) {
    clearInterval(clockInterval);
    clockInterval = null;
  }
}

window.setClockFrequency = function(ms) {
  clockFrequency = ms;
  document.querySelectorAll(".speed-btn").forEach(b => {
    b.classList.toggle("active", parseInt(b.getAttribute("data-freq")) === ms);
  });
  if (clockRunning) {
    startClockTimer();
  }
};

window.clockStepNext = function() {
  clockMinterm = (clockMinterm + 1) % 16;
  applyMintermToSimulator(clockMinterm);
};

window.clockStepPrev = function() {
  clockMinterm = (clockMinterm - 1 + 16) % 16;
  applyMintermToSimulator(clockMinterm);
};

function applyMintermToSimulator(m) {
  const A = (m >> 3) & 1;
  const B = (m >> 2) & 1;
  const C = (m >> 1) & 1;
  const D = m & 1;

  // Master Clock Pulse indicator
  const led = document.getElementById("clock-pulse-led");
  if (led) {
    led.classList.add("clock-pulse");
    setTimeout(() => led.classList.remove("clock-pulse"), 150);
  }

  // Update simulator parameters
  simState.income = A ? 55000 : 30000;
  simState.credit_score = B ? 750 : 620;
  simState.age = C ? 29 : 65;
  simState.has_default = D === 1;

  // Sync inputs
  const incSlider = document.getElementById("sim-income-slider");
  const incInput = document.getElementById("sim-income-input");
  const incDisplay = document.getElementById("sim-income-display");
  if (incSlider) incSlider.value = simState.income;
  if (incInput) incInput.value = simState.income;
  if (incDisplay) incDisplay.textContent = formatINR(simState.income);

  const crSlider = document.getElementById("sim-credit-slider");
  const crInput = document.getElementById("sim-credit-input");
  const crDisplay = document.getElementById("sim-credit-display");
  if (crSlider) crSlider.value = simState.credit_score;
  if (crInput) crInput.value = simState.credit_score;
  if (crDisplay) crDisplay.textContent = simState.credit_score;

  const ageSlider = document.getElementById("sim-age-slider");
  const ageInput = document.getElementById("sim-age-input");
  const ageDisplay = document.getElementById("sim-age-display");
  if (ageSlider) ageSlider.value = simState.age;
  if (ageInput) ageInput.value = simState.age;
  if (ageDisplay) ageDisplay.textContent = `${simState.age} yrs`;

  document.querySelectorAll("[data-field='default']").forEach(b => {
    b.classList.toggle("active", (b.getAttribute("data-value") === "true") === simState.has_default);
  });

  updateClockDisplay();
  playRelayClick();
  evaluateSimulator(simState);
}

// ==========================================================================
// 10. FLOATING DIGITAL MULTIMETER HUD
// ==========================================================================
let activeInspectedNodeKey = "AND_APPROVE";

function updateMultimeterHUD(nodeKey, node) {
  activeInspectedNodeKey = nodeKey;
  const hud = document.getElementById("multimeter-hud");
  if (!hud) return;
  hud.style.display = "block";

  const title = document.getElementById("mm-title");
  const volts = document.getElementById("mm-volts");
  const logic = document.getElementById("mm-logic");
  const eq = document.getElementById("mm-equation");
  const delay = document.getElementById("mm-delay");
  const fanout = document.getElementById("mm-fanout");

  const isHigh = node.state === 1;
  const v = isHigh ? "5.00 V" : "0.05 V";
  const delays = {
    "NOT_D": "2.4 ns", "NOT_A": "2.4 ns", "NOT_B": "2.4 ns",
    "AND_AB": "3.1 ns", "AND_CD": "3.1 ns",
    "AND_APPROVE": "3.6 ns", "AND_NOT_A_B": "3.1 ns",
    "OR_REJECT": "4.1 ns", "NOR_REVIEW": "5.2 ns"
  };
  const fanouts = {
    "NOT_D": "1 Gate", "NOT_A": "1 Gate", "NOT_B": "1 Gate",
    "AND_AB": "1 Gate", "AND_CD": "1 Gate",
    "AND_APPROVE": "1 Output + NOR", "AND_NOT_A_B": "1 Gate",
    "OR_REJECT": "1 Output + NOR", "NOR_REVIEW": "1 Output"
  };

  if (title) title.textContent = `PROBE: ${node.name}`;
  if (volts) {
    volts.textContent = v;
    volts.style.color = isHigh ? "#34d399" : "#94a3b8";
  }
  if (logic) {
    logic.textContent = isHigh ? "LOGIC HIGH [1]" : "LOGIC LOW [0]";
    logic.style.color = isHigh ? "#34d399" : "#f87171";
  }
  if (eq) eq.textContent = node.formula;
  if (delay) delay.textContent = delays[nodeKey] || "3.5 ns";
  if (fanout) fanout.textContent = fanouts[nodeKey] || "2 Gates";

  drawMultimeterWave(isHigh);
}

function refreshMultimeterHUD() {
  const hud = document.getElementById("multimeter-hud");
  if (hud && hud.style.display !== "none" && activeInspectedNodeKey) {
    inspectCircuitNode(activeInspectedNodeKey);
  }
}

window.closeMultimeterHUD = function() {
  const hud = document.getElementById("multimeter-hud");
  if (hud) hud.style.display = "none";
};

function drawMultimeterWave(isHigh) {
  const cvs = document.getElementById("multimeter-wave-canvas");
  if (!cvs) return;
  const ctx = cvs.getContext("2d");
  const w = cvs.width;
  const h = cvs.height;

  ctx.fillStyle = "#040812";
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = isHigh ? "#38bdf8" : "#475569";
  ctx.lineWidth = 2;
  ctx.shadowColor = isHigh ? "#38bdf8" : "transparent";
  ctx.shadowBlur = 4;

  const yHigh = 8;
  const yLow = h - 8;
  const targetY = isHigh ? yHigh : yLow;

  ctx.beginPath();
  const period = 24;
  for (let x = 0; x <= w; x += period) {
    ctx.moveTo(x, isHigh ? yLow : yHigh);
    ctx.lineTo(x + period * 0.2, isHigh ? yLow : yHigh);
    ctx.lineTo(x + period * 0.2, targetY);
    ctx.lineTo(x + period * 0.8, targetY);
    ctx.lineTo(x + period * 0.8, isHigh ? yLow : yHigh);
    ctx.lineTo(x + period, isHigh ? yLow : yHigh);
  }
  ctx.stroke();
}

// ==========================================================================
// 11. DYNAMIC SVG CAPSULE LOOPS FOR K-MAP STUDIO
// ==========================================================================
function initKMapCapsules() {
  window.addEventListener("resize", () => {
    if (typeof drawKMapCapsules === "function") drawKMapCapsules();
  });
}

function drawKMapCapsules() {
  const svg = document.getElementById("kmap-capsules-svg");
  const wrapper = document.getElementById("kmap-board-wrapper");
  const chk = document.getElementById("kmap-loop-toggle");
  if (!svg || !wrapper) return;

  svg.innerHTML = "";
  if (chk && !chk.checked) return;
  if (currentKMapOutput === "SANDBOX") return;

  const wrapRect = wrapper.getBoundingClientRect();
  if (wrapRect.width === 0 || wrapRect.height === 0) return;
  svg.setAttribute("viewBox", `0 0 ${wrapRect.width} ${wrapRect.height}`);

  function getCellRect(minterm) {
    const el = document.getElementById(`kmap-cell-${minterm}`);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      x: r.left - wrapRect.left,
      y: r.top - wrapRect.top,
      w: r.width,
      h: r.height,
      r: r.right - wrapRect.left,
      b: r.bottom - wrapRect.top
    };
  }

  function addCapsule(minterms, color, label) {
    const rects = minterms.map(m => getCellRect(m)).filter(Boolean);
    if (rects.length === 0) return;

    let minX = Math.min(...rects.map(r => r.x)) + 3;
    let minY = Math.min(...rects.map(r => r.y)) + 3;
    let maxX = Math.max(...rects.map(r => r.r)) - 3;
    let maxY = Math.max(...rects.map(r => r.b)) - 3;

    const pad = 4;
    const rectEl = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rectEl.setAttribute("x", minX - pad);
    rectEl.setAttribute("y", minY - pad);
    rectEl.setAttribute("width", (maxX - minX) + pad * 2);
    rectEl.setAttribute("height", (maxY - minY) + pad * 2);
    rectEl.setAttribute("rx", "12");
    rectEl.setAttribute("ry", "12");
    rectEl.setAttribute("stroke", color);
    rectEl.setAttribute("fill", color);
    rectEl.setAttribute("class", "kmap-capsule");
    rectEl.style.color = color;
    svg.appendChild(rectEl);
  }

  if (currentKMapOutput === "APPROVE") {
    addCapsule([14], "#10b981", "Essential Prime Implicant");
  } else if (currentKMapOutput === "REJECT") {
    // Octet: D=1 (Cols 1 & 2: m1, m3, m5, m7, m9, m11, m13, m15)
    addCapsule([1, 3, 5, 7, 9, 11, 13, 15], "#ef4444", "Octet: D=1");
    // Quad: A'B' (Row 0: m0, m1, m3, m2)
    addCapsule([0, 1, 3, 2], "#f59e0b", "Quad: A'B'");
  } else if (currentKMapOutput === "REVIEW") {
    // Pair 1: A B' D' (m8, m10)
    addCapsule([8], "#38bdf8", "Pair 1 (Left)");
    addCapsule([10], "#38bdf8", "Pair 1 (Right)");
    // Pair 2: A' B D' (m4, m6)
    addCapsule([4], "#c084fc", "Pair 2 (Left)");
    addCapsule([6], "#c084fc", "Pair 2 (Right)");
    // Pair 3: B C' D' (m4, m12)
    addCapsule([4, 12], "#fbbf24", "Pair 3: B·C'·D'");
  }
}

/* ==========================================================================
   7.0 LEARNING HUB CONTROLLER
   ========================================================================== */

let theoremVars = { A: 0, B: 0, C: 0 };
let dualityMode = 1; // 1 = NAND, 2 = NOR

function initLearningHub() {
  const select = document.getElementById("theorem-select");
  if (select) {
    select.addEventListener("change", updateTheoremProver);
  }
  updateTheoremProver();
}

function toggleTheoremVar(varName) {
  theoremVars[varName] = theoremVars[varName] === 0 ? 1 : 0;
  const btn = document.getElementById(`thm-toggle-${varName.toLowerCase()}`);
  if (btn) {
    btn.textContent = theoremVars[varName];
    btn.classList.toggle("btn-primary", theoremVars[varName] === 1);
  }
  updateTheoremProver();
}

function updateTheoremProver() {
  const select = document.getElementById("theorem-select");
  if (!select) return;
  const thm = select.value;
  const { A, B, C } = theoremVars;

  const cContainer = document.getElementById("thm-c-container");
  if (cContainer) {
    cContainer.style.display = (thm === "distributive" || thm === "consensus") ? "flex" : "none";
  }

  let lhsExpr = "";
  let rhsExpr = "";
  let lhsVal = 0;
  let rhsVal = 0;

  if (thm === "absorption1") {
    lhsExpr = "A + A · B";
    rhsExpr = "A";
    lhsVal = (A || (A && B)) ? 1 : 0;
    rhsVal = A ? 1 : 0;
  } else if (thm === "absorption2") {
    lhsExpr = "A · (A + B)";
    rhsExpr = "A";
    lhsVal = (A && (A || B)) ? 1 : 0;
    rhsVal = A ? 1 : 0;
  } else if (thm === "distributive") {
    lhsExpr = "A + (B · C)";
    rhsExpr = "(A + B) · (A + C)";
    lhsVal = (A || (B && C)) ? 1 : 0;
    rhsVal = ((A || B) && (A || C)) ? 1 : 0;
  } else if (thm === "demorgan1") {
    lhsExpr = "(A · B)'";
    rhsExpr = "A' + B'";
    lhsVal = (!(A && B)) ? 1 : 0;
    rhsVal = ((!A) || (!B)) ? 1 : 0;
  } else if (thm === "demorgan2") {
    lhsExpr = "(A + B)'";
    rhsExpr = "A' · B'";
    lhsVal = (!(A || B)) ? 1 : 0;
    rhsVal = ((!A) && (!B)) ? 1 : 0;
  } else if (thm === "consensus") {
    lhsExpr = "A·B + A'·C + B·C";
    rhsExpr = "A·B + A'·C";
    lhsVal = ((A && B) || ((!A) && C) || (B && C)) ? 1 : 0;
    rhsVal = ((A && B) || ((!A) && C)) ? 1 : 0;
  }

  const lhsExprEl = document.getElementById("thm-lhs-expr");
  const rhsExprEl = document.getElementById("thm-rhs-expr");
  const lhsValEl = document.getElementById("thm-lhs-val");
  const rhsValEl = document.getElementById("thm-rhs-val");
  const statusEl = document.getElementById("thm-status-badge");

  if (lhsExprEl) lhsExprEl.textContent = lhsExpr;
  if (rhsExprEl) rhsExprEl.textContent = rhsExpr;
  if (lhsValEl) lhsValEl.textContent = lhsVal;
  if (rhsValEl) rhsValEl.textContent = rhsVal;

  if (statusEl) {
    const holds = lhsVal === rhsVal;
    statusEl.innerHTML = holds
      ? `✓ Theorem Holds: LHS (${lhsVal}) ≡ RHS (${rhsVal})`
      : `✗ Theorem Contradiction (Should not occur)`;
    statusEl.style.borderColor = holds ? "#34d399" : "#f87171";
    statusEl.style.color = holds ? "#34d399" : "#f87171";
    statusEl.style.background = holds ? "rgba(52, 211, 153, 0.15)" : "rgba(248, 113, 113, 0.15)";
  }
}

function toggleDualityVisualizer() {
  dualityMode = dualityMode === 1 ? 2 : 1;
  const toggleBtn = document.getElementById("duality-mode-toggle");
  const caption = document.getElementById("demorgan-caption");
  const svg = document.getElementById("demorgan-svg");
  if (!svg) return;

  if (dualityMode === 1) {
    if (toggleBtn) toggleBtn.textContent = "Switch to Theorem 2 (NOR)";
    if (caption) caption.textContent = "Figure 7.2A: Hardware duality equivalence between standard NAND and Inverted-Input OR.";
    svg.innerHTML = `
      <text x="75" y="20" fill="#94a3b8" font-size="12" text-anchor="middle" font-weight="700">NAND Gate: (A·B)'</text>
      <line x1="20" y1="50" x2="50" y2="50" stroke="#38bdf8" stroke-width="2"/>
      <line x1="20" y1="80" x2="50" y2="80" stroke="#38bdf8" stroke-width="2"/>
      <text x="12" y="54" fill="#94a3b8" font-size="11" font-weight="700">A</text>
      <text x="12" y="84" fill="#94a3b8" font-size="11" font-weight="700">B</text>
      <path d="M 50 40 L 75 40 A 25 25 0 0 1 75 90 L 50 90 Z" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
      <circle cx="104" cy="65" r="4" fill="#070d19" stroke="#38bdf8" stroke-width="2"/>
      <line x1="108" y1="65" x2="135" y2="65" stroke="#38bdf8" stroke-width="2"/>

      <text x="175" y="72" fill="#34d399" font-size="24" font-weight="800" text-anchor="middle">≡</text>

      <text x="285" y="20" fill="#94a3b8" font-size="12" text-anchor="middle" font-weight="700">Bubbled OR: A' + B'</text>
      <line x1="215" y1="50" x2="238" y2="50" stroke="#38bdf8" stroke-width="2"/>
      <line x1="215" y1="80" x2="238" y2="80" stroke="#38bdf8" stroke-width="2"/>
      <text x="207" y="54" fill="#94a3b8" font-size="11" font-weight="700">A</text>
      <text x="207" y="84" fill="#94a3b8" font-size="11" font-weight="700">B</text>
      <circle cx="242" cy="50" r="4" fill="#070d19" stroke="#38bdf8" stroke-width="2"/>
      <circle cx="242" cy="80" r="4" fill="#070d19" stroke="#38bdf8" stroke-width="2"/>
      <path d="M 246 40 Q 265 65 246 90 Q 275 90 295 65 Q 275 40 246 40 Z" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
      <line x1="295" y1="65" x2="330" y2="65" stroke="#38bdf8" stroke-width="2"/>
    `;
  } else {
    if (toggleBtn) toggleBtn.textContent = "Switch to Theorem 1 (NAND)";
    if (caption) caption.textContent = "Figure 7.2B: Hardware duality equivalence between standard NOR and Inverted-Input AND.";
    svg.innerHTML = `
      <text x="75" y="20" fill="#94a3b8" font-size="12" text-anchor="middle" font-weight="700">NOR Gate: (A+B)'</text>
      <line x1="20" y1="50" x2="46" y2="50" stroke="#c084fc" stroke-width="2"/>
      <line x1="20" y1="80" x2="46" y2="80" stroke="#c084fc" stroke-width="2"/>
      <text x="12" y="54" fill="#94a3b8" font-size="11" font-weight="700">A</text>
      <text x="12" y="84" fill="#94a3b8" font-size="11" font-weight="700">B</text>
      <path d="M 46 40 Q 65 65 46 90 Q 75 90 95 65 Q 75 40 46 40 Z" fill="#0f172a" stroke="#c084fc" stroke-width="2"/>
      <circle cx="99" cy="65" r="4" fill="#070d19" stroke="#c084fc" stroke-width="2"/>
      <line x1="103" y1="65" x2="135" y2="65" stroke="#c084fc" stroke-width="2"/>

      <text x="175" y="72" fill="#34d399" font-size="24" font-weight="800" text-anchor="middle">≡</text>

      <text x="285" y="20" fill="#94a3b8" font-size="12" text-anchor="middle" font-weight="700">Bubbled AND: A' · B'</text>
      <line x1="215" y1="50" x2="238" y2="50" stroke="#c084fc" stroke-width="2"/>
      <line x1="215" y1="80" x2="238" y2="80" stroke="#c084fc" stroke-width="2"/>
      <text x="207" y="54" fill="#94a3b8" font-size="11" font-weight="700">A</text>
      <text x="207" y="84" fill="#94a3b8" font-size="11" font-weight="700">B</text>
      <circle cx="242" cy="50" r="4" fill="#070d19" stroke="#c084fc" stroke-width="2"/>
      <circle cx="242" cy="80" r="4" fill="#070d19" stroke="#c084fc" stroke-width="2"/>
      <path d="M 246 40 L 271 40 A 25 25 0 0 1 271 90 L 246 90 Z" fill="#0f172a" stroke="#c084fc" stroke-width="2"/>
      <line x1="296" y1="65" x2="330" y2="65" stroke="#c084fc" stroke-width="2"/>
    `;
  }
}

/* ==========================================================================
   8.0 PRACTICE LAB CONTROLLER
   ========================================================================== */

function initPracticeLab() {
  loadTruthTableDrill();
  loadKMapChallenge();
  loadGatePuzzle();
}

function switchPracticeWorkbench(wbId) {
  document.querySelectorAll(".practice-workbench-pane").forEach(p => {
    p.classList.remove("active");
    p.style.display = "none";
  });
  const targetPane = document.getElementById(`wb-${wbId}`);
  if (targetPane) {
    targetPane.classList.add("active");
    targetPane.style.display = "block";
  }

  document.querySelectorAll(".practice-mode-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("onclick").includes(wbId));
  });
}

// Workbench 1: Truth Table Drill
const DRILL_SPECS = {
  drill1: {
    formula: "F = A · B' + C",
    vars: ["A", "B", "C"],
    calc: (A, B, C) => (A && !B) || C ? 1 : 0
  },
  drill2: {
    formula: "F = (A + B)' · C",
    vars: ["A", "B", "C"],
    calc: (A, B, C) => (!(A || B) && C) ? 1 : 0
  },
  drill3: {
    formula: "T₁ = A · B",
    vars: ["A", "B"],
    calc: (A, B) => (A && B) ? 1 : 0
  },
  drill4: {
    formula: "T₂ = C · D'",
    vars: ["C", "D"],
    calc: (C, D) => (C && !D) ? 1 : 0
  },
  drill5: {
    formula: "APPROVE = A · B · C · D'",
    vars: ["A", "B", "C", "D"],
    calc: (A, B, C, D) => (A && B && C && !D) ? 1 : 0
  }
};

let currentDrillState = [];

function loadTruthTableDrill() {
  const select = document.getElementById("tt-drill-select");
  if (!select) return;
  const drillKey = select.value;
  const spec = DRILL_SPECS[drillKey] || DRILL_SPECS.drill1;

  const formulaEl = document.getElementById("tt-drill-formula");
  if (formulaEl) formulaEl.textContent = spec.formula;

  const thead = document.getElementById("tt-drill-thead");
  const tbody = document.getElementById("tt-drill-tbody");
  if (!thead || !tbody) return;

  // Render headers
  let thHtml = `<tr><th style="text-align:center; width:60px;">Index</th>`;
  spec.vars.forEach(v => {
    thHtml += `<th style="text-align:center;">${v}</th>`;
  });
  thHtml += `<th style="text-align:center; color:var(--accent-cyan);">Your Output (Click to Toggle)</th>`;
  thHtml += `<th style="text-align:center;">Status</th></tr>`;
  thead.innerHTML = thHtml;

  // Generate truth table rows
  const numRows = Math.pow(2, spec.vars.length);
  currentDrillState = [];
  let tbHtml = "";

  for (let i = 0; i < numRows; i++) {
    const rowVals = [];
    for (let bit = spec.vars.length - 1; bit >= 0; bit--) {
      rowVals.push((i >> bit) & 1);
    }
    const correctVal = spec.calc(...rowVals);
    currentDrillState.push({
      index: i,
      inputs: rowVals,
      correct: correctVal,
      userVal: 0
    });

    tbHtml += `<tr id="tt-row-${i}">
      <td style="text-align:center; font-family:var(--font-mono); color:var(--text-muted);">m${i}</td>`;
    rowVals.forEach(val => {
      tbHtml += `<td style="text-align:center; font-family:var(--font-mono);">${val}</td>`;
    });
    tbHtml += `<td style="text-align:center;">
        <button id="tt-drill-btn-${i}" class="tt-drill-toggle-btn val-0" onclick="toggleDrillCell(${i})">0</button>
      </td>
      <td id="tt-status-${i}" style="text-align:center; font-size:0.8rem; color:var(--text-muted);">Pending</td>
    </tr>`;
  }
  tbody.innerHTML = tbHtml;

  const scoreBadge = document.getElementById("tt-drill-score-badge");
  if (scoreBadge) {
    scoreBadge.textContent = `Score: 0 / ${numRows} (0%)`;
    scoreBadge.className = "badge badge-accent";
  }
}

function toggleDrillCell(rowIdx) {
  if (!currentDrillState[rowIdx]) return;
  const current = currentDrillState[rowIdx].userVal;
  const next = current === 0 ? 1 : 0;
  currentDrillState[rowIdx].userVal = next;

  const btn = document.getElementById(`tt-drill-btn-${rowIdx}`);
  if (btn) {
    btn.textContent = next;
    btn.className = `tt-drill-toggle-btn val-${next}`;
  }
  // Clear any status on toggle
  const rowEl = document.getElementById(`tt-row-${rowIdx}`);
  if (rowEl) rowEl.className = "";
  const statusEl = document.getElementById(`tt-status-${rowIdx}`);
  if (statusEl) {
    statusEl.textContent = "Modified";
    statusEl.style.color = "var(--text-muted)";
  }
}

function checkTruthTableDrill() {
  let correctCount = 0;
  currentDrillState.forEach((item, idx) => {
    const isCorrect = item.userVal === item.correct;
    if (isCorrect) correctCount++;

    const rowEl = document.getElementById(`tt-row-${idx}`);
    const statusEl = document.getElementById(`tt-status-${idx}`);
    if (rowEl) rowEl.className = isCorrect ? "tt-row-correct" : "tt-row-error";
    if (statusEl) {
      statusEl.textContent = isCorrect ? "✓ Correct" : `✗ Should be ${item.correct}`;
      statusEl.style.color = isCorrect ? "#34d399" : "#f87171";
      statusEl.style.fontWeight = "700";
    }
  });

  const total = currentDrillState.length;
  const pct = Math.round((correctCount / total) * 100);
  const scoreBadge = document.getElementById("tt-drill-score-badge");
  if (scoreBadge) {
    scoreBadge.textContent = `Score: ${correctCount} / ${total} (${pct}%)`;
    scoreBadge.className = (pct === 100) ? "badge badge-success" : "badge badge-accent";
  }

  if (pct === 100 && typeof playSynthNote === "function") {
    playSynthNote(880, "triangle", 0.3); // High celebratory chime
  }
}

function revealTruthTableHints() {
  currentDrillState.forEach((item, idx) => {
    item.userVal = item.correct;
    const btn = document.getElementById(`tt-drill-btn-${idx}`);
    if (btn) {
      btn.textContent = item.correct;
      btn.className = `tt-drill-toggle-btn val-${item.correct}`;
    }
    const rowEl = document.getElementById(`tt-row-${idx}`);
    const statusEl = document.getElementById(`tt-status-${idx}`);
    if (rowEl) rowEl.className = "tt-row-correct";
    if (statusEl) {
      statusEl.textContent = "✓ Solved";
      statusEl.style.color = "#34d399";
    }
  });
  const scoreBadge = document.getElementById("tt-drill-score-badge");
  if (scoreBadge) {
    scoreBadge.textContent = `Score: ${currentDrillState.length} / ${currentDrillState.length} (100% Revealed)`;
    scoreBadge.className = "badge badge-success";
  }
}

function resetTruthTableDrill() {
  loadTruthTableDrill();
}

// Workbench 2: K-Map Grouping Trainer
const KMAP_CHALLENGES = {
  ch1: {
    title: "Challenge 1: 4-Corner Quad",
    prompt: "A 4-variable K-Map contains minterms at all 4 corners: m0, m2, m8, m10. What is the minimal simplified product term?",
    activeMinterms: [0, 2, 8, 10],
    correctTerm: "B' · D'",
    options: ["B' · D'", "A' · D'", "B · D", "A · C'"],
    explanation: "The 4 corners wrap around both horizontally and vertically. In rows 00 and 10, A changes while B=0 (B'). In cols 00 and 10, C changes while D=0 (D'). Hence, minimal term is B' · D'."
  },
  ch2: {
    title: "Challenge 2: Center 2x2 Quad",
    prompt: "The 4 center cells are active: m5, m7, m13, m15. What is the simplified expression?",
    activeMinterms: [5, 7, 13, 15],
    correctTerm: "B · D",
    options: ["B · D", "A · B", "C · D", "B' · D'"],
    explanation: "Rows are 01 and 11 (B=1 constant). Columns are 01 and 11 (D=1 constant). A and C eliminate, yielding B · D."
  },
  ch3: {
    title: "Challenge 3: Full 8-Cell Octet",
    prompt: "An entire horizontal half (Rows 11 and 10: m12, m13, m15, m14, m8, m9, m11, m10) is active. What is the single literal term?",
    activeMinterms: [12, 13, 15, 14, 8, 9, 11, 10],
    correctTerm: "A",
    options: ["A", "B", "C'", "D"],
    explanation: "An 8-cell octet in 4 variables eliminates 3 literals ($2^3=8$). Across rows 11 and 10, A=1 is constant while B, C, and D eliminate completely. The result is simply A."
  },
  ch4: {
    title: "Challenge 4: Horizontal Edge Pair",
    prompt: "Cells m14 and m15 are active. What is the minimal term for this 2-cell group?",
    activeMinterms: [14, 15],
    correctTerm: "A · B · C",
    options: ["A · B · C", "A · B", "B · C · D", "A · C · D'"],
    explanation: "In row 11, A=1 and B=1. In cols 11 and 10, C=1 while D changes ($1 \\to 0$), eliminating D. Minimal product term is A · B · C."
  },
  ch5: {
    title: "Challenge 5: Underwriting Isolated Minterm",
    prompt: "In our credit engine, APPROVE requires m14 only. Since no adjacent cells are 1, what is its algebraic form?",
    activeMinterms: [14],
    correctTerm: "A · B · C · D'",
    options: ["A · B · C · D'", "A · B · C", "T₁ · T₂", "A · C"],
    explanation: "An isolated 1-cell ($2^0=1$) cannot be grouped with any adjacent cells and retains all 4 literals: A=1, B=1, C=1, D=0 $\\implies$ A · B · C · D'."
  }
};

let currentKMapChallengeKey = "ch1";

function loadKMapChallenge() {
  const select = document.getElementById("kmap-trainer-select");
  if (!select) return;
  currentKMapChallengeKey = select.value;
  const spec = KMAP_CHALLENGES[currentKMapChallengeKey];

  const promptEl = document.getElementById("kmap-trainer-prompt");
  if (promptEl) promptEl.textContent = spec.prompt;

  // Render 4x4 Grid
  const gridWrapper = document.getElementById("kmap-trainer-grid-wrapper");
  if (gridWrapper) {
    const gray = ["00", "01", "11", "10"];
    let html = `<table class="kmap-trainer-table">
      <thead>
        <tr>
          <th style="font-size:0.75rem; color:var(--text-muted); padding:4px;">AB \\ CD</th>
          <th style="font-size:0.75rem; color:var(--accent-cyan); padding:4px;">00</th>
          <th style="font-size:0.75rem; color:var(--accent-cyan); padding:4px;">01</th>
          <th style="font-size:0.75rem; color:var(--accent-cyan); padding:4px;">11</th>
          <th style="font-size:0.75rem; color:var(--accent-cyan); padding:4px;">10</th>
        </tr>
      </thead>
      <tbody>`;

    for (let r = 0; r < 4; r++) {
      html += `<tr><th style="font-size:0.75rem; color:var(--accent-cyan); padding:4px;">${gray[r]}</th>`;
      for (let c = 0; c < 4; c++) {
        // Calculate minterm index
        const a = (r >> 1) & 1;
        const b = (r === 1 || r === 2) ? 1 : 0;
        const c_bit = (c >> 1) & 1;
        const d_bit = (c === 1 || c === 2) ? 1 : 0;
        const minterm = (a << 3) | (b << 2) | (c_bit << 1) | d_bit;
        const isActive = spec.activeMinterms.includes(minterm);

        html += `<td class="${isActive ? 'cell-active' : ''}">
          <div style="font-size:0.95rem; font-weight:800;">${isActive ? '1' : '0'}</div>
          <div style="font-size:0.65rem; color:var(--text-muted);">m${minterm}</div>
        </td>`;
      }
      html += `</tr>`;
    }
    html += `</tbody></table>`;
    gridWrapper.innerHTML = html;
  }

  // Render Option Buttons
  const optContainer = document.getElementById("kmap-trainer-options");
  if (optContainer) {
    let optHtml = "";
    spec.options.forEach((opt, idx) => {
      optHtml += `<button class="kmap-trainer-opt-btn" onclick="selectKMapChallengeOption('${opt.replace(/'/g, "\\'")}')">
        <span>Option ${String.fromCharCode(65 + idx)}: <strong>${opt}</strong></span>
        <span style="font-size:0.8rem; color:var(--text-muted);">Select →</span>
      </button>`;
    });
    optContainer.innerHTML = optHtml;
  }

  const feedbackBox = document.getElementById("kmap-trainer-feedback");
  if (feedbackBox) feedbackBox.style.display = "none";
}

function selectKMapChallengeOption(chosenTerm) {
  const spec = KMAP_CHALLENGES[currentKMapChallengeKey];
  const isCorrect = chosenTerm === spec.correctTerm;

  document.querySelectorAll(".kmap-trainer-opt-btn").forEach(btn => {
    btn.classList.remove("opt-correct", "opt-wrong");
    if (btn.textContent.includes(spec.correctTerm)) {
      btn.classList.add("opt-correct");
    } else if (btn.textContent.includes(chosenTerm) && !isCorrect) {
      btn.classList.add("opt-wrong");
    }
  });

  const feedbackBox = document.getElementById("kmap-trainer-feedback");
  if (feedbackBox) {
    feedbackBox.style.display = "block";
    feedbackBox.style.background = isCorrect ? "rgba(52, 211, 153, 0.15)" : "rgba(248, 113, 113, 0.15)";
    feedbackBox.style.border = isCorrect ? "1px solid #34d399" : "1px solid #f87171";
    feedbackBox.style.color = isCorrect ? "#34d399" : "#f87171";
    feedbackBox.innerHTML = `
      <div style="font-weight:700; font-size:0.95rem; margin-bottom:0.3rem;">
        ${isCorrect ? "✓ Correct! Outstanding Deduction" : "✗ Incorrect Option"}
      </div>
      <div style="color:var(--text-secondary); font-size:0.85rem; line-height:1.5;">
        ${spec.explanation}
      </div>
    `;
  }

  if (isCorrect && typeof playSynthNote === "function") {
    playSynthNote(784, "sine", 0.25);
  }
}

// Workbench 3: Equivalence Sandbox
const EQUIV_PRESETS = {
  absorption: {
    e1: "A + A · B",
    e2: "A"
  },
  demorgan: {
    e1: "(A · B)'",
    e2: "A' + B'"
  },
  consensus: {
    e1: "A · B + A' · C + B · C",
    e2: "A · B + A' · C"
  },
  underwrite: {
    e1: "(A · B) · (C · D')",
    e2: "A · B · C · D'"
  }
};

function loadEquivPreset(name) {
  const p = EQUIV_PRESETS[name];
  if (!p) return;
  const in1 = document.getElementById("equiv-expr1");
  const in2 = document.getElementById("equiv-expr2");
  if (in1) in1.value = p.e1;
  if (in2) in2.value = p.e2;
  runEquivalenceCheck();
}

async function runEquivalenceCheck() {
  const in1 = document.getElementById("equiv-expr1");
  const in2 = document.getElementById("equiv-expr2");
  const reportBox = document.getElementById("equiv-report-box");
  if (!in1 || !in2 || !reportBox) return;

  const expr1 = in1.value.trim();
  const expr2 = in2.value.trim();

  reportBox.innerHTML = `
    <div style="text-align:center; color:var(--text-muted); font-size:0.85rem;">
      <span class="spinner" style="display:inline-block; margin-right:6px;"></span>
      Calling SymPy logic engine...
    </div>`;

  try {
    const res = await fetch("/api/verify-expression", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expr1, expr2 })
    });
    const data = await res.json();

    if (!data.success) {
      reportBox.innerHTML = `
        <div style="color:#f87171; font-weight:700; margin-bottom:0.5rem;">✗ Syntax or Evaluation Error</div>
        <div style="font-family:var(--font-mono); font-size:0.82rem; color:var(--text-secondary);">${data.error}</div>
      `;
      return;
    }

    const isEq = data.equivalent;
    reportBox.innerHTML = `
      <div style="text-align:center; margin-bottom:0.75rem;">
        <span class="badge ${isEq ? 'badge-success' : 'badge-danger'}" style="font-size:0.9rem; padding:0.4rem 1rem;">
          ${isEq ? '✓ FORMALLY EQUIVALENT' : '✗ NOT EQUIVALENT'}
        </span>
      </div>
      <div style="font-size:0.82rem; color:var(--text-secondary); line-height:1.7;">
        <div><strong>Expression 1 (SymPy):</strong> <code>${data.expr1_normalized}</code> &rarr; <code>${data.expr1_simplified}</code></div>
        <div><strong>Expression 2 (SymPy):</strong> <code>${data.expr2_normalized}</code> &rarr; <code>${data.expr2_simplified}</code></div>
      </div>
      <div style="margin-top:0.75rem; font-size:0.8rem; color:${isEq ? '#34d399' : '#f87171'}; font-weight:700;">
        ${data.message}
      </div>
    `;

    if (isEq && typeof playSynthNote === "function") {
      playSynthNote(659, "triangle", 0.2);
    }
  } catch (err) {
    reportBox.innerHTML = `<div style="color:#f87171;">Failed to connect to backend: ${err.message}</div>`;
  }
}

// Workbench 4: Logic Gate Puzzle
const GATE_SPECS = {
  xor: {
    target: [0, 1, 1, 0],
    correctGate: "XOR"
  },
  nand: {
    target: [1, 1, 1, 0],
    correctGate: "NAND"
  },
  nor: {
    target: [1, 0, 0, 0],
    correctGate: "NOR"
  },
  xnor: {
    target: [1, 0, 0, 1],
    correctGate: "XNOR"
  }
};

let currentPuzzleKey = "xor";

function loadGatePuzzle() {
  const select = document.getElementById("gate-puzzle-select");
  if (!select) return;
  currentPuzzleKey = select.value;
  const spec = GATE_SPECS[currentPuzzleKey];

  const tbody = document.getElementById("gate-puzzle-tbody");
  if (!tbody) return;

  const rows = [
    { x: 0, y: 0, out: spec.target[0] },
    { x: 0, y: 1, out: spec.target[1] },
    { x: 1, y: 0, out: spec.target[2] },
    { x: 1, y: 1, out: spec.target[3] }
  ];

  let html = "";
  rows.forEach((r, idx) => {
    html += `<tr>
      <td style="text-align:center; font-family:var(--font-mono);">${r.x}</td>
      <td style="text-align:center; font-family:var(--font-mono);">${r.y}</td>
      <td style="text-align:center; font-family:var(--font-mono); font-weight:700; color:var(--accent-cyan);">${r.out}</td>
      <td id="puzzle-out-${idx}" style="text-align:center; font-family:var(--font-mono); color:var(--text-muted);">-</td>
    </tr>`;
  });
  tbody.innerHTML = html;

  const statusEl = document.getElementById("gate-puzzle-status");
  if (statusEl) {
    statusEl.textContent = "Select a gate above to test the hardware circuit.";
    statusEl.style.color = "var(--text-muted)";
  }
}

function pickPuzzleGate(gateName) {
  const spec = GATE_SPECS[currentPuzzleKey];
  const evalGate = (x, y) => {
    if (gateName === "AND") return (x && y) ? 1 : 0;
    if (gateName === "OR") return (x || y) ? 1 : 0;
    if (gateName === "NAND") return (!(x && y)) ? 1 : 0;
    if (gateName === "NOR") return (!(x || y)) ? 1 : 0;
    if (gateName === "XOR") return (x !== y) ? 1 : 0;
    if (gateName === "XNOR") return (x === y) ? 1 : 0;
    return 0;
  };

  const rows = [[0, 0], [0, 1], [1, 0], [1, 1]];
  let allMatch = true;

  rows.forEach(([x, y], idx) => {
    const calculated = evalGate(x, y);
    const target = spec.target[idx];
    const cell = document.getElementById(`puzzle-out-${idx}`);
    if (cell) {
      cell.textContent = calculated;
      cell.style.fontWeight = "800";
      cell.style.color = (calculated === target) ? "#34d399" : "#f87171";
    }
    if (calculated !== target) allMatch = false;
  });

  const statusEl = document.getElementById("gate-puzzle-status");
  if (statusEl) {
    if (allMatch) {
      statusEl.innerHTML = `✓ <strong>Match Confirmed!</strong> ${gateName} gate satisfies the target truth table.`;
      statusEl.style.color = "#34d399";
      statusEl.style.borderColor = "#34d399";
      if (typeof playSynthNote === "function") playSynthNote(700, "triangle", 0.25);
    } else {
      statusEl.innerHTML = `✗ <strong>Mismatch:</strong> ${gateName} output differs from target. Try another gate.`;
      statusEl.style.color = "#f87171";
      statusEl.style.borderColor = "#f87171";
    }
  }
}

/* ==========================================================================
   9.0 TEST CENTER / FORMAL EXAMINATION CONTROLLER
   ========================================================================== */

const EXAM_QUESTION_BANK = [
  {
    id: 1,
    co: "CO1",
    category: "Boolean Algebra Axioms",
    text: "According to Huntington's postulates, which of the following expressions illustrates the Absorption Law?",
    options: [
      "A + A · B = A",
      "A + A' = 1",
      "(A · B)' = A' + B'",
      "A · 1 = A"
    ],
    correct: 0,
    solution: "The Absorption Law states that A + A · B = A (or A · (A + B) = A), where the smaller term absorbs the larger conjunction."
  },
  {
    id: 2,
    co: "CO1",
    category: "Boolean Algebra Axioms",
    text: "What is the result of evaluating the involution property (A')' on any binary signal A?",
    options: [
      "0",
      "1",
      "A",
      "A'"
    ],
    correct: 2,
    solution: "By the Involution property (double negation), complementing a signal twice returns the original signal: (A')' = A."
  },
  {
    id: 3,
    co: "CO1",
    category: "De Morgan's Theorems",
    text: "According to De Morgan's first theorem, the hardware complement of an AND gate (NAND) is logically equivalent to which gate?",
    options: [
      "A standard OR gate",
      "An Inverted-Input (Bubbled) OR gate",
      "A NOR gate",
      "An XOR gate"
    ],
    correct: 1,
    solution: "(A · B)' = A' + B'. This means a NAND gate is logically identical to an OR gate with active-low inverted inputs (Bubbled OR)."
  },
  {
    id: 4,
    co: "CO2",
    category: "Canonical Minterm Expansion",
    text: "In a 4-variable system with inputs A, B, C, D, which decimal minterm corresponds to the product term A · B · C · D'?",
    options: [
      "m15",
      "m14",
      "m12",
      "m7"
    ],
    correct: 1,
    solution: "A=1, B=1, C=1, D=0 corresponds to binary 1110. In decimal, 1110₂ = 8 + 4 + 2 + 0 = 14, which is minterm m14."
  },
  {
    id: 5,
    co: "CO2",
    category: "Truth Table Expansion",
    text: "How many total state combinations exist in the complete truth table for a system with 5 Boolean variables (A, B, C, D, E)?",
    options: [
      "16 states",
      "25 states",
      "32 states",
      "64 states"
    ],
    correct: 2,
    solution: "The total number of input combinations for n binary variables is 2ⁿ. For n = 5, 2⁵ = 32 exhaustive states."
  },
  {
    id: 6,
    co: "CO3",
    category: "K-Map Geometry",
    text: "Why are row and column headers in a Karnaugh map sequenced in Gray code (00, 01, 11, 10) instead of natural binary (00, 01, 10, 11)?",
    options: [
      "To save silicon area during layout",
      "To ensure adjacent physical cells differ by exactly 1 bit",
      "To invert high-frequency switching noise",
      "Because TTL gates only read Gray code"
    ],
    correct: 1,
    solution: "Gray code guarantees unit Hamming distance (1 bit change between neighbors), which allows algebraic factoring: A·B + A·B' = A(B + B') = A."
  },
  {
    id: 7,
    co: "CO3",
    category: "K-Map Minimization",
    text: "In a 4-variable K-Map, grouping the 4 corner cells (m0, m2, m8, m10) eliminates two variables, resulting in which minimal product term?",
    options: [
      "B' · D'",
      "A' · C'",
      "B · D",
      "A · D'"
    ],
    correct: 0,
    solution: "Rows are 00 and 10 (B=0 is constant, A changes). Columns are 00 and 10 (D=0 is constant, C changes). The resulting term is B' · D'."
  },
  {
    id: 8,
    co: "CO3",
    category: "K-Map Subcube Sizing",
    text: "How many literals are eliminated from the product term when an 8-cell group (octet) is formed in a 4-variable K-Map?",
    options: [
      "1 literal",
      "2 literals",
      "3 literals",
      "4 literals"
    ],
    correct: 2,
    solution: "A group of size 2ᵏ eliminates k variables. For an octet, size = 8 = 2³, meaning 3 literals are eliminated, leaving a single literal term."
  },
  {
    id: 9,
    co: "CO4",
    category: "TTL Hardware Implementation",
    text: "A 4-input AND operation (APPROVE = A · B · C · D') is implemented using standard 2-input 74LS08 AND gates. How many 2-input AND gates are required?",
    options: [
      "2 gates",
      "3 gates",
      "4 gates",
      "5 gates"
    ],
    correct: 1,
    solution: "A binary tree for 4 inputs requires (N - 1) 2-input gates: T₁ = A·B (Gate 1), T₂ = C·D' (Gate 2), and APPROVE = T₁·T₂ (Gate 3). Total = 3 gates."
  },
  {
    id: 10,
    co: "CO4",
    category: "Circuit Timing Analysis",
    text: "If each 74LS08 2-input AND gate has an average propagation delay (t_pd) of 9 ns, what is the total propagation delay through the 2-stage cascaded AND tree?",
    options: [
      "9 ns",
      "18 ns",
      "27 ns",
      "36 ns"
    ],
    correct: 1,
    solution: "The tree has 2 cascaded stages (Stage 1 parallel gates take 9 ns, then Stage 2 takes 9 ns). Total path delay = 9 ns + 9 ns = 18 ns."
  },
  {
    id: 11,
    co: "CO4",
    category: "Mutual Exclusivity Theorem",
    text: "In the loan underwriting engine, what is the value of the Boolean product APPROVE · REJECT across all 32 valid states?",
    options: [
      "Always 1",
      "Always 0 (Strictly mutually exclusive)",
      "1 only during manual review",
      "Depends on collateral value"
    ],
    correct: 1,
    solution: "APPROVE requires D'=1 and A·B=1, whereas REJECT requires D=1 or A'·B'=1. Their conjunction yields 0 across all states (Mutual Exclusivity Theorem)."
  },
  {
    id: 12,
    co: "CO2",
    category: "Canonical Maxterm Notation",
    text: "If a function F has canonical minterms Σ m(14), what is its representation in canonical maxterm (POS) notation?",
    options: [
      "Π M(14)",
      "Π M(all indices except 14: 0,1,2,...,13,15)",
      "Σ M(14)",
      "1 - m14"
    ],
    correct: 1,
    solution: "By canonical duality, the maxterms are the product of all indices where the function is 0 (all indices except minterm 14)."
  },
  {
    id: 13,
    co: "CO1",
    category: "Consensus Theorem",
    text: "Which term is redundant and can be eliminated from A·B + A'·C + B·C according to the Boolean Consensus Theorem?",
    options: [
      "A · B",
      "A' · C",
      "B · C (the consensus term)",
      "None of them"
    ],
    correct: 2,
    solution: "The Consensus Theorem states that A·B + A'·C + B·C = A·B + A'·C. The term B·C is the consensus of the other two and is redundant."
  },
  {
    id: 14,
    co: "CO4",
    category: "Universal Logic Gates",
    text: "Why are NAND and NOR gates classified as 'Universal Logic Gates' in digital electronics?",
    options: [
      "They consume zero dynamic power",
      "Any Boolean switching function can be realized using only NAND or only NOR gates",
      "They operate at infinite frequency",
      "They accept unlimited fan-in"
    ],
    correct: 1,
    solution: "NAND and NOR can independently synthesize the three fundamental operations (NOT, AND, OR), so any combinational circuit can be built exclusively from them."
  },
  {
    id: 15,
    co: "CO4",
    category: "Fault Injection & Boundary Analysis",
    text: "In the underwriting validation layer, what occurs when an applicant submits an age of 17 (below legal majority threshold 18)?",
    options: [
      "Loan is automatically approved",
      "A ValidationError (HTTP 400) is triggered because age must be ≥ 18",
      "The engine sets variable E=1",
      "Credit score is multiplied by 2"
    ],
    correct: 1,
    solution: "Boundary condition 15 and fault test cases verify that applicant age < 18 violates legal contract requirements, raising a structured ValidationError (HTTP 400)."
  }
];

let examState = {
  active: false,
  totalQuestions: 15,
  timeMinutes: 15,
  title: "Comprehensive Lab Exam",
  currentQIndex: 0,
  questions: [],
  userAnswers: {},
  flaggedQuestions: {},
  timerSecondsRemaining: 900,
  timerInterval: null,
  studentName: "Student Scholar"
};

function initTestCenter() {
  selectTestMode(5, 5, "Quick Quiz");
}

function selectTestMode(qCount, timeMinutes, title) {
  examState.totalQuestions = qCount;
  examState.timeMinutes = timeMinutes;
  examState.title = title;

  document.querySelectorAll(".test-tier-card").forEach(c => {
    c.classList.remove("active");
    if (c.textContent.includes(`${qCount} Qs`)) {
      c.classList.add("active");
    }
  });
}

function startExamination() {
  const nameInput = document.getElementById("student-name-input");
  examState.studentName = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : "Student Scholar";

  // Select questions for this mode
  examState.questions = EXAM_QUESTION_BANK.slice(0, examState.totalQuestions);
  examState.userAnswers = {};
  examState.flaggedQuestions = {};
  examState.currentQIndex = 0;
  examState.timerSecondsRemaining = examState.timeMinutes * 60;
  examState.active = true;

  // Switch UI views
  const startCard = document.getElementById("test-start-card");
  const activeView = document.getElementById("test-active-view");
  const resultsView = document.getElementById("test-results-view");
  if (startCard) startCard.style.display = "none";
  if (resultsView) resultsView.style.display = "none";
  if (activeView) activeView.style.display = "block";

  const titleEl = document.getElementById("test-active-title");
  if (titleEl) titleEl.textContent = examState.title;

  buildQuestionPalette();
  renderTestQuestion(0);
  startExamTimer();
}

function buildQuestionPalette() {
  const palette = document.getElementById("test-palette-grid");
  if (!palette) return;

  let html = "";
  examState.questions.forEach((q, idx) => {
    html += `<button id="pal-btn-${idx}" class="pal-btn pal-unanswered" onclick="jumpToTestQuestion(${idx})">
      ${idx + 1}
    </button>`;
  });
  palette.innerHTML = html;
}

function updatePaletteState() {
  examState.questions.forEach((q, idx) => {
    const btn = document.getElementById(`pal-btn-${idx}`);
    if (!btn) return;

    btn.className = "pal-btn";
    if (idx === examState.currentQIndex) {
      btn.classList.add("pal-active");
    }
    if (examState.flaggedQuestions[idx]) {
      btn.classList.add("pal-flagged");
    } else if (examState.userAnswers[idx] !== undefined) {
      btn.classList.add("pal-answered");
    } else {
      btn.classList.add("pal-unanswered");
    }
  });
}

function renderTestQuestion(idx) {
  examState.currentQIndex = idx;
  const q = examState.questions[idx];
  if (!q) return;

  const counterEl = document.getElementById("test-question-counter");
  if (counterEl) counterEl.textContent = `Question ${idx + 1} of ${examState.questions.length}`;

  const categoryEl = document.getElementById("test-q-category");
  if (categoryEl) categoryEl.textContent = `${q.co} • ${q.category}`;

  const statusEl = document.getElementById("test-q-status");
  if (statusEl) {
    statusEl.textContent = (examState.userAnswers[idx] !== undefined)
      ? `Selected: Option ${String.fromCharCode(65 + examState.userAnswers[idx])}`
      : "Not Answered Yet";
    statusEl.style.color = (examState.userAnswers[idx] !== undefined) ? "#34d399" : "var(--text-muted)";
  }

  const qTextEl = document.getElementById("test-q-text");
  if (qTextEl) qTextEl.textContent = `${idx + 1}. ${q.text}`;

  const flagBtn = document.getElementById("test-flag-btn");
  if (flagBtn) {
    const isFlagged = Boolean(examState.flaggedQuestions[idx]);
    flagBtn.textContent = isFlagged ? "🏳️ Remove Flag" : "🚩 Flag for Review";
    flagBtn.classList.toggle("btn-primary", isFlagged);
  }

  // Render options
  const optContainer = document.getElementById("test-q-options");
  if (optContainer) {
    let optHtml = "";
    q.options.forEach((optText, optIdx) => {
      const isSelected = examState.userAnswers[idx] === optIdx;
      optHtml += `
        <label class="test-opt-label ${isSelected ? 'selected' : ''}" onclick="selectTestAnswer(${optIdx})">
          <input type="radio" name="q-option" class="test-opt-radio" ${isSelected ? 'checked' : ''}>
          <span style="font-weight:700; color:var(--accent-cyan); font-family:var(--font-mono);">${String.fromCharCode(65 + optIdx)}</span>
          <span style="flex:1;">${optText}</span>
        </label>
      `;
    });
    optContainer.innerHTML = optHtml;
  }

  // Prev / Next button states
  const prevBtn = document.getElementById("test-prev-btn");
  const nextBtn = document.getElementById("test-next-btn");
  if (prevBtn) prevBtn.disabled = (idx === 0);
  if (nextBtn) nextBtn.disabled = (idx === examState.questions.length - 1);

  updatePaletteState();
}

function selectTestAnswer(optIdx) {
  examState.userAnswers[examState.currentQIndex] = optIdx;
  renderTestQuestion(examState.currentQIndex);
}

function toggleFlagCurrentQuestion() {
  const cur = examState.currentQIndex;
  examState.flaggedQuestions[cur] = !examState.flaggedQuestions[cur];
  renderTestQuestion(cur);
}

function navigateTestQuestion(delta) {
  const nextIdx = examState.currentQIndex + delta;
  if (nextIdx >= 0 && nextIdx < examState.questions.length) {
    renderTestQuestion(nextIdx);
  }
}

function jumpToTestQuestion(idx) {
  if (idx >= 0 && idx < examState.questions.length) {
    renderTestQuestion(idx);
  }
}

function startExamTimer() {
  clearInterval(examState.timerInterval);
  updateTimerDisplay();

  examState.timerInterval = setInterval(() => {
    examState.timerSecondsRemaining--;
    updateTimerDisplay();

    if (examState.timerSecondsRemaining <= 0) {
      clearInterval(examState.timerInterval);
      alert("Exam time has expired! Automatically submitting your answers.");
      evaluateAndShowResults();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const timerEl = document.getElementById("test-countdown");
  if (!timerEl) return;
  const m = Math.floor(examState.timerSecondsRemaining / 60);
  const s = examState.timerSecondsRemaining % 60;
  const mm = m < 10 ? `0${m}` : m;
  const ss = s < 10 ? `0${s}` : s;
  timerEl.textContent = `${mm}:${ss}`;

  if (examState.timerSecondsRemaining < 120) {
    timerEl.style.color = "#f87171";
    timerEl.style.borderColor = "#f87171";
  } else {
    timerEl.style.color = "var(--accent-cyan)";
    timerEl.style.borderColor = "var(--border-subtle)";
  }
}

function submitExaminationPrompt() {
  const answeredCount = Object.keys(examState.userAnswers).length;
  const total = examState.questions.length;
  const unans = total - answeredCount;

  const msg = unans > 0
    ? `You have ${unans} unanswered question(s). Are you sure you wish to submit the examination?`
    : `Are you ready to submit your examination for formal scoring?`;

  if (confirm(msg)) {
    clearInterval(examState.timerInterval);
    evaluateAndShowResults();
  }
}

function evaluateAndShowResults() {
  examState.active = false;
  clearInterval(examState.timerInterval);

  let rawScore = 0;
  const total = examState.questions.length;
  const coStats = {
    CO1: { correct: 0, total: 0, title: "Problem Abstraction & Axioms" },
    CO2: { correct: 0, total: 0, title: "Truth Tables & Canonical Forms" },
    CO3: { correct: 0, total: 0, title: "K-Map Subcube Minimization" },
    CO4: { correct: 0, total: 0, title: "Logic Synthesis & Verification" }
  };

  examState.questions.forEach((q, idx) => {
    const studentChoice = examState.userAnswers[idx];
    const isCorrect = (studentChoice === q.correct);
    if (isCorrect) rawScore++;

    if (coStats[q.co]) {
      coStats[q.co].total++;
      if (isCorrect) coStats[q.co].correct++;
    }
  });

  const percentage = Math.round((rawScore / total) * 100);
  let tier = "Re-evaluation Recommended";
  let tierColor = "#f87171";
  if (percentage >= 85) {
    tier = "Distinction (First Class with Distinction)";
    tierColor = "#34d399";
  } else if (percentage >= 70) {
    tier = "First Class (Proficient)";
    tierColor = "#38bdf8";
  } else if (percentage >= 50) {
    tier = "Second Class (Pass)";
    tierColor = "#fbbf24";
  }

  // Calculate elapsed time
  const totalSecs = examState.timeMinutes * 60;
  const elapsedSecs = Math.max(0, totalSecs - examState.timerSecondsRemaining);
  const elM = Math.floor(elapsedSecs / 60);
  const elS = elapsedSecs % 60;
  const timeStr = `${elM < 10 ? '0' : ''}${elM}:${elS < 10 ? '0' : ''}${elS}`;

  // Switch UI to results view
  const activeView = document.getElementById("test-active-view");
  const resultsView = document.getElementById("test-results-view");
  if (activeView) activeView.style.display = "none";
  if (resultsView) resultsView.style.display = "block";

  // Populate Metric Cards
  const resScore = document.getElementById("test-res-score");
  const resPct = document.getElementById("test-res-percentage");
  const resTier = document.getElementById("test-res-tier");
  const resTime = document.getElementById("test-res-time");

  if (resScore) resScore.textContent = `${rawScore} / ${total}`;
  if (resPct) resPct.textContent = `${percentage}%`;
  if (resTier) {
    resTier.textContent = tier.split(" ")[0];
    resTier.style.color = tierColor;
  }
  if (resTime) resTime.textContent = timeStr;

  // Populate CO Mastery Bars
  const coBarsContainer = document.getElementById("test-co-bars");
  if (coBarsContainer) {
    let coHtml = "";
    for (const [coKey, coData] of Object.entries(coStats)) {
      const coPct = coData.total > 0 ? Math.round((coData.correct / coData.total) * 100) : 100;
      coHtml += `
        <div style="background:#070d19; padding:0.85rem; border-radius:var(--radius-xs); border:1px solid var(--border-subtle);">
          <div style="display:flex; justify-content:space-between; font-size:0.75rem; font-weight:700; color:#fff; margin-bottom:0.3rem;">
            <span>${coKey}</span>
            <span style="color:var(--accent-cyan); font-family:var(--font-mono);">${coPct}%</span>
          </div>
          <div style="font-size:0.68rem; color:var(--text-muted); margin-bottom:0.5rem;">${coData.title}</div>
          <div style="height:6px; background:#1e293b; border-radius:3px; overflow:hidden;">
            <div style="width:${coPct}%; height:100%; background:var(--accent-cyan); border-radius:3px;"></div>
          </div>
          <div style="font-size:0.68rem; color:var(--text-muted); margin-top:0.35rem; text-align:right;">
            ${coData.correct} / ${coData.total} items
          </div>
        </div>
      `;
    }
    coBarsContainer.innerHTML = coHtml;
  }

  // Populate Printable Certificate
  const certName = document.getElementById("cert-student-name");
  const certScore = document.getElementById("cert-score-disp");
  const certHash = document.getElementById("cert-hash");
  if (certName) certName.textContent = examState.studentName;
  if (certScore) certScore.textContent = `${percentage}% (${tier.split(" ")[0]})`;
  if (certHash) {
    const randomHash = Math.random().toString(36).substring(2, 6).toUpperCase();
    certHash.textContent = `EC-2026-${randomHash}`;
  }

  // Populate Detailed Solution Review
  const reviewList = document.getElementById("test-review-list");
  if (reviewList) {
    let revHtml = "";
    examState.questions.forEach((q, idx) => {
      const studentChoice = examState.userAnswers[idx];
      const isCorrect = (studentChoice === q.correct);
      const studentChoiceText = studentChoice !== undefined ? q.options[studentChoice] : "No Answer";

      revHtml += `
        <div style="background:#070d19; border-left:3px solid ${isCorrect ? '#34d399' : '#f87171'}; padding:1rem 1.25rem; border-radius:var(--radius-xs); border:1px solid var(--border-subtle); border-left-width:4px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
            <span style="font-weight:700; color:#fff; font-size:0.9rem;">
              Question ${idx + 1}: ${q.category} (${q.co})
            </span>
            <span class="badge ${isCorrect ? 'badge-success' : 'badge-danger'}">
              ${isCorrect ? '✓ Correct (+1 Mark)' : '✗ Incorrect (0 Marks)'}
            </span>
          </div>

          <div style="font-size:0.85rem; color:#e2e8f0; margin-bottom:0.6rem; line-height:1.5;">
            ${q.text}
          </div>

          <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:0.4rem;">
            <div>Your Answer: <strong style="color:${isCorrect ? '#34d399' : '#f87171'}">${studentChoiceText}</strong></div>
            <div>Correct Answer: <strong style="color:#34d399;">Option ${String.fromCharCode(65 + q.correct)}: ${q.options[q.correct]}</strong></div>
          </div>

          <div style="font-size:0.78rem; color:var(--text-muted); background:#0b1222; padding:0.5rem 0.75rem; border-radius:var(--radius-xs); margin-top:0.5rem; line-height:1.5;">
            <strong style="color:var(--accent-cyan);">Pedagogical Derivation:</strong> ${q.solution}
          </div>
        </div>
      `;
    });
    reviewList.innerHTML = revHtml;
  }
}

function resetExamination() {
  const startCard = document.getElementById("test-start-card");
  const activeView = document.getElementById("test-active-view");
  const resultsView = document.getElementById("test-results-view");
  if (startCard) startCard.style.display = "block";
  if (activeView) activeView.style.display = "none";
  if (resultsView) resultsView.style.display = "none";
}


