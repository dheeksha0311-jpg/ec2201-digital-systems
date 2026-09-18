"""
EC2201 — Digital Systems: AI Rule Engine using Boolean Logic
Layer 1: Core Digital Logic Engine
Smart Loan Eligibility & Risk Advisor
"""

from typing import Dict, Any, Tuple, Union


def validate_inputs(
    income: Any,
    credit_score: Any,
    age: Any,
    has_default: Any,
    has_collateral: Any
) -> Tuple[float, int, int, bool, bool]:
    """
    Validates input parameters against domain constraints.
    Raises ValueError with descriptive messages for invalid inputs (fault test cases).
    """
    # 1. Income validation
    try:
        income_val = float(income)
    except (ValueError, TypeError):
        raise ValueError(f"Invalid income: '{income}' is not a numeric value.")
    
    if income_val < 0:
        raise ValueError(f"Invalid income: ₹{income_val} cannot be negative.")
    
    # 2. Credit score validation
    try:
        # Check for string inputs that cannot be cast to integer
        if isinstance(credit_score, str) and not credit_score.strip().lstrip('-').isdigit():
            raise ValueError(f"Invalid credit score: '{credit_score}' is not a valid integer.")
        credit_val = int(credit_score)
    except (ValueError, TypeError):
        raise ValueError(f"Invalid credit score: '{credit_score}' must be a valid integer.")
    
    if credit_val < 300 or credit_val > 900:
        # Standard credit score range in India (CIBIL: 300 - 900)
        raise ValueError(f"Credit score {credit_val} out of standard range (300 - 900).")

    # 3. Age validation
    try:
        age_val = int(age)
    except (ValueError, TypeError):
        raise ValueError(f"Invalid age: '{age}' must be a valid integer.")
        
    if age_val <= 0 or age_val > 120:
        raise ValueError(f"Invalid age: {age_val} is outside human lifespan.")

    # 4. Defaults & Collateral boolean parsing
    def parse_bool(val: Any, name: str) -> bool:
        if isinstance(val, bool):
            return val
        if isinstance(val, (int, float)):
            return bool(val)
        if isinstance(val, str):
            clean = val.strip().lower()
            if clean in ('1', 'true', 'yes', 'y'):
                return True
            if clean in ('0', 'false', 'no', 'n'):
                return False
        raise ValueError(f"Invalid boolean value for {name}: {val}")

    default_val = parse_bool(has_default, "has_default")
    collateral_val = parse_bool(has_collateral, "has_collateral")

    return income_val, credit_val, age_val, default_val, collateral_val


def derive_boolean_variables(
    income: float,
    credit_score: int,
    age: int,
    has_default: bool,
    has_collateral: bool
) -> Dict[str, int]:
    """
    Maps continuous/discrete domain inputs into 5 binary Boolean variables:
      A = Income sufficient (income >= ₹40,000)
      B = Credit score good (credit_score >= 700)
      C = Age in valid range (21 <= age <= 58)  [Boundary: 21 inclusive, 58 inclusive]
      D = Existing loan default (has_default == True)
      E = Collateral available (has_collateral == True)
    """
    A = 1 if income >= 40000 else 0
    B = 1 if credit_score >= 700 else 0
    C = 1 if 21 <= age <= 58 else 0
    D = 1 if has_default else 0
    E = 1 if has_collateral else 0

    return {
        "A": A,
        "B": B,
        "C": C,
        "D": D,
        "E": E
    }


def evaluate_logic(A: int, B: int, C: int, D: int, E: int = 0) -> Dict[str, Any]:
    """
    Pure combinational digital logic evaluation.
    Formulas:
      APPROVE = A · B · C · D'
      REJECT  = D + A' · B'
      REVIEW  = (APPROVE + REJECT)'
    
    Mutual exclusivity is guaranteed by construction.
    """
    # Boolean logic operations
    approve_bool = bool(A and B and C and (not D))
    reject_bool = bool(D or ((not A) and (not B)))
    review_bool = bool(not (approve_bool or reject_bool))

    approve_int = int(approve_bool)
    reject_int = int(reject_bool)
    review_int = int(review_bool)

    if approve_int == 1:
        decision = "APPROVE"
    elif reject_int == 1:
        decision = "REJECT"
    else:
        decision = "REVIEW"

    # Compute row index in standard 32-row truth table (binary weight A*16 + B*8 + C*4 + D*2 + E*1)
    row_index = (A << 4) | (B << 3) | (C << 2) | (D << 1) | E

    return {
        "APPROVE": approve_int,
        "REJECT": reject_int,
        "REVIEW": review_int,
        "decision": decision,
        "row_index": row_index,
        "trace": {
            "approve_term": f"A({A}) AND B({B}) AND C({C}) AND NOT D({D}) = {approve_int}",
            "reject_terms": f"D({D}) OR (NOT A({A}) AND NOT B({B})) = {reject_int}",
            "review_term": f"NOT (APPROVE({approve_int}) OR REJECT({reject_int})) = {review_int}"
        }
    }


def evaluate_loan_application(
    income: Any,
    credit_score: Any,
    age: Any,
    has_default: Any,
    has_collateral: Any
) -> Dict[str, Any]:
    """
    High-level entrypoint:
      1. Validates inputs (raises ValueError on bad input)
      2. Derives binary signals A, B, C, D, E
      3. Evaluates combinational logic
    """
    inc, cr, ag, df, col = validate_inputs(income, credit_score, age, has_default, has_collateral)
    bool_vars = derive_boolean_variables(inc, cr, ag, df, col)
    logic_result = evaluate_logic(
        bool_vars["A"],
        bool_vars["B"],
        bool_vars["C"],
        bool_vars["D"],
        bool_vars["E"]
    )

    return {
        "inputs": {
            "income": inc,
            "credit_score": cr,
            "age": ag,
            "has_default": df,
            "has_collateral": col
        },
        "boolean_variables": bool_vars,
        "logic_result": logic_result
    }
