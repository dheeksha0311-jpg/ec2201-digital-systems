# Design and Verification of an AI Rule Engine using Boolean Logic for Automated Credit Risk Assessment
**Course:** EC2201 — Digital Systems  
**Project Title:** AI Rule Engine using Boolean Logic (Smart Loan Eligibility & Risk Advisor)  
**Academic Term:** 2026  

---

## Executive Summary
This project demonstrates the design, algebraic minimization, formal verification, and web-based deployment of a combinational digital logic rule engine integrated with an explainable AI confidence scoring framework. Modeled after commercial loan eligibility and risk assessment systems, the solution decouples rigid binary digital logic constraints (Layer 1) from soft, explainable confidence metrics (Layer 2). Using 5 Boolean variables ($A$ through $E$), a complete $2^5 = 32$-state truth table was generated programmatically. Minimal Sum-of-Products (SOP) expressions were derived via Quine-McCluskey / SymPy optimization and formally verified across all 32 combinations with zero logic errors. The system is delivered as a production-grade, interactive web platform featuring real-time logic tracing, Karnaugh mapping, and an automated 15-case test suite.

---

## 1. Problem Formulation & System Mapping

Commercial banking systems process high volumes of loan applications. A critical challenge is ensuring that initial qualification decisions remain **deterministic, legally defensible, and audit-compliant**, while providing nuanced risk ranking.

Digital combinational logic maps directly onto this domain:
- Real-world applicant metrics (income, credit score, age, default history, collateral) are abstracted into discrete binary signals ($0$ or $1$).
- Decisions are partitioned into three mutually exclusive digital outcomes:
  1. **APPROVE (1)**: Automated instant loan qualification.
  2. **REJECT (1)**: Automated disqualification based on non-negotiable risk indicators.
  3. **REVIEW (1)**: Underwriting review required for borderline profiles.

```
┌───────────────────────────────────────────────────────────┐
│              Layer 2: Explainable AI / Data Layer         │
│  - Soft scoring (0–100%) via continuous financial metrics │
│  - Evaluates Variable E (Collateral) for risk mitigation  │
│  - Risk Tier categorization (Low, Moderate, High)         │
│  - Generates transparent, human-auditable reasoning       │
└─────────────────────────────▲─────────────────────────────┘
                              │
               Consumes deterministic decision
                              │
┌─────────────────────────────┴─────────────────────────────┐
│          Layer 1: Core Digital Combinational Engine       │
│  - Pure Boolean logic over variables A, B, C, D           │
│  - 32-state truth table mapping (2^5 minterms)            │
│  - Minimal SOP form formally verified with zero errors    │
│  - Mutual exclusivity guaranteed: APPROVE · REJECT = 0    │
└───────────────────────────────────────────────────────────┘
```

---

## 2. Boolean Variable Definitions

| Variable | Semantic Meaning | Logic 1 Condition | Logic 0 Condition | Digital Role |
|:---:|:---|:---|:---|:---|
| **A** | Income Sufficiency | Monthly Income $\ge$ ₹40,000 | Income $<$ ₹40,000 | Primary financial threshold gate |
| **B** | Credit Score Quality | CIBIL Score $\ge$ 700 | CIBIL Score $<$ 700 | Creditworthiness benchmark |
| **C** | Age Bracket Eligibility | $21 \le \text{Age} \le 58$ | $\text{Age} < 21$ OR $\text{Age} > 58$ | Window comparator (inclusive) |
| **D** | Existing Loan Default | Active unpaid default present | Clean repayment record | Critical risk inhibitor |
| **E** | Collateral Asset Pledged | Tangible asset pledged | Unsecured loan request | Soft signal reserved for Layer 2 |

---

## 3. Combinational Logic Design & Simplification

### 3.1 Initial Combinational Equations
From domain requirements:
$$\text{APPROVE} = A \cdot B \cdot C \cdot \overline{D}$$
$$\text{REJECT} = D + (\overline{A} \cdot \overline{B})$$
$$\text{REVIEW} = \overline{\text{APPROVE} + \text{REJECT}}$$

