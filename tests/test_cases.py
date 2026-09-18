"""
EC2201 — Digital Systems: AI Rule Engine using Boolean Logic
Automated Verification Suite (15 Test Cases: 10 Normal + 5 Edge/Fault/Boundary)
"""

import pytest
from engine.boolean_core import (
    derive_boolean_variables,
    evaluate_logic,
    validate_inputs,
    evaluate_loan_application
)
from engine.ai_layer import calculate_ai_confidence

# Predefined metadata for all 15 cases (used by both pytest and Web UI Test Runner)
TEST_CASES_SPEC = [
    {
        "id": 1,
        "type": "Normal",
        "description": "All positive conditions with collateral",
        "inputs": {"A": 1, "B": 1, "C": 1, "D": 0, "E": 1},
        "raw_sample": {"income": 50000, "credit_score": 750, "age": 30, "has_default": False, "has_collateral": True},
        "expected": "APPROVE"
    },
    {
        "id": 2,
        "type": "Normal",
        "description": "All positive conditions without collateral",
        "inputs": {"A": 1, "B": 1, "C": 1, "D": 0, "E": 0},
        "raw_sample": {"income": 60000, "credit_score": 780, "age": 40, "has_default": False, "has_collateral": False},
        "expected": "APPROVE"
    },
    {
        "id": 3,
        "type": "Normal",
        "description": "Good income, poor credit score, valid age, no default, has collateral",
        "inputs": {"A": 1, "B": 0, "C": 1, "D": 0, "E": 1},
        "raw_sample": {"income": 45000, "credit_score": 620, "age": 28, "has_default": False, "has_collateral": True},
        "expected": "REVIEW"
    },
    {
        "id": 4,
        "type": "Normal",
        "description": "Low income, good credit score, valid age, no default, has collateral",
        "inputs": {"A": 0, "B": 1, "C": 1, "D": 0, "E": 1},
        "raw_sample": {"income": 35000, "credit_score": 740, "age": 35, "has_default": False, "has_collateral": True},
        "expected": "REVIEW"
    },
    {
        "id": 5,
        "type": "Normal",
        "description": "Low income, poor credit score, valid age, no default, no collateral",
        "inputs": {"A": 0, "B": 0, "C": 1, "D": 0, "E": 0},
        "raw_sample": {"income": 25000, "credit_score": 580, "age": 32, "has_default": False, "has_collateral": False},
        "expected": "REJECT"
    },
    {
        "id": 6,
        "type": "Normal",
        "description": "Good income, good credit score, out of age range, no default",
        "inputs": {"A": 1, "B": 1, "C": 0, "D": 0, "E": 1},
        "raw_sample": {"income": 70000, "credit_score": 790, "age": 62, "has_default": False, "has_collateral": True},
        "expected": "REVIEW"
    },
    {
        "id": 7,
        "type": "Normal",
        "description": "High income & credit, but has existing default (default overrides)",
        "inputs": {"A": 1, "B": 1, "C": 1, "D": 1, "E": 1},
        "raw_sample": {"income": 80000, "credit_score": 820, "age": 38, "has_default": True, "has_collateral": True},
        "expected": "REJECT"
    },
    {
        "id": 8,
        "type": "Normal",
        "description": "All negative conditions across all variables",
        "inputs": {"A": 0, "B": 0, "C": 0, "D": 0, "E": 0},
        "raw_sample": {"income": 15000, "credit_score": 450, "age": 19, "has_default": False, "has_collateral": False},
        "expected": "REJECT"
    },
    {
        "id": 9,
        "type": "Normal",
        "description": "Good income, poor credit, invalid age, no default, with collateral",
        "inputs": {"A": 1, "B": 0, "C": 0, "D": 0, "E": 1},
        "raw_sample": {"income": 48000, "credit_score": 550, "age": 65, "has_default": False, "has_collateral": True},
        "expected": "REVIEW"
    },
    {
        "id": 10,
        "type": "Normal",
        "description": "Low income, good credit, invalid age, no default, no collateral",
        "inputs": {"A": 0, "B": 1, "C": 0, "D": 0, "E": 0},
        "raw_sample": {"income": 32000, "credit_score": 760, "age": 18, "has_default": False, "has_collateral": False},
        "expected": "REVIEW"
    },
    {
        "id": 11,
        "type": "Edge",
        "description": "Default overrides otherwise perfect profile without collateral",
        "inputs": {"A": 1, "B": 1, "C": 1, "D": 1, "E": 0},
        "raw_sample": {"income": 95000, "credit_score": 840, "age": 33, "has_default": True, "has_collateral": False},
        "expected": "REJECT"
    },
    {
        "id": 12,
        "type": "Edge",
        "description": "Double negative (low income + poor credit) combined with default",
        "inputs": {"A": 0, "B": 0, "C": 1, "D": 1, "E": 1},
        "raw_sample": {"income": 20000, "credit_score": 500, "age": 25, "has_default": True, "has_collateral": True},
        "expected": "REJECT"
    },
    {
        "id": 13,
        "type": "Fault",
        "description": "Negative income input (fault handling: must raise validation error)",
        "inputs": None,
        "raw_sample": {"income": -500, "credit_score": 750, "age": 30, "has_default": False, "has_collateral": False},
        "expected": "VAL_ERROR"
    },
    {
        "id": 14,
        "type": "Fault",
        "description": "Non-numeric string credit score (fault handling: must raise validation error)",
        "inputs": None,
        "raw_sample": {"income": 55000, "credit_score": "abc", "age": 30, "has_default": False, "has_collateral": False},
        "expected": "VAL_ERROR"
    },
    {
        "id": 15,
        "type": "Boundary",
        "description": "Boundary condition test: Age = 21 exactly (must be inclusive, C=1)",
        "inputs": {"A": 1, "B": 1, "C": 1, "D": 0, "E": 1},
        "raw_sample": {"income": 45000, "credit_score": 720, "age": 21, "has_default": False, "has_collateral": True},
        "expected": "APPROVE"
    }
]


