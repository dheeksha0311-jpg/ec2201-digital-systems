"""
EC2201 — Digital Systems: AI Rule Engine using Boolean Logic
Simplification, K-Map Generation, and Truth Table Verification
"""

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import itertools
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend for server/CLI
import matplotlib.pyplot as plt
import matplotlib.patches as patches

from sympy import symbols
from sympy.logic.boolalg import SOPform, POSform, simplify_logic

# Import our core logic to guarantee zero divergence
from engine.boolean_core import evaluate_logic



def generate_truth_table_csv(output_path: str = "data/truth_table.csv") -> pd.DataFrame:
    """
    Programmatically generates the 32-row truth table (2^5 combinations of A, B, C, D, E)
    directly using engine.boolean_core.evaluate_logic.
    Saves to CSV as a core project deliverable.
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    rows = []
    for A, B, C, D, E in itertools.product([0, 1], repeat=5):
        result = evaluate_logic(A, B, C, D, E)
        rows.append({
            "A": A,
            "B": B,
            "C": C,
            "D": D,
            "E": E,
            "APPROVE": result["APPROVE"],
            "REJECT": result["REJECT"],
            "REVIEW": result["REVIEW"],
            "DECISION": result["decision"]
        })
    
    df = pd.DataFrame(rows)
    df.to_csv(output_path, index=False)
    print(f"Generated {len(df)} rows in {output_path}")
    return df


def simplify_and_verify(csv_path: str = "data/truth_table.csv"):
    """
    Derives minimal Sum-of-Products (SOP) expressions using SymPy
    and formally verifies them against all 32 rows of the truth table.
    """
    if not os.path.exists(csv_path):
        df = generate_truth_table_csv(csv_path)
    else:
        df = pd.read_csv(csv_path)

    A, B, C, D, E = symbols('A B C D E')
    var_list = [A, B, C, D, E]

    # Extract minterms (list of tuples of inputs where output == 1)
    minterms_approve = df[df.APPROVE == 1][["A", "B", "C", "D", "E"]].values.tolist()
    minterms_reject = df[df.REJECT == 1][["A", "B", "C", "D", "E"]].values.tolist()
    minterms_review = df[df.REVIEW == 1][["A", "B", "C", "D", "E"]].values.tolist()

    # SymPy SOPform minimization
    sop_approve = SOPform(var_list, minterms_approve)
    sop_reject = SOPform(var_list, minterms_reject)
    sop_review = SOPform(var_list, minterms_review)

    # Formal Verification across all 32 rows
    mismatches = []
    for idx, row in df.iterrows():
        subs_dict = {
            A: bool(row["A"]),
            B: bool(row["B"]),
            C: bool(row["C"]),
            D: bool(row["D"]),
            E: bool(row["E"]),
        }
        
        eval_sop_app = int(bool(sop_approve.subs(subs_dict)))
        eval_sop_rej = int(bool(sop_reject.subs(subs_dict)))
        eval_sop_rev = int(bool(sop_review.subs(subs_dict)))

        if (eval_sop_app != row["APPROVE"] or 
            eval_sop_rej != row["REJECT"] or 
            eval_sop_rev != row["REVIEW"]):
            mismatches.append((idx, row.to_dict()))

    if mismatches:
        raise AssertionError(f"Logic verification FAILED on {len(mismatches)} rows: {mismatches}")
    
    print("Zero logic errors: All 32 truth table rows match simplified SOP expressions!")
    
    return {
        "sop_approve": str(sop_approve),
        "sop_reject": str(sop_reject),
        "sop_review": str(sop_review),
        "minterms_count": {
            "APPROVE": len(minterms_approve),
            "REJECT": len(minterms_reject),
            "REVIEW": len(minterms_review)
        },
        "verified": True,
        "rows_checked": len(df)
    }


def render_kmap_image(output_path: str = "static/img/kmap.png"):
    """
    Renders visual Karnaugh Map (K-Map) grids for APPROVE and REJECT outputs.
    Since variable E acts as a soft AI-layer signal, the primary digital logic
    is governed by the 4 variables A, B, C, D.
    We plot a standard 4x4 K-map with Gray code row/column sequence: 00, 01, 11, 10.
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    gray_code = ["00", "01", "11", "10"]
    
    # 4x4 grids for A,B (rows) vs C,D (cols)
    grid_approve = np.zeros((4, 4), dtype=int)
    grid_reject = np.zeros((4, 4), dtype=int)
    grid_review = np.zeros((4, 4), dtype=int)

    for r_idx, ab in enumerate(gray_code):
        a = int(ab[0])
        b = int(ab[1])
        for c_idx, cd in enumerate(gray_code):
            c = int(cd[0])
            d = int(cd[1])
            res = evaluate_logic(a, b, c, d, 0)
            grid_approve[r_idx, c_idx] = res["APPROVE"]
            grid_reject[r_idx, c_idx] = res["REJECT"]
            grid_review[r_idx, c_idx] = res["REVIEW"]

    fig, axes = plt.subplots(1, 2, figsize=(14, 6), facecolor="#0f172a")
    plt.subplots_adjust(wspace=0.3)

    maps = [
        ("K-Map: APPROVE Output (F = A · B · C · D')", grid_approve, axes[0], "#10b981", "#064e3b"),
        ("K-Map: REJECT Output (F = D + A' · B')", grid_reject, axes[1], "#ef4444", "#7f1d1d")
    ]

    for title, grid, ax, active_color, box_color in maps:
        ax.set_facecolor("#1e293b")
        ax.set_xlim(-0.5, 3.5)
        ax.set_ylim(3.5, -0.5)
        
        # Grid lines
        for i in range(5):
            ax.axhline(i - 0.5, color="#475569", lw=1.5)
            ax.axvline(i - 0.5, color="#475569", lw=1.5)

        # Labels
        ax.set_xticks(range(4))
        ax.set_xticklabels(gray_code, fontsize=12, fontweight="bold", color="#94a3b8")
        ax.set_yticks(range(4))
        ax.set_yticklabels(gray_code, fontsize=12, fontweight="bold", color="#94a3b8")

        ax.set_xlabel("CD (Gray Code)", fontsize=13, fontweight="bold", color="#cbd5e1", labelpad=8)
        ax.set_ylabel("AB (Gray Code)", fontsize=13, fontweight="bold", color="#cbd5e1", labelpad=8)
        ax.set_title(title, fontsize=14, fontweight="bold", color="#f8fafc", pad=15)

        # Values
        for r in range(4):
            for c in range(4):
                val = grid[r, c]
                if val == 1:
                    # Highlight 1 cell
                    rect = patches.Rectangle((c - 0.45, r - 0.45), 0.9, 0.9, 
                                             facecolor=box_color, edgecolor=active_color, lw=2, zorder=2)
                    ax.add_patch(rect)
                    ax.text(c, r, f"{val}", color=active_color, fontsize=18, fontweight="black", 
                            ha="center", va="center", zorder=3)
                else:
                    ax.text(c, r, f"{val}", color="#64748b", fontsize=16, fontweight="bold", 
                            ha="center", va="center", zorder=3)

    plt.tight_layout()
    plt.savefig(output_path, dpi=180, bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()
    print(f"K-Map visual saved to {output_path}")


def get_kmap_matrix():
    """Returns the full 4x4 interactive K-Map grid with minterm metadata, literal terms, and prime implicant groups."""
    gray_code = ["00", "01", "11", "10"]
    cells = []
    for r_idx, ab in enumerate(gray_code):
        a = int(ab[0])
        b = int(ab[1])
        row_cells = []
        for c_idx, cd in enumerate(gray_code):
            c = int(cd[0])
            d = int(cd[1])
            minterm = (a << 3) | (b << 2) | (c << 1) | d
            res = evaluate_logic(a, b, c, d, 0)
            sa = "A" if a else "A'"
            sb = "B" if b else "B'"
            sc = "C" if c else "C'"
            sd = "D" if d else "D'"
            term_str = f"{sa} · {sb} · {sc} · {sd}"

            loops_reject = []
            if d == 1:
                loops_reject.append("loop-d")  # Loop 1: D=1 (Octet)
            if a == 0 and b == 0:
                loops_reject.append("loop-ab")  # Loop 2: A'B' (Quad)

            loops_approve = []
            if a == 1 and b == 1 and c == 1 and d == 0:
                loops_approve.append("loop-app")

            loops_review = []
            if res["REVIEW"] == 1:
                # Minimal prime implicants for REVIEW:
                # Group 1: A · B' · D' (cells m08, m10)
                if a == 1 and b == 0 and d == 0:
                    loops_review.append("loop-rev1")
                # Group 2: A' · B · D' (cells m04, m06)
                if a == 0 and b == 1 and d == 0:
                    loops_review.append("loop-rev2")
                # Group 3: B · C' · D' (cells m04, m12)
                if b == 1 and c == 0 and d == 0:
                    loops_review.append("loop-rev3")

            cell_info = {
                "r": r_idx,
                "c": c_idx,
                "ab": ab,
                "cd": cd,
                "A": a,
                "B": b,
                "C": c,
                "D": d,
                "minterm": minterm,
                "tt_rows": [minterm * 2, minterm * 2 + 1],
                "APPROVE": res["APPROVE"],
                "REJECT": res["REJECT"],
                "REVIEW": res["REVIEW"],
                "literal": term_str,
                "loops": {
                    "APPROVE": loops_approve,
                    "REJECT": loops_reject,
                    "REVIEW": loops_review
                }
            }
            row_cells.append(cell_info)
        cells.append(row_cells)

    return {
        "gray_code": gray_code,
        "cells": cells,
        "formulas": {
            "APPROVE": "A · B · C · D'",
            "REJECT": "D + A' · B'",
            "REVIEW": "(A · B' · D') + (A' · B · D') + (B · C' · D')"
        }
    }


def solve_custom_kmap(minterm_indices: list):
    """Calculates minimal SOP and POS for any user-selected minterms in 4 variables."""
    A, B, C, D = symbols('A B C D')
    var_list = [A, B, C, D]
    
    minterm_tuples = []
    for m in minterm_indices:
        try:
            m_int = int(m)
            if 0 <= m_int <= 15:
                a = (m_int >> 3) & 1
                b = (m_int >> 2) & 1
                c = (m_int >> 1) & 1
                d = m_int & 1
                minterm_tuples.append((a, b, c, d))
        except (ValueError, TypeError):
            continue
            
    if not minterm_tuples:
        return {"sop": "0", "minterms": []}
    if len(minterm_tuples) == 16:
        return {"sop": "1", "minterms": list(range(16))}

    sop_expr = SOPform(var_list, minterm_tuples)
    return {
        "sop": str(sop_expr),
        "minterms": minterm_indices,
        "num_minterms": len(minterm_tuples)
    }


def normalize_bool_expr(s: str) -> str:
    """Normalizes student or textbook Boolean expression notation to SymPy syntax."""
    import re
    if not s or not str(s).strip():
        return "False"
    s = str(s).strip()
    s = s.replace("·", " & ").replace("*", " & ").replace("•", " & ")
    s = s.replace("+", " | ")
    s = re.sub(r'\bAND\b', ' & ', s, flags=re.IGNORECASE)
    s = re.sub(r'\bOR\b', ' | ', s, flags=re.IGNORECASE)
    s = re.sub(r'\bNOT\b', ' ~', s, flags=re.IGNORECASE)
    s = s.replace("!", "~")
    # Convert postfix prime for variables e.g. A' -> ~A
    s = re.sub(r'([A-Za-z0-9_]+)\'', r'~(\1)', s)
    # Convert parenthesized prime e.g. (A & B)' -> ~(A & B)
    while True:
        new_s = re.sub(r'(\([^()]+\))\'', r'~(\1)', s)
        if new_s == s:
            break
        s = new_s
    return s



def verify_boolean_equivalence(expr1_str: str, expr2_str: str):
    """
    Formally checks if two Boolean expressions are mathematically equivalent.
    Returns equivalence status, minimal SOP forms, and diagnostic info.
    """
    from sympy.parsing.sympy_parser import parse_expr
    from sympy.logic.boolalg import simplify_logic, Equivalent
    try:
        norm1 = normalize_bool_expr(expr1_str)
        norm2 = normalize_bool_expr(expr2_str)
        p1 = parse_expr(norm1)
        p2 = parse_expr(norm2)

        simp1 = simplify_logic(p1)
        simp2 = simplify_logic(p2)

        is_equiv = bool(simplify_logic(Equivalent(p1, p2)) == True)
        return {
            "success": True,
            "equivalent": is_equiv,
            "expr1_normalized": str(p1),
            "expr2_normalized": str(p2),
            "expr1_simplified": str(simp1),
            "expr2_simplified": str(simp2),
            "message": "Expressions are mathematically equivalent!" if is_equiv else "Expressions are NOT equivalent."
        }
    except Exception as e:
        return {
            "success": False,
            "equivalent": False,
            "error": f"Parse or evaluation error: {str(e)}"
        }


if __name__ == "__main__":
    generate_truth_table_csv()
    results = simplify_and_verify()
    print(results)
    render_kmap_image()