### 3.2 Proof of Mutual Exclusivity
To verify that the system can never assert both $\text{APPROVE}$ and $\text{REJECT}$ simultaneously:
$$\text{APPROVE} \cdot \text{REJECT} = (A \cdot B \cdot C \cdot \overline{D}) \cdot (D + \overline{A} \cdot \overline{B})$$
Distributing terms:
$$= (A \cdot B \cdot C \cdot \overline{D} \cdot D) + (A \cdot B \cdot C \cdot \overline{D} \cdot \overline{A} \cdot \overline{B})$$
Applying the Boolean complement law ($X \cdot \overline{X} = 0$):
$$\overline{D} \cdot D = 0 \quad \text{and} \quad A \cdot \overline{A} = 0$$
$$\text{APPROVE} \cdot \text{REJECT} = 0 + 0 = 0 \quad \text{(Identically Zero)}$$
Since $\text{REVIEW} = \overline{\text{APPROVE} + \text{REJECT}}$, exactly one output is asserted high ($1$) for any possible input combination.

### 3.3 Karnaugh Map (K-Map) Reduction
The core digital logic operates on the 4 primary variables $A, B, C, D$, while $E$ acts as a don't-care in Layer 1.

#### K-Map for $\text{APPROVE}$:
Rows represent $AB \in \{00, 01, 11, 10\}$; columns represent $CD \in \{00, 01, 11, 10\}$:
- Only cell $(AB=11, CD=10)$ produces $1$.
- Minimal SOP:
$$\text{APPROVE} = A \cdot B \cdot C \cdot \overline{D}$$

#### K-Map for $\text{REJECT}$:
- All cells with $D=1$ (columns $01$ and $11$) are $1$.
- Row $AB=00$ (where both $A=0$ and $B=0$) is $1$ across all columns.
- Minimal SOP:
$$\text{REJECT} = D + \overline{A} \cdot \overline{B}$$

#### Minimal SOP for $\text{REVIEW}$:
Computed via SymPy:
$$\text{REVIEW} = (A \cdot \overline{B} \cdot \overline{D}) + (\overline{A} \cdot B \cdot \overline{D}) + (B \cdot \overline{C} \cdot \overline{D})$$

### 3.4 Formal Truth Table Verification
The minimal SOP expressions were programmatically evaluated against all 32 rows of `data/truth_table.csv`:
```
✅ Formal Verification PASSED: All 32 truth table combinations match simplified SOP with 0 errors!
```

---

## 4. Layer 2: Explainable AI & Indian Rupee (₹) Financial Risk Scoring

The AI layer computes a bounded confidence rating $S \in [0, 100]\%$ operating strictly within the Indian Rupee (₹) banking framework:
$$S = \text{clamp}\left(0, 100, S_{\text{base}} + \Delta_{\text{income}} + \Delta_{\text{credit}} + \Delta_{\text{collateral}}\right)$$

Where:
- **Base Score ($S_{\text{base}}$):**
  - $\text{APPROVE} \to 70\%$
  - $\text{REVIEW} \to 50\%$
  - $\text{REJECT} \to 25\%$
- **Continuous Income Buffer ($\Delta_{\text{income}}$):**
  $$\Delta_{\text{income}} = \min\left(15\%, \frac{\text{Income} - 40000}{4000}\right) \quad \text{for } \text{Income} > ₹40,000$$
- **Continuous Credit Margin ($\Delta_{\text{credit}}$):**
  $$\Delta_{\text{credit}} = \min\left(10\%, \frac{\text{Credit Score} - 700}{20}\right) \quad \text{for } \text{Score} > 700$$
- **Collateral & Loan-to-Value (LTV) Soft Signal ($\Delta_{\text{collateral}}$):**
  $$\text{LTV} = \left(\frac{\text{Loan Amount (₹)}}{\text{Collateral Valuation (₹)}}\right) \times 100\%$$
  - If $\text{LTV} \le 75\%$ (RBI guideline): $\Delta_{\text{collateral}} = +10\%$
  - If $\text{LTV} > 75\%$ : $\Delta_{\text{collateral}} = +5\%$ (Elevated LTV exposure)
  - Unsecured facility ($E = 0$): $\Delta_{\text{collateral}} = 0\%$

