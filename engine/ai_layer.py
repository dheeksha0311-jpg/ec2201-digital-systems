"""
EC2201 — Digital Systems: AI Rule Engine using Boolean Logic
Layer 2: AI / Data Confidence & Risk Scoring Layer (Indian Rupee Financial System)
"""

from typing import Dict, Any, List, Optional


def format_inr(amount: float) -> str:
    """Formats numeric amounts into Indian Rupee numbering notation (Lakhs / Crores)."""
    val = int(round(amount))
    s = str(abs(val))
    sign = "-" if val < 0 else ""
    if len(s) <= 3:
        return f"{sign}₹{s}"
    last_three = s[-3:]
    remaining = s[:-3]
    parts = []
    while len(remaining) > 2:
        parts.insert(0, remaining[-2:])
        remaining = remaining[:-2]
    if remaining:
        parts.insert(0, remaining)
    return f"{sign}₹{','.join(parts)},{last_three}"


def calculate_ai_confidence(
    income: float,
    credit_score: int,
    has_collateral: bool,
    decision: str,
    boolean_vars: Dict[str, int],
    loan_amount: Optional[float] = 500000.0,
    collateral_value: Optional[float] = 800000.0
) -> Dict[str, Any]:
    """
    Computes transparent, explainable confidence scoring on top of Layer 1 Boolean decision.
    Operates within the Indian Rupee (₹) banking framework.
    Uses continuous inputs (exact income, credit score, loan amount, collateral value) as soft signals.
    Does NOT alter the hard digital logic decision.
    """
    loan_amt = float(loan_amount) if loan_amount is not None else 500000.0
    col_val = float(collateral_value) if collateral_value is not None else 800000.0

    # 1. Base score derived from deterministic digital logic decision
    if decision == "APPROVE":
        base = 70.0
    elif decision == "REJECT":
        base = 25.0
    else:  # REVIEW
        base = 50.0

    breakdown: List[Dict[str, Any]] = [
        {"factor": "Base Digital Logic", "impact": base, "detail": f"Derived from Layer 1 {decision} combinational gate state"}
    ]

    total_score = base

    # 2. Continuous Income Surplus / Deficit (Baseline: ₹40,000 / month)
    if income > 40000:
        income_surplus = income - 40000
        # +1% per ₹4,000 above ₹40k, capped at +15%
        inc_bonus = min(15.0, round((income_surplus / 4000.0), 2))
        total_score += inc_bonus
        breakdown.append({
            "factor": "Income Surplus Buffer",
            "impact": inc_bonus,
            "detail": f"+{format_inr(income_surplus)}/mo surplus above {format_inr(40000)} threshold (+{inc_bonus}%)"
        })
    elif decision == "REVIEW" and income < 40000:
        inc_penalty = min(15.0, round(((40000 - income) / 4000.0), 2))
        total_score -= inc_penalty
        breakdown.append({
            "factor": "Income Below Baseline",
            "impact": -inc_penalty,
            "detail": f"{format_inr(income)}/mo is below {format_inr(40000)} threshold (-{inc_penalty}%)"
        })

    # 3. Credit Score Quality (Baseline: 700 CIBIL)
    if credit_score > 700:
        credit_surplus = credit_score - 700
        # +1% per 20 points above 700, capped at +10%
        cr_bonus = min(10.0, round((credit_surplus / 20.0), 2))
        total_score += cr_bonus
        breakdown.append({
            "factor": "CIBIL Score Quality",
            "impact": cr_bonus,
            "detail": f"+{credit_surplus} pts above 700 benchmark (+{cr_bonus}%)"
        })
    elif decision == "REVIEW" and credit_score < 700:
        cr_penalty = min(10.0, round(((700 - credit_score) / 20.0), 2))
        total_score -= cr_penalty
        breakdown.append({
            "factor": "Sub-optimal Credit Score",
            "impact": -cr_penalty,
            "detail": f"{credit_score} is below 700 benchmark (-{cr_penalty}%)"
        })

    # 4. Collateral Soft Signal (Variable E) & Loan-to-Value (LTV) Analysis
    ltv_ratio = None
    if has_collateral and col_val > 0:
        ltv_ratio = round((loan_amt / col_val) * 100.0, 1)
        if ltv_ratio <= 75.0:
            col_bonus = 10.0
            total_score += col_bonus
            breakdown.append({
                "factor": "Pledged Collateral Asset",
                "impact": col_bonus,
                "detail": f"Asset {format_inr(col_val)} covers requested loan {format_inr(loan_amt)} (LTV: {ltv_ratio}%, within 75% RBI cap)"
            })
        else:
            col_bonus = 5.0
            total_score += col_bonus
            breakdown.append({
                "factor": "High LTV Collateral",
                "impact": col_bonus,
                "detail": f"Collateral {format_inr(col_val)} pledged, but LTV of {ltv_ratio}% exceeds prudent 75% benchmark"
            })
    elif has_collateral:
        col_bonus = 10.0
        total_score += col_bonus
        breakdown.append({
            "factor": "Pledged Collateral Asset",
            "impact": col_bonus,
            "detail": "Tangible asset pledged, mitigating lender loss given default (+10%)"
        })
    else:
        breakdown.append({
            "factor": "Unsecured Loan Structure",
            "impact": 0.0,
            "detail": f"No collateral pledged for {format_inr(loan_amt)} loan (Unsecured facility)"
        })

    # Clamp confidence to [0, 100]
    final_score = round(max(0.0, min(100.0, total_score)), 1)

    # Risk Tier classification
    if final_score >= 75.0:
        risk_tier = "LOW RISK"
        badge_color = "success"
    elif final_score >= 50.0:
        risk_tier = "MODERATE RISK"
        badge_color = "warning"
    else:
        risk_tier = "HIGH RISK"
        badge_color = "danger"

    # Human-readable summary
    if decision == "APPROVE":
        summary = f"Strong applicant profile approved by digital logic with {final_score}% confidence score ({risk_tier})."
    elif decision == "REJECT":
        summary = f"Application rejected by core digital rules (Score: {final_score}%, {risk_tier})."
    else:
        summary = f"Marginal qualification flags require human underwriting. Confidence: {final_score}% ({risk_tier})."

    return {
        "confidence_score": final_score,
        "risk_tier": risk_tier,
        "badge_color": badge_color,
        "summary": summary,
        "breakdown": breakdown,
        "financial_metrics": {
            "income_formatted": format_inr(income),
            "loan_amount_formatted": format_inr(loan_amt),
            "collateral_value_formatted": format_inr(col_val) if has_collateral else "₹0 (None)",
            "ltv_ratio": f"{ltv_ratio}%" if ltv_ratio is not None else "N/A (Unsecured)"
        }
    }
