"""
EC2201 — Digital Systems: AI Rule Engine using Boolean Logic
Flask Web Application & REST API Server
"""

import os
from flask import Flask, render_template, request, jsonify, send_from_directory, redirect
import pandas as pd

from engine.boolean_core import evaluate_loan_application, derive_boolean_variables, evaluate_logic
from engine.ai_layer import calculate_ai_confidence, format_inr
from engine.simplify import (
    simplify_and_verify,
    generate_truth_table_csv,
    render_kmap_image,
    get_kmap_matrix,
    solve_custom_kmap,
    verify_boolean_equivalence
)
from tests.test_cases import run_all_cases_summary

app = Flask(__name__)

DATA_CSV = os.path.join(os.path.dirname(__file__), "data", "truth_table.csv")
KMAP_IMG = os.path.join(os.path.dirname(__file__), "static", "img", "kmap.png")

# Ensure dataset and K-map are generated at startup
if not os.path.exists(DATA_CSV):
    generate_truth_table_csv(DATA_CSV)

if not os.path.exists(KMAP_IMG):
    render_kmap_image(KMAP_IMG)


@app.route("/")
def index():
    """Main dashboard page."""
    return render_template("index.html")


@app.route("/learning")
def learning_page():
    """Direct shortcut route to Learning Hub."""
    return redirect("/#learning")


@app.route("/practicing")
def practicing_page():
    """Direct shortcut route to Practice Lab."""
    return redirect("/#practicing")


@app.route("/test")
def test_page():
    """Direct shortcut route to Assessment & Examination Center."""
    return redirect("/#testing")


@app.route("/api/evaluate", methods=["POST"])
def evaluate():
    """
    Evaluates a loan application through Layer 1 (Boolean logic) and Layer 2 (AI confidence).
    Handles fault cases with HTTP 400 and structured error response.
    Supports Indian Rupee (₹) financial framework with loan and collateral valuation.
    """
    data = request.get_json(force=True, silent=True)
    if not data:
        return jsonify({"success": False, "error": "Invalid request body. Expected JSON."}), 400

    try:
        income = data.get("income")
        credit_score = data.get("credit_score")
        age = data.get("age")
        has_default = data.get("has_default", False)
        has_collateral = data.get("has_collateral", False)
        loan_amount = data.get("loan_amount", 500000.0)
        collateral_value = data.get("collateral_value", 800000.0)

        # 1. Layer 1: Validate and compute core digital logic
        core_res = evaluate_loan_application(income, credit_score, age, has_default, has_collateral)
        decision = core_res["logic_result"]["decision"]
        bool_vars = core_res["boolean_variables"]
        logic_res = core_res["logic_result"]
        validated_inputs = core_res["inputs"]

        # 2. Layer 2: Explainable AI confidence & risk scoring
        ai_res = calculate_ai_confidence(
            income=validated_inputs["income"],
            credit_score=validated_inputs["credit_score"],
            has_collateral=validated_inputs["has_collateral"],
            decision=decision,
            boolean_vars=bool_vars,
            loan_amount=loan_amount,
            collateral_value=collateral_value
        )

        return jsonify({
            "success": True,
            "inputs": validated_inputs,
            "boolean_variables": bool_vars,
            "logic_result": logic_res,
            "ai_evaluation": ai_res
        })

    except ValueError as ve:
        # Graceful handling for bad inputs (Fault cases)
        return jsonify({
            "success": False,
            "error_type": "ValidationError",
            "error": str(ve)
        }), 400
    except Exception as e:
        return jsonify({
            "success": False,
            "error_type": "SystemError",
            "error": f"Internal evaluation error: {str(e)}"
        }), 500


@app.route("/api/truth-table", methods=["GET"])
def get_truth_table():
    """Returns the full 32-row truth table dataset."""
    try:
        if not os.path.exists(DATA_CSV):
            generate_truth_table_csv(DATA_CSV)
        df = pd.read_csv(DATA_CSV)
        return jsonify({
            "success": True,
            "total_rows": len(df),
            "rows": df.to_dict(orient="records")
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/simplify", methods=["GET"])
def get_simplification():
    """Returns SymPy minimal SOP expressions and mathematical verification proof."""
    try:
        results = simplify_and_verify(DATA_CSV)
        return jsonify({
            "success": True,
            "results": results,
            "kmap_url": "/static/img/kmap.png"
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/run-tests", methods=["POST", "GET"])
def run_tests():
    """Executes the 15 automated test cases and returns pass/fail status."""
    try:
        summary = run_all_cases_summary()
        return jsonify({
            "success": True,
            "summary": summary
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/kmap-interactive", methods=["GET"])
def kmap_interactive():
    """Returns dynamic 4x4 K-Map matrix with Gray code coordinates, minterms, and prime implicants."""
    try:
        data = get_kmap_matrix()
        return jsonify({"success": True, "data": data})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/kmap-solve", methods=["POST"])
def kmap_solve():
    """Dynamically simplifies arbitrary user-selected minterms in Sandbox mode."""
    try:
        payload = request.get_json(force=True, silent=True) or {}
        minterms = payload.get("minterms", [])
        result = solve_custom_kmap(minterms)
        return jsonify({"success": True, "result": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/verify-expression", methods=["POST"])
def verify_expression():
    """Formally verifies if two Boolean expressions entered by student are equivalent."""
    try:
        payload = request.get_json(force=True, silent=True) or {}
        expr1 = payload.get("expr1", "")
        expr2 = payload.get("expr2", "")
        if not expr1 or not expr2:
            return jsonify({
                "success": False,
                "error": "Both 'expr1' and 'expr2' are required for equivalence checking."
            }), 400
        res = verify_boolean_equivalence(expr1, expr2)
        return jsonify(res)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting EC2201 AI Rule Engine on http://127.0.0.1:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)
