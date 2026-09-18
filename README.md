# EC2201 — Digital Systems Design: Combinational Logic Synthesis & AI Rule Engine
### Undergraduate Instructional & Laboratory Platform
**Department of Electronics & Communication Engineering**

A formal combinational digital logic design and verification platform modeling institutional underwriting rules, complete with Karnaugh Map subcube analysis, SymPy Quine-McCluskey minimization, and an explainable stochastic risk layer.

---

## Technical Specifications
- **Deterministic Digital Logic Core (Layer 1):**
  - 5 switching Boolean variables ($A, B, C, D, E$) modeling regulatory banking constraints.
  - Programmatically derived 32-state truth table (`data/truth_table.csv`).
  - Minimal Sum-of-Products (SOP) derivation via SymPy Quine-McCluskey reduction.
  - Formal mathematical verification: 100% equivalence proof across all $2^5 = 32$ minterms with zero logic hazard.
  - Mutual exclusivity guaranteed by complement theorem: $\text{APPROVE} \cdot \text{REJECT} \equiv 0$.
- **Downstream Stochastic / AI Risk Layer (Layer 2):**
  - Bounded 0–100% confidence rating evaluated strictly on continuous financial parameters (Indian Rupee INR).
  - Soft-signal collateral modeling with Loan-to-Value (LTV) exposure analysis against RBI benchmarks.
  - Human-auditable factor decomposition and risk tier assignment (Low, Moderate, High).
- **Interactive Laboratory Web Platform:**
  - Modern institutional dark interface built with Flask, HTML5, CSS3, and vanilla JavaScript.
  - **Parametric Logic Laboratory:** Real-time logic gate signal tracing, coordinate mapping, and LTV ratio metrics.
  - **Gate-Level Logic Schematic:** Vector circuit diagram featuring inverter, AND, OR, and NOR gate topologies.
  - **Karnaugh Map Studio:** Interactive 4-variable Gray code matrix ($AB \times CD$), essential prime implicant loop visualizer, and custom Boolean function synthesis sandbox.
  - **Automated Testbench:** Real-time execution of all 15 test vectors directly in-browser.
  - **IEEE Technical Specification Manuscript & Oral Defense Guide.**

---

## 📁 Repository Structure
```
EC2201/
├── README.md                  # Setup, testing, and architecture documentation
├── requirements.txt           # Python dependency specifications
├── app.py                     # Flask web server & REST API
├── data/
│   └── truth_table.csv        # Programmatically generated 32-row truth table dataset
├── engine/
│   ├── __init__.py
│   ├── boolean_core.py        # Layer 1: Combinational digital logic engine
│   ├── simplify.py            # SymPy SOP minimization, verification, & K-map generator
│   └── ai_layer.py            # Layer 2: Explainable confidence scoring framework
├── tests/
│   ├── __init__.py
│   └── test_cases.py          # 15 automated test cases (pytest + programmatic runner)
├── static/
│   ├── css/
│   │   └── style.css          # Modern dark-theme glassmorphism styling
│   ├── js/
│   │   └── main.js            # Front-end interactivity and REST API controller
│   └── img/
│       └── kmap.png           # Programmatically generated Karnaugh Map diagram
├── templates/
│   └── index.html             # Single-page dashboard containing all 9 sections
├── report/
│   └── project_report.md      # Full academic project report (IEEE format)
└── demo_video_link.txt        # Video submission URL and 3-5 min presentation script
```

---

## 🚀 Quickstart & Setup

### 1. Prerequisites
- Python 3.9 or higher (tested with Python 3.14).

### 2. Environment Setup
Clone or navigate to the project directory:
```bash
cd c:/Users/simso/Downloads/EC2201
```

Create and activate a virtual environment:
```bash
# Windows
py -m venv .venv
.venv\Scripts\activate

# macOS / Linux
python3 -m venv .venv
source .venv/bin/activate
```

Install required packages:
```bash
pip install -r requirements.txt
```

---

## 🧪 Running Automated Tests (Zero Logic Errors Proof)

Run the full 15-case test suite (10 normal + 2 edge + 2 fault + 1 boundary) using `pytest`:
```bash
pytest tests/test_cases.py -v
```

To re-run the formal SymPy 32-state truth table verification and generate fresh K-Map images:
```bash
python engine/simplify.py
```
Expected output:
```
Generated 32 rows in data/truth_table.csv
Zero logic errors: All 32 truth table rows match simplified SOP expressions!
K-Map visual saved to static/img/kmap.png
```

---

## 🌐 Running the Web Application

Launch the Flask server:
```bash
python app.py
```

Open your browser and navigate to:
```
http://127.0.0.1:5000
```

### Available REST Endpoints:
- `POST /api/evaluate`: Evaluates loan parameters, returning Boolean states, Layer 1 decision, Layer 2 confidence score, and truth table coordinate.
- `GET /api/truth-table`: Fetches the complete 32-row dataset with decision metadata.
- `GET /api/simplify`: Returns minimal SOP equations, verification certificate, and K-Map path.
- `POST /api/run-tests`: Executes all 15 test cases dynamically and returns live pass/fail results.

---

## 📊 Summary of Test Cases (15/15 Passed)

| # | Type | Scenario | Expected | Result |
|:---:|:---:|:---|:---:|:---:|
| 1 | Normal | High income, good credit, valid age, no default, with collateral | APPROVE | ✅ PASS |
| 2 | Normal | High income, good credit, valid age, no default, without collateral | APPROVE | ✅ PASS |
| 3 | Normal | Good income, low credit score, no default, with collateral | REVIEW | ✅ PASS |
| 4 | Normal | Low income, good credit score, no default, with collateral | REVIEW | ✅ PASS |
| 5 | Normal | Low income, low credit score, no default, without collateral | REJECT | ✅ PASS |
| 6 | Normal | Good income & credit, outside working age bracket | REVIEW | ✅ PASS |
| 7 | Normal | High income & credit, but active unpaid default present | REJECT | ✅ PASS |
| 8 | Normal | All parameters failing simultaneously | REJECT | ✅ PASS |
| 9 | Normal | High income, low credit, outside age bracket | REVIEW | ✅ PASS |
| 10 | Normal | Low income, high credit, outside age bracket | REVIEW | ✅ PASS |
| 11 | Edge | Unpaid default overrides otherwise flawless financial profile | REJECT | ✅ PASS |
| 12 | Edge | Compound negative (low income + poor credit) with default | REJECT | ✅ PASS |
| 13 | Fault | Negative income input (-₹500) | ValidationError (HTTP 400) | ✅ PASS |
| 14 | Fault | Non-numeric credit score ("abc") | ValidationError (HTTP 400) | ✅ PASS |
| 15 | Boundary | Age = 21 exactly (inclusive lower threshold check) | APPROVE (C=1) | ✅ PASS |

---

## 📜 Deliverables Checklist
- [x] Complete source code (`app.py`, `engine/`, `tests/`, `templates/`, `static/`)
- [x] Reproducible setup and execution guide (`README.md`, `requirements.txt`)
- [x] Generated truth table dataset (`data/truth_table.csv`)
- [x] Automated test suite (`tests/test_cases.py`, 15/15 passed)
- [x] Visual Karnaugh Map (`static/img/kmap.png`)
- [x] Academic project report (`report/project_report.md`)
- [x] 3–5 min demonstration video script and link file (`demo_video_link.txt`)
- [x] IEEE academic references list (embedded in report and web app)