# Pytest implementations for all 15 cases
@pytest.mark.parametrize("case", [c for c in TEST_CASES_SPEC if c["type"] == "Normal"])
def test_normal_cases(case):
    """Test standard normal operational states (Cases 1 - 10)"""
    inputs = case["inputs"]
    result = evaluate_logic(inputs["A"], inputs["B"], inputs["C"], inputs["D"], inputs["E"])
    assert result["decision"] == case["expected"], f"Case {case['id']} failed: got {result['decision']}, expected {case['expected']}"


def test_edge_case_11():
    """Case 11: Default overrides perfect financial signals"""
    res = evaluate_logic(A=1, B=1, C=1, D=1, E=0)
    assert res["decision"] == "REJECT"
    assert res["REJECT"] == 1
    assert res["APPROVE"] == 0


def test_edge_case_12():
    """Case 12: Double negative and default active"""
    res = evaluate_logic(A=0, B=0, C=1, D=1, E=1)
    assert res["decision"] == "REJECT"
    assert res["REJECT"] == 1


def test_fault_case_13_negative_income():
    """Case 13: Negative income must raise ValueError gracefully"""
    with pytest.raises(ValueError) as excinfo:
        validate_inputs(income=-500, credit_score=750, age=30, has_default=False, has_collateral=False)
    assert "cannot be negative" in str(excinfo.value)


def test_fault_case_14_invalid_credit_type():
    """Case 14: Non-numeric credit score must raise ValueError gracefully"""
    with pytest.raises(ValueError) as excinfo:
        validate_inputs(income=50000, credit_score="abc", age=30, has_default=False, has_collateral=False)
    assert "valid integer" in str(excinfo.value)