### 4.1 Next-Level Interactive Karnaugh Map Studio
The software embeds a dynamic 4-variable ($AB \times CD$) Karnaugh Map interface:
- **Output Mode Selection:** Real-time visual switching across $\text{APPROVE}$, $\text{REJECT}$, $\text{REVIEW}$, and a custom **Sandbox Mode**.
- **Prime Implicant Loop Visualizer:** Color-coded highlighting of essential implicant loops (Octet for $D$, Quad for $\overline{A}\overline{B}$, and single minterm $m_{14}$ for $\text{APPROVE}$).
- **Bidirectional Simulator Synchronization:** Real-time tracking of active inputs $(A, B, C, D)$ via animated beacon rings on the corresponding K-Map minterm cell.
- **Dynamic Symbolic Reduction:** Arbitrary cell modifications in Sandbox mode are minimized on the fly using SymPy's Quine-McCluskey engine.

---

## 5. Verification & Test Case Results

The test suite incorporates 15 test cases (10 normal operational states, 2 edge cases, 2 fault injections, and 1 boundary case).

| Case # | Category | Inputs / Attributes | Expected Output | Actual Output | Verification Result |
|:---:|:---|:---|:---:|:---:|:---:|
| 1 | Normal | $A=1, B=1, C=1, D=0, E=1$ | APPROVE | APPROVE | **PASS** |
| 2 | Normal | $A=1, B=1, C=1, D=0, E=0$ | APPROVE | APPROVE | **PASS** |
| 3 | Normal | $A=1, B=0, C=1, D=0, E=1$ | REVIEW | REVIEW | **PASS** |
| 4 | Normal | $A=0, B=1, C=1, D=0, E=1$ | REVIEW | REVIEW | **PASS** |
| 5 | Normal | $A=0, B=0, C=1, D=0, E=0$ | REJECT | REJECT | **PASS** |
| 6 | Normal | $A=1, B=1, C=0, D=0, E=1$ | REVIEW | REVIEW | **PASS** |
| 7 | Normal | $A=1, B=1, C=1, D=1, E=1$ | REJECT | REJECT | **PASS** |
| 8 | Normal | $A=0, B=0, C=0, D=0, E=0$ | REJECT | REJECT | **PASS** |
| 9 | Normal | $A=1, B=0, C=0, D=0, E=1$ | REVIEW | REVIEW | **PASS** |
| 10 | Normal | $A=0, B=1, C=0, D=0, E=0$ | REVIEW | REVIEW | **PASS** |
| 11 | Edge | $A=1, B=1, C=1, D=1, E=0$ (Default override) | REJECT | REJECT | **PASS** |
| 12 | Edge | $A=0, B=0, C=1, D=1, E=1$ (Compound negative) | REJECT | REJECT | **PASS** |
| 13 | Fault | Income = -₹500 (Negative input) | ValidationError | ValidationError | **PASS** |
| 14 | Fault | Credit Score = "abc" (Type error) | ValidationError | ValidationError | **PASS** |
| 15 | Boundary | Age = 21 (Exact lower threshold) | APPROVE (C=1) | APPROVE (C=1) | **PASS** |

**Summary:** 15/15 Passed (100% Success Rate in 0.08s).

---

## 6. Limitations and Future Scope

1. **Static Thresholds:** Currently, threshold boundaries (e.g., ₹40,000 income, 700 CIBIL) are fixed. A future enhancement could allow real-time microeconomic adjustment.
2. **Multi-tier Collateral:** Variable $E$ is binary; adding continuous Loan-to-Value (LTV) ratio analysis in Layer 2 would further refine risk estimation.
3. **Hardware Synthesis:** The minimal SOP formulas are directly synthesizable onto FPGA targets (using VHDL/Verilog) for ultra-low latency transaction processing.

---

## 7. References
1. M. M. Mano and M. D. Ciletti, *Digital Design: With an Introduction to the Verilog HDL, VHDL, and SystemVerilog*, 6th ed. Pearson, 2018.
2. C. H. Roth and L. L. Kinney, *Fundamentals of Logic Design*, 7th ed. Cengage Learning, 2014.
3. A. Meurer et al., "SymPy: symbolic computing in Python," *PeerJ Computer Science*, vol. 3, p. e103, 2017.
4. Reserve Bank of India (RBI), "Master Direction – Non-Banking Financial Company Guidelines," 2016.
5. TransUnion CIBIL, "Credit Score Algorithms and Default Probability Models," 2023.