def test_boundary_case_15_age_boundary():
    """Case 15: Age = 21 exactly must evaluate C = 1 (inclusive)"""
    vars_derived = derive_boolean_variables(income=45000, credit_score=720, age=21, has_default=False, has_collateral=True)
    assert vars_derived["C"] == 1, "Boundary condition failed: Age 21 should yield C=1"
    
    # Upper boundary: age = 58 inclusive
    vars_upper = derive_boolean_variables(income=45000, credit_score=720, age=58, has_default=False, has_collateral=True)
    assert vars_upper["C"] == 1, "Boundary condition failed: Age 58 should yield C=1"

    # Out of boundary: age = 20
    vars_below = derive_boolean_variables(income=45000, credit_score=720, age=20, has_default=False, has_collateral=True)
    assert vars_below["C"] == 0, "Boundary condition failed: Age 20 should yield C=0"

    # Full application evaluation at age 21
    app_res = evaluate_loan_application(income=45000, credit_score=720, age=21, has_default=False, has_collateral=True)
    assert app_res["logic_result"]["decision"] == "APPROVE"


def run_all_cases_summary():
    """
    Executes all 15 test cases programmatically and returns detailed report.
    Used by web API /api/run-tests.
    """
    results = []
    passed_count = 0

    for case in TEST_CASES_SPEC:
        cid = case["id"]
        ctype = case["type"]
        desc = case["description"]
        raw = case["raw_sample"]
        expected = case["expected"]

        try:
            if expected == "VAL_ERROR":
                # Fault case test
                try:
                    evaluate_loan_application(
                        income=raw["income"],
                        credit_score=raw["credit_score"],
                        age=raw["age"],
                        has_default=raw["has_default"],
                        has_collateral=raw["has_collateral"]
                    )
                    status = "FAIL"
                    actual = "Did not catch invalid input"
                    error_msg = "Expected ValueError, but operation succeeded."
                except ValueError as ve:
                    status = "PASS"
                    actual = f"Rejected gracefully ({ve})"
                    error_msg = None
                    passed_count += 1
            else:
                # Normal or Edge or Boundary
                res = evaluate_loan_application(
                    income=raw["income"],
                    credit_score=raw["credit_score"],
                    age=raw["age"],
                    has_default=raw["has_default"],
                    has_collateral=raw["has_collateral"]
                )
                actual = res["logic_result"]["decision"]
                if actual == expected:
                    status = "PASS"
                    passed_count += 1
                    error_msg = None
                else:
                    status = "FAIL"
                    error_msg = f"Expected {expected}, got {actual}"

        except Exception as e:
            status = "ERROR"
            actual = str(e)
            error_msg = str(e)

        results.append({
            "id": cid,
            "type": ctype,
            "description": desc,
            "inputs_display": case["inputs"] or raw,
            "expected": expected,
            "actual": actual,
            "status": status,
            "error": error_msg
        })

    return {
        "total": len(TEST_CASES_SPEC),
        "passed": passed_count,
        "failed": len(TEST_CASES_SPEC) - passed_count,
        "all_passed": (passed_count == len(TEST_CASES_SPEC)),
        "cases": results
    }


def test_verify_boolean_equivalence():
    """Verifies that algebraic equivalence checking correctly validates equivalent and non-equivalent expressions."""
    from engine.simplify import verify_boolean_equivalence
    # Absorption Law: A + A*B == A
    res1 = verify_boolean_equivalence("A + A · B", "A")
    assert res1["success"] is True
    assert res1["equivalent"] is True

    # De Morgan: (A · B)' == A' + B'
    res2 = verify_boolean_equivalence("(A · B)'", "A' + B'")
    assert res2["success"] is True
    assert res2["equivalent"] is True

    # Non-equivalent: A · B != A + B
    res3 = verify_boolean_equivalence("A · B", "A + B")
    assert res3["success"] is True
    assert res3["equivalent"] is False

    # Underwriting Approval decomposition: (A · B) · (C · D') == A · B · C · D'
    res4 = verify_boolean_equivalence("(A · B) · (C · D')", "A · B · C · D'")
    assert res4["success"] is True
    assert res4["equivalent"] is True

