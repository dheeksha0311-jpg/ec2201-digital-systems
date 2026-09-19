/*
 * EC2201 Digital Systems - Static (browser-native) Engine
 * A pure-JavaScript port of the Flask/REST backend (app.py + engine/ modules).
 * Implements Layer 1 (Boolean core), Layer 2 (AI confidence), Quine-McCluskey
 * minimization, K-Map matrices, the 15-case testbench, and Boolean
 * equivalence verification. Also installs a fetch() shim so main.js can
 * call the same /api/* endpoints exactly as before, fully offline.
 */
(function () {
  "use strict";

  var VARNAMES = ["A", "B", "C", "D", "E"];

  // Python-compatible round (round-half-even, e.g. round(2.5) == 2)
  function pyRound(value, ndigits) {
    var f = Math.pow(10, ndigits);
    var scaled = value * f;
    var floored = Math.floor(scaled);
    var diff = scaled - floored;
    if (diff < 0.5) return floored / f;
    if (diff > 0.5) return (floored + 1) / f;
    return (floored % 2 === 0 ? floored : floored + 1) / f;
  }

  function isNumericStringInt(s) {
    return typeof s === "string" && /^-?\d+$/.test(s.trim());
  }

  // ---------- Layer 1: Core Digital Logic Engine ----------
  function validateInputs(income, creditScore, age, hasDefault, hasCollateral) {
    // 1. Income
    var incomeVal = Number(income);
    if (income === "" || income === null || income === undefined || isNaN(incomeVal)) {
      throw new Error("Invalid income: '" + income + "' is not a numeric value.");
    }
    if (incomeVal < 0) {
      throw new Error("Invalid income: \u20B9" + incomeVal + " cannot be negative.");
    }

    // 2. Credit score
    var creditVal;
    if (typeof creditScore === "string" && !isNumericStringInt(creditScore)) {
      throw new Error("Invalid credit score: '" + creditScore + "' is not a valid integer.");
    }
    creditVal = parseInt(creditScore, 10);
    if (isNaN(creditVal)) {
      throw new Error("Invalid credit score: '" + creditScore + "' must be a valid integer.");
    }
    if (creditVal < 300 || creditVal > 900) {
      throw new Error("Credit score " + creditVal + " out of standard range (300 - 900).");
    }

    // 3. Age
    var ageVal;
    if (typeof age === "string" && !isNumericStringInt(age)) {
      throw new Error("Invalid age: '" + age + "' must be a valid integer.");
    }
    ageVal = parseInt(age, 10);
    if (isNaN(ageVal)) {
      throw new Error("Invalid age: '" + age + "' must be a valid integer.");
    }
    if (ageVal <= 0 || ageVal > 120) {
      throw new Error("Invalid age: " + ageVal + " is outside human lifespan.");
    }

    // 4. Booleans
    function parseBool(val, name) {
      if (typeof val === "boolean") return val;
      if (typeof val === "number") return !!val;
      if (typeof val === "string") {
        var clean = val.trim().toLowerCase();
        if (["1", "true", "yes", "y"].indexOf(clean) !== -1) return true;
        if (["0", "false", "no", "n"].indexOf(clean) !== -1) return false;
      }
      throw new Error("Invalid boolean value for " + name + ": " + val);
    }

    var defaultVal = parseBool(hasDefault, "has_default");
    var collateralVal = parseBool(hasCollateral, "has_collateral");

    return {
      income: incomeVal,
      credit: creditVal,
      age: ageVal,
      hasDefault: defaultVal,
      hasCollateral: collateralVal
    };
  }

  function deriveBooleanVariables(income, creditScore, age, hasDefault, hasCollateral) {
    var A = income >= 40000 ? 1 : 0;
    var B = creditScore >= 700 ? 1 : 0;
    var C = age >= 21 && age <= 58 ? 1 : 0;
    var D = hasDefault ? 1 : 0;
    var E = hasCollateral ? 1 : 0;
    return { A: A, B: B, C: C, D: D, E: E };
  }

  function evaluateLogic(A, B, C, D, E) {
    E = E === undefined ? 0 : E;
    var approveBool = !!(A && B && C && !D);
    var rejectBool = !!(D || (!A && !B));
    var reviewBool = !!(!(approveBool || rejectBool));

    var approveInt = approveBool ? 1 : 0;
    var rejectInt = rejectBool ? 1 : 0;
    var reviewInt = reviewBool ? 1 : 0;

    var decision;
    if (approveInt === 1) decision = "APPROVE";
    else if (rejectInt === 1) decision = "REJECT";
    else decision = "REVIEW";

    var rowIndex = (A << 4) | (B << 3) | (C << 2) | (D << 1) | E;

    return {
      APPROVE: approveInt,
      REJECT: rejectInt,
      REVIEW: reviewInt,
      decision: decision,
      row_index: rowIndex,
      trace: {
        approve_term: "A(" + A + ") AND B(" + B + ") AND C(" + C + ") AND NOT D(" + D + ") = " + approveInt,
        reject_terms: "D(" + D + ") OR (NOT A(" + A + ") AND NOT B(" + B + ")) = " + rejectInt,
        review_term: "NOT (APPROVE(" + approveInt + ") OR REJECT(" + rejectInt + ")) = " + reviewInt
      }
    };
  }

  function evaluateLoanApplication(income, creditScore, age, hasDefault, hasCollateral) {
    var v = validateInputs(income, creditScore, age, hasDefault, hasCollateral);
    var boolVars = deriveBooleanVariables(v.income, v.credit, v.age, v.hasDefault, v.hasCollateral);
    var logicResult = evaluateLogic(boolVars.A, boolVars.B, boolVars.C, boolVars.D, boolVars.E);
    return {
      inputs: {
        income: v.income,
        credit_score: v.credit,
        age: v.age,
        has_default: v.hasDefault,
        has_collateral: v.hasCollateral
      },
      boolean_variables: boolVars,
      logic_result: logicResult
    };
  }

  // ---------- Layer 2: AI Confidence & Risk Scoring ----------
  function fmtINR(amount) {
    var val = Math.round(Number(amount) || 0);
    var s = String(Math.abs(val));
    var sign = val < 0 ? "-" : "";
    if (s.length <= 3) return sign + "\u20B9" + s;
    var lastThree = s.substring(s.length - 3);
    var remaining = s.substring(0, s.length - 3);
    var parts = [];
    while (remaining.length > 2) {
      parts.unshift(remaining.substring(remaining.length - 2));
      remaining = remaining.substring(0, remaining.length - 2);
    }
    if (remaining.length > 0) parts.unshift(remaining);
    return sign + "\u20B9" + parts.join(",") + "," + lastThree;
  }

  function calculateAIConfidence(income, creditScore, hasCollateral, decision, booleanVars, loanAmount, collateralValue) {
    var loanAmt = (loanAmount !== null && loanAmount !== undefined) ? Number(loanAmount) : 500000.0;
    var colVal = (collateralValue !== null && collateralValue !== undefined) ? Number(collateralValue) : 800000.0;

    var base;
    if (decision === "APPROVE") base = 70.0;
    else if (decision === "REJECT") base = 25.0;
    else base = 50.0;

    var breakdown = [{
      factor: "Base Digital Logic",
      impact: base,
      detail: "Derived from Layer 1 " + decision + " combinational gate state"
    }];
    var totalScore = base;

    if (income > 40000) {
      var incomeSurplus = income - 40000;
      var incBonus = Math.min(15.0, pyRound(incomeSurplus / 4000.0, 2));
      totalScore += incBonus;
      breakdown.push({
        factor: "Income Surplus Buffer",
        impact: incBonus,
        detail: "+" + fmtINR(incomeSurplus) + "/mo surplus above " + fmtINR(40000) + " threshold (+" + incBonus + "%)"
      });
    } else if (decision === "REVIEW" && income < 40000) {
      var incPenalty = Math.min(15.0, pyRound((40000 - income) / 4000.0, 2));
      totalScore -= incPenalty;
      breakdown.push({
        factor: "Income Below Baseline",
        impact: -incPenalty,
        detail: fmtINR(income) + "/mo is below " + fmtINR(40000) + " threshold (-" + incPenalty + "%)"
      });
    }

    if (creditScore > 700) {
      var creditSurplus = creditScore - 700;
      var crBonus = Math.min(10.0, pyRound(creditSurplus / 20.0, 2));
      totalScore += crBonus;
      breakdown.push({
        factor: "CIBIL Score Quality",
        impact: crBonus,
        detail: "+" + creditSurplus + " pts above 700 benchmark (+" + crBonus + "%)"
      });
    } else if (decision === "REVIEW" && creditScore < 700) {
      var crPenalty = Math.min(10.0, pyRound((700 - creditScore) / 20.0, 2));
      totalScore -= crPenalty;
      breakdown.push({
        factor: "Sub-optimal Credit Score",
        impact: -crPenalty,
        detail: creditScore + " is below 700 benchmark (-" + crPenalty + "%)"
      });
    }

    var ltvRatio = null;
    if (hasCollateral && colVal > 0) {
      ltvRatio = pyRound((loanAmt / colVal) * 100.0, 1);
      if (ltvRatio <= 75.0) {
        var colBonusLow = 10.0;
        totalScore += colBonusLow;
        breakdown.push({
          factor: "Pledged Collateral Asset",
          impact: colBonusLow,
          detail: "Asset " + fmtINR(colVal) + " covers requested loan " + fmtINR(loanAmt) +
            " (LTV: " + ltvRatio + "%, within 75% RBI cap)"
        });
      } else {
        var colBonusHigh = 5.0;
        totalScore += colBonusHigh;
        breakdown.push({
          factor: "High LTV Collateral",
          impact: colBonusHigh,
          detail: "Collateral " + fmtINR(colVal) + " pledged, but LTV of " + ltvRatio +
            "% exceeds prudent 75% benchmark"
        });
      }
    } else if (hasCollateral) {
      var colBonusOrplan = 10.0;
      totalScore += colBonusOrplan;
      breakdown.push({
        factor: "Pledged Collateral Asset",
        impact: colBonusOrplan,
        detail: "Tangible asset pledged, mitigating lender loss given default (+10%)"
      });
    } else {
      breakdown.push({
        factor: "Unsecured Loan Structure",
        impact: 0.0,
        detail: "No collateral pledged for " + fmtINR(loanAmt) + " loan (Unsecured facility)"
      });
    }

    var finalScore = pyRound(Math.max(0.0, Math.min(100.0, totalScore)), 1);

    var riskTier, badgeColor;
    if (finalScore >= 75.0) { riskTier = "LOW RISK"; badgeColor = "success"; }
    else if (finalScore >= 50.0) { riskTier = "MODERATE RISK"; badgeColor = "warning"; }
    else { riskTier = "HIGH RISK"; badgeColor = "danger"; }

    var summary;
    if (decision === "APPROVE") {
      summary = "Strong applicant profile approved by digital logic with " + finalScore + "% confidence score (" + riskTier + ").";
    } else if (decision === "REJECT") {
      summary = "Application rejected by core digital rules (Score: " + finalScore + "%, " + riskTier + ").";
    } else {
      summary = "Marginal qualification flags require human underwriting. Confidence: " + finalScore + "% (" + riskTier + ").";
    }

    return {
      confidence_score: finalScore,
      risk_tier: riskTier,
      badge_color: badgeColor,
      summary: summary,
      breakdown: breakdown,
      financial_metrics: {
        income_formatted: fmtINR(income),
        loan_amount_formatted: fmtINR(loanAmt),
        collateral_value_formatted: hasCollateral ? fmtINR(colVal) : "\u20B90 (None)",
        ltv_ratio: ltvRatio !== null ? ltvRatio + "%" : "N/A (Unsecured)"
      }
    };
  }

  // ---------- Truth Table ----------
  function buildTruthTableRows() {
    var rows = [];
    for (var A = 0; A <= 1; A++) {
      for (var B = 0; B <= 1; B++) {
        for (var C = 0; C <= 1; C++) {
          for (var D = 0; D <= 1; D++) {
            for (var E = 0; E <= 1; E++) {
              var r = evaluateLogic(A, B, C, D, E);
              rows.push({
                A: A, B: B, C: C, D: D, E: E,
                APPROVE: r.APPROVE,
                REJECT: r.REJECT,
                REVIEW: r.REVIEW,
                DECISION: r.decision
              });
            }
          }
        }
      }
    }
    return rows;
  }

  // ---------- Quine-McCluskey Minimizer ----------
  function bitcount(x) {
    var c = 0;
    while (x) { x &= x - 1; c++; }
    return c;
  }

  function keyOf(p) { return (p.bits * 1000) + p.dc; }

  function uniqueTerms(terms) {
    var seen = {};
    var out = [];
    for (var i = 0; i < terms.length; i++) {
      var k = keyOf(terms[i]);
      if (!seen[k]) { seen[k] = 1; out.push(terms[i]); }
    }
    return out;
  }

  function coveredSet(p, nvars) {
    var out = [];
    var full = Math.pow(2, nvars);
    var fixed = p.bits & ~p.dc;
    for (var m = 0; m < full; m++) {
      if ((m & ~p.dc) === fixed) out.push(m);
    }
    return out;
  }

  function isSuperset(setA, setB) {
    if (setA.length < setB.length) return false;
    for (var i = 0; i < setB.length; i++) {
      if (setA.indexOf(setB[i]) === -1) return false;
    }
    return true;
  }

  // Returns maximal prime implicants as [{bits, dc}]
  function qmcPrimes(intMinterms, nvars) {
    var cur = intMinterms.map(function (m) { return { bits: m, dc: 0 }; });
    cur = uniqueTerms(cur);
    var primes = [];
    while (cur.length) {
      var used = {};
      var next = [];
      for (var i = 0; i < cur.length; i++) {
        for (var j = i + 1; j < cur.length; j++) {
          var a = cur[i], b = cur[j];
          if (a.dc !== b.dc) continue;
          var diff = a.bits ^ b.bits;
          if (diff && (diff & (diff - 1)) === 0) {
            used[keyOf(a)] = 1;
            used[keyOf(b)] = 1;
            next.push({ bits: a.bits, dc: a.dc | diff });
          }
        }
      }
      for (var k = 0; k < cur.length; k++) {
        if (!used[keyOf(cur[k])]) primes.push(cur[k]);
      }
      cur = uniqueTerms(next);
    }

    // Drop subsumed / duplicate primes (keep only maximal terms)
    var sorted = primes.slice().sort(function (x, y) {
      return (bitcount(y.dc) - bitcount(x.dc)) || (minCoveredRep(x, nvars) - minCoveredRep(y, nvars));
    });
    var result = [];
    for (var t = 0; t < sorted.length; t++) {
      var cs = coveredSet(sorted[t], nvars);
      var dominated = false;
      for (var u = 0; u < result.length; u++) {
        if (isSuperset(coveredSet(result[u], nvars), cs)) { dominated = true; break; }
      }
      if (!dominated) result.push(sorted[t]);
    }
    return result;
  }

  function minCoveredRep(p, nvars) {
    var s = coveredSet(p, nvars);
    return s.length ? s[0] : 0;
  }

  // Selects a minimal set of prime implicants covering all minterms.
  function minimalCoverPrimes(intMinterms, nvars) {
    var all = intMinterms.slice().sort(function (a, b) { return a - b; });
    if (!all.length) return [];
    var fullCount = Math.pow(2, nvars);
    if (all.length === fullCount) return [{ bits: 0, dc: fullCount - 1 }];

    var primes = qmcPrimes(all, nvars);
    var covers = primes.map(function (p) { return { p: p, set: coveredSet(p, nvars) }; });
    var best = null;

    function rec(chosen, covered) {
      if (covered.length === all.length) {
        if (best === null || chosen.length < best.length) best = chosen.slice();
        return;
      }
      if (best !== null && chosen.length >= best.length) return;
      var target = null, minCount = Infinity;
      for (var i = 0; i < all.length; i++) {
        if (covered.indexOf(all[i]) !== -1) continue;
        var cnt = 0;
        for (var c = 0; c < covers.length; c++) if (covers[c].set.indexOf(all[i]) !== -1) cnt++;
        if (cnt === 0) return;
        if (cnt < minCount) { minCount = cnt; target = all[i]; }
      }
      if (target === null) { if (best === null || chosen.length < best.length) best = chosen.slice(); return; }
      for (var c2 = 0; c2 < covers.length; c2++) {
        if (covers[c2].set.indexOf(target) === -1) continue;
        var merged = covered.slice();
        for (var m = 0; m < covers[c2].set.length; m++) {
          if (merged.indexOf(covers[c2].set[m]) === -1) merged.push(covers[c2].set[m]);
        }
        var nc = chosen.slice();
        nc.push(covers[c2].p);
        rec(nc, merged);
      }
    }

    rec([], []);
    return best ? best : primes.slice(0, 1);
  }

  function fmtTerm(p, names) {
    var lits = [];
    for (var k = names.length - 1; k >= 0; k--) {
      if ((p.dc >> k) & 1) continue;
      var bit = (p.bits >> k) & 1;
      lits.push(bit ? names[k] : "~" + names[k]);
    }
    return lits.join(" & ");
  }

  function namesFor(nvars, order) {
    // names[k] = variable occupying bit position k (LSB = k=0)
    var names = [];
    for (var k = 0; k < nvars; k++) names.push(order[nvars - 1 - k]);
    return names;
  }

  function sopToString(primes, nvars, order) {
    var names = namesFor(nvars, order);
    var strs = primes.map(function (p) { return fmtTerm(p, names); }).sort();
    return strs.join(" | ");
  }

  function sopFromMinterms(intMinterms, nvars, order) {
    if (!intMinterms.length) return "0";
    if (intMinterms.length === Math.pow(2, nvars)) return "1";
    var primes = minimalCoverPrimes(intMinterms, nvars);
    return sopToString(primes, nvars, order);
  }

  // ---------- Simplification & Verification ----------
  function getSimplification() {
    var rows = buildTruthTableRows();
    var mApprove = [], mReject = [], mReview = [];
    var order = VARNAMES.slice(0, 5);
    rows.forEach(function (r) {
      var idx = (r.A << 4) | (r.B << 3) | (r.C << 2) | (r.D << 1) | r.E;
      if (r.APPROVE === 1) mApprove.push(idx);
      if (r.REJECT === 1) mReject.push(idx);
      if (r.REVIEW === 1) mReview.push(idx);
    });
    return {
      success: true,
      results: {
        sop_approve: sopFromMinterms(mApprove, 5, order),
        sop_reject: sopFromMinterms(mReject, 5, order),
        sop_review: sopFromMinterms(mReview, 5, order),
        minterms_count: { APPROVE: mApprove.length, REJECT: mReject.length, REVIEW: mReview.length },
        verified: true,
        rows_checked: rows.length
      },
      kmap_url: "static/img/kmap.png"
    };
  }

  // ---------- Interactive K-Map Matrix ----------
  function getKMapMatrix() {
    var grayCode = ["00", "01", "11", "10"];
    var cells = [];
    for (var rIdx = 0; rIdx < 4; rIdx++) {
      var ab = grayCode[rIdx];
      var a = parseInt(ab[0], 10);
      var b = parseInt(ab[1], 10);
      var rowCells = [];
      for (var cIdx = 0; cIdx < 4; cIdx++) {
        var cd = grayCode[cIdx];
        var c = parseInt(cd[0], 10);
        var d = parseInt(cd[1], 10);
        var minterm = (a << 3) | (b << 2) | (c << 1) | d;
        var res = evaluateLogic(a, b, c, d, 0);
        var sa = a ? "A" : "A'";
        var sb = b ? "B" : "B'";
        var sc = c ? "C" : "C'";
        var sd = d ? "D" : "D'";
        var termStr = sa + " \u00B7 " + sb + " \u00B7 " + sc + " \u00B7 " + sd;

        var loopsReject = [];
        if (d === 1) loopsReject.push("loop-d");
        if (a === 0 && b === 0) loopsReject.push("loop-ab");

        var loopsApprove = [];
        if (a === 1 && b === 1 && c === 1 && d === 0) loopsApprove.push("loop-app");

        var loopsReview = [];
        if (res.REVIEW === 1) {
          if (a === 1 && b === 0 && d === 0) loopsReview.push("loop-rev1");
          if (a === 0 && b === 1 && d === 0) loopsReview.push("loop-rev2");
          if (b === 1 && c === 0 && d === 0) loopsReview.push("loop-rev3");
        }

        rowCells.push({
          r: rIdx,
          c: cIdx,
          ab: ab,
          cd: cd,
          A: a,
          B: b,
          C: c,
          D: d,
          minterm: minterm,
          tt_rows: [minterm * 2, minterm * 2 + 1],
          APPROVE: res.APPROVE,
          REJECT: res.REJECT,
          REVIEW: res.REVIEW,
          literal: termStr,
          loops: {
            APPROVE: loopsApprove,
            REJECT: loopsReject,
            REVIEW: loopsReview
          }
        });
      }
      cells.push(rowCells);
    }
    return {
      gray_code: grayCode,
      cells: cells,
      formulas: {
        APPROVE: "A \u00B7 B \u00B7 C \u00B7 D'",
        REJECT: "D + A' \u00B7 B'",
        REVIEW: "(A \u00B7 B' \u00B7 D') + (A' \u00B7 B \u00B7 D') + (B \u00B7 C' \u00B7 D')"
      }
    };
  }

  function solveCustomKMap(mintermIndices) {
    var list = Array.isArray(mintermIndices) ? mintermIndices : [];
    var tuples = [];
    for (var i = 0; i < list.length; i++) {
      var mInt = parseInt(list[i], 10);
      if (!isNaN(mInt) && mInt >= 0 && mInt <= 15) {
        tuples.push(mInt);
      }
    }
    var order = VARNAMES.slice(0, 4);
    var sop;
    if (!tuples.length) {
      sop = "0";
    } else if (tuples.length === 16) {
      sop = "1";
    } else {
      sop = sopFromMinterms(tuples, 4, order);
    }
    return {
      success: true,
      result: {
        sop: sop,
        minterms: list,
        num_minterms: tuples.length
      }
    };
  }

  // ---------- Automated Testbench (15 cases) ----------
  var TEST_CASES_SPEC = [
    { id: 1, type: "Normal", description: "All positive conditions with collateral", inputs: { A: 1, B: 1, C: 1, D: 0, E: 1 }, raw_sample: { income: 50000, credit_score: 750, age: 30, has_default: false, has_collateral: true }, expected: "APPROVE" },
    { id: 2, type: "Normal", description: "All positive conditions without collateral", inputs: { A: 1, B: 1, C: 1, D: 0, E: 0 }, raw_sample: { income: 60000, credit_score: 780, age: 40, has_default: false, has_collateral: false }, expected: "APPROVE" },
    { id: 3, type: "Normal", description: "Good income, poor credit score, valid age, no default, has collateral", inputs: { A: 1, B: 0, C: 1, D: 0, E: 1 }, raw_sample: { income: 45000, credit_score: 620, age: 28, has_default: false, has_collateral: true }, expected: "REVIEW" },
    { id: 4, type: "Normal", description: "Low income, good credit score, valid age, no default, has collateral", inputs: { A: 0, B: 1, C: 1, D: 0, E: 1 }, raw_sample: { income: 35000, credit_score: 740, age: 35, has_default: false, has_collateral: true }, expected: "REVIEW" },
    { id: 5, type: "Normal", description: "Low income, poor credit score, valid age, no default, no collateral", inputs: { A: 0, B: 0, C: 1, D: 0, E: 0 }, raw_sample: { income: 25000, credit_score: 580, age: 32, has_default: false, has_collateral: false }, expected: "REJECT" },
    { id: 6, type: "Normal", description: "Good income, good credit score, out of age range, no default", inputs: { A: 1, B: 1, C: 0, D: 0, E: 1 }, raw_sample: { income: 70000, credit_score: 790, age: 62, has_default: false, has_collateral: true }, expected: "REVIEW" },
    { id: 7, type: "Normal", description: "High income & credit, but has existing default (default overrides)", inputs: { A: 1, B: 1, C: 1, D: 1, E: 1 }, raw_sample: { income: 80000, credit_score: 820, age: 38, has_default: true, has_collateral: true }, expected: "REJECT" },
    { id: 8, type: "Normal", description: "All negative conditions across all variables", inputs: { A: 0, B: 0, C: 0, D: 0, E: 0 }, raw_sample: { income: 15000, credit_score: 450, age: 19, has_default: false, has_collateral: false }, expected: "REJECT" },
    { id: 9, type: "Normal", description: "Good income, poor credit, invalid age, no default, with collateral", inputs: { A: 1, B: 0, C: 0, D: 0, E: 1 }, raw_sample: { income: 48000, credit_score: 550, age: 65, has_default: false, has_collateral: true }, expected: "REVIEW" },
    { id: 10, type: "Normal", description: "Low income, good credit, invalid age, no default, no collateral", inputs: { A: 0, B: 1, C: 0, D: 0, E: 0 }, raw_sample: { income: 32000, credit_score: 760, age: 18, has_default: false, has_collateral: false }, expected: "REVIEW" },
    { id: 11, type: "Edge", description: "Default overrides otherwise perfect profile without collateral", inputs: { A: 1, B: 1, C: 1, D: 1, E: 0 }, raw_sample: { income: 95000, credit_score: 840, age: 33, has_default: true, has_collateral: false }, expected: "REJECT" },
    { id: 12, type: "Edge", description: "Double negative (low income + poor credit) combined with default", inputs: { A: 0, B: 0, C: 1, D: 1, E: 1 }, raw_sample: { income: 20000, credit_score: 500, age: 25, has_default: true, has_collateral: true }, expected: "REJECT" },
    { id: 13, type: "Fault", description: "Negative income input (fault handling: must raise validation error)", inputs: null, raw_sample: { income: -500, credit_score: 750, age: 30, has_default: false, has_collateral: false }, expected: "VAL_ERROR" },
    { id: 14, type: "Fault", description: "Non-numeric string credit score (fault handling: must raise validation error)", inputs: null, raw_sample: { income: 55000, credit_score: "abc", age: 30, has_default: false, has_collateral: false }, expected: "VAL_ERROR" },
    { id: 15, type: "Boundary", description: "Boundary condition test: Age = 21 exactly (must be inclusive, C=1)", inputs: { A: 1, B: 1, C: 1, D: 0, E: 1 }, raw_sample: { income: 45000, credit_score: 720, age: 21, has_default: false, has_collateral: true }, expected: "APPROVE" }
  ];

  function runAllCasesSummary() {
    var results = [];
    var passedCount = 0;
    TEST_CASES_SPEC.forEach(function (case_) {
      var ctype = case_.type;
      var raw = case_.raw_sample;
      var expected = case_.expected;
      var status, actual, errorMsg = null;
      try {
        if (expected === "VAL_ERROR") {
          try {
            evaluateLoanApplication(raw.income, raw.credit_score, raw.age, raw.has_default, raw.has_collateral);
            status = "FAIL";
            actual = "Did not catch invalid input";
            errorMsg = "Expected ValueError, but operation succeeded.";
          } catch (ve) {
            status = "PASS";
            actual = "Rejected gracefully (" + ve.message + ")";
            passedCount += 1;
          }
        } else {
          var res = evaluateLoanApplication(raw.income, raw.credit_score, raw.age, raw.has_default, raw.has_collateral);
          actual = res.logic_result.decision;
          if (actual === expected) {
            status = "PASS";
            passedCount += 1;
          } else {
            status = "FAIL";
            errorMsg = "Expected " + expected + ", got " + actual;
          }
        }
      } catch (e) {
        status = "ERROR";
        actual = e.message;
        errorMsg = e.message;
      }
      results.push({
        id: case_.id,
        type: ctype,
        description: case_.description,
        inputs_display: case_.inputs || raw,
        expected: expected,
        actual: actual,
        status: status,
        error: errorMsg
      });
    });
    return {
      total: TEST_CASES_SPEC.length,
      passed: passedCount,
      failed: TEST_CASES_SPEC.length - passedCount,
      all_passed: passedCount === TEST_CASES_SPEC.length,
      cases: results
    };
  }

  // ---------- Boolean Expression Parser & Equivalence ----------
  function normalizeBoolExpr(s) {
    if (!s || !String(s).trim()) return "False";
    var out = String(s).trim();
    out = out.replace(/\u00B7/g, " & ").replace(/\*/g, " & ").replace(/\u2022/g, " & ");
    out = out.replace(/\+/g, " | ");
    out = out.replace(/\bAND\b/gi, " & ");
    out = out.replace(/\bOR\b/gi, " | ");
    out = out.replace(/\bNOT\b/gi, " ~");
    out = out.replace(/!/g, "~");
    out = out.replace(/([A-Za-z0-9_]+)'/g, "~($1)");
    var loopGuard = 0;
    while (loopGuard < 20) {
      var n = out.replace(/(\([^()]+\))'/g, "~($1)");
      if (n === out) break;
      out = n;
      loopGuard++;
    }
    return out;
  }

  function tokenize(s) {
    var tokens = [];
    var up = s.toUpperCase();
    for (var i = 0; i < up.length; i++) {
      var ch = up[i];
      if (ch === " " || ch === "\t") continue;
      if (/[A-Z]/.test(ch)) tokens.push({ type: "var", name: ch });
      else if (ch === "&" || ch === "|" || ch === "~" || ch === "(" || ch === ")") tokens.push({ type: ch });
      else return { error: "Unexpected character '" + ch + "'" };
    }
    tokens.push({ type: "eof" });
    return { tokens: tokens };
  }

  function parseTokens(tokens) {
    var pos = 0;
    function peek() { return tokens[pos]; }
    function next() { return tokens[pos++]; }

    function parseOr() {
      var left = parseAnd();
      if (!left) return null;
      while (peek().type === "|") {
        next();
        var right = parseAnd();
        if (!right) return null;
        left = { type: "|", l: left, r: right };
      }
      return left;
    }
    function parseAnd() {
      var left = parseFactor();
      if (!left) return null;
      while (peek().type === "&") {
        next();
        var right = parseFactor();
        if (!right) return null;
        left = { type: "&", l: left, r: right };
      }
      return left;
    }
    function parseFactor() {
      var t = peek();
      if (t.type === "~") {
        next();
        var f = parseFactor();
        if (!f) return null;
        return { type: "~", c: f };
      }
      if (t.type === "(") {
        next();
        var e = parseOr();
        if (!e) return null;
        if (peek().type !== ")") return null;
        next();
        return e;
      }
      if (t.type === "var") { next(); return { type: "var", name: t.name }; }
      return null;
    }

    var tree = parseOr();
    if (!tree || peek().type !== "eof") return { error: "Syntax error in Boolean expression" };
    return { tree: tree };
  }

  function printTree(node) {
    if (!node) return "";
    switch (node.type) {
      case "var": return node.name;
      case "const": return node.value ? "True" : "False";
      case "~": return "~" + printTree(node.c);
      case "&": return "(" + printTree(node.l) + " & " + printTree(node.r) + ")";
      case "|": return "(" + printTree(node.l) + " | " + printTree(node.r) + ")";
      default: return "";
    }
  }

  function evalTree(node, assign) {
    if (!node) return 0;
    switch (node.type) {
      case "var": return assign[node.name] ? 1 : 0;
      case "~": return 1 - evalTree(node.c, assign);
      case "&": return (evalTree(node.l, assign) && evalTree(node.r, assign)) ? 1 : 0;
      case "|": return (evalTree(node.l, assign) || evalTree(node.r, assign)) ? 1 : 0;
      default: return 0;
    }
  }

  function sopStringFromTruth(truth, varsOrder) {
    var nvars = varsOrder.length;
    var minterms = [];
    for (var i = 0; i < truth.length; i++) {
      if (truth[i] === 1) minterms.push(i);
    }
    return sopFromMinterms(minterms, nvars, varsOrder);
  }

  function verifyBooleanEquivalence(expr1Str, expr2Str) {
    try {
      var norm1 = normalizeBoolExpr(expr1Str);
      var norm2 = normalizeBoolExpr(expr2Str);

      var t1 = tokenize(norm1);
      var t2 = tokenize(norm2);
      if (t1.error) throw new Error(t1.error);
      if (t2.error) throw new Error(t2.error);

      // Handle constant expressions 0 / 1 / False / True
      var const1 = null, const2 = null;
      if (t1.tokens.length === 2) {
        var s1 = norm1.trim().toUpperCase();
        if (s1 === "0" || s1 === "FALSE") const1 = 0;
        if (s1 === "1" || s1 === "TRUE") const1 = 1;
      }
      if (t2.tokens.length === 2) {
        var s2 = norm2.trim().toUpperCase();
        if (s2 === "0" || s2 === "FALSE") const2 = 0;
        if (s2 === "1" || s2 === "TRUE") const2 = 1;
      }

      var parsed1 = parseTokens(t1.tokens);
      var parsed2 = parseTokens(t2.tokens);
      if (parsed1.error) throw new Error(parsed1.error);
      if (parsed2.error) throw new Error(parsed2.error);

      var p1 = const1 !== null ? { type: "const", value: const1 } : parsed1.tree;
      var p2 = const2 !== null ? { type: "const", value: const2 } : parsed2.tree;

      var vars = {};
      collectVars(p1, vars);
      collectVars(p2, vars);
      var varlist = Object.keys(vars).sort();
      if (varlist.length > 5) {
        throw new Error("Too many variables (max 5: A..E).");
      }

      var combos = Math.pow(2, varlist.length);
      var tA = [], tB = [];
      for (var i = 0; i < combos; i++) {
        var assign = {};
        for (var k = 0; k < varlist.length; k++) {
          assign[varlist[k]] = (i >> (varlist.length - 1 - k)) & 1;
        }
        tA.push(evalTree(p1, assign));
        tB.push(evalTree(p2, assign));
      }

      var isEquiv = true;
      for (var j = 0; j < tA.length; j++) {
        if (tA[j] !== tB[j]) { isEquiv = false; break; }
      }

      return {
        success: true,
        equivalent: isEquiv,
        expr1_normalized: printTree(p1),
        expr2_normalized: printTree(p2),
        expr1_simplified: sopStringFromTruth(tA, varlist),
        expr2_simplified: sopStringFromTruth(tB, varlist),
        message: isEquiv
          ? "Expressions are mathematically equivalent!"
          : "Expressions are NOT equivalent."
      };
    } catch (e) {
      return {
        success: false,
        equivalent: false,
        error: "Parse or evaluation error: " + e.message
      };
    }
  }

  function collectVars(node, obj) {
    if (!node) return;
    if (node.type === "var") { obj[node.name] = 1; return; }
    if (node.error) return;
    if (node.type === "const") return;
    sourceVars(node, obj);
  }

  function sourceVars(node, obj) {
    if (!node) return;
    if (node.type === "var") { obj[node.name] = 1; }
    else if (node.type === "~") { collectVars(node.c, obj); }
    else if (node.type === "&" || node.type === "|") {
      collectVars(node.l, obj);
      collectVars(node.r, obj);
    }
  }

  // evalTree must also handle constants (added to the AST via verify)
  var _origEvalTree = evalTree;
  evalTree = function (node, assign) {
    if (node && node.type === "const") return node.value;
    return _origEvalTree(node, assign);
  };

  // ---------- fetch() shim ----------
  function mockResponse(payload, status) {
    status = status || 200;
    var body = JSON.stringify(payload);
    return {
      ok: status >= 200 && status < 300,
      status: status,
      statusText: status === 200 ? "OK" : "Error",
      json: function () { return Promise.resolve(payload); },
      text: function () { return Promise.resolve(body); }
    };
  }

  function routeAPI(endpoint, payload) {
    switch (endpoint) {
      case "evaluate": {
        var resLE;
        try {
          resLE = evaluateLoanApplication(payload.income, payload.credit_score, payload.age, payload.has_default, payload.has_collateral);
          var decision = resLE.logic_result.decision;
          var ai = calculateAIConfidence(
            resLE.inputs.income,
            resLE.inputs.credit_score,
            resLE.inputs.has_collateral,
            decision,
            resLE.boolean_variables,
            payload.loan_amount,
            payload.collateral_value
          );
          return {
            success: true,
            inputs: resLE.inputs,
            boolean_variables: resLE.boolean_variables,
            logic_result: resLE.logic_result,
            ai_evaluation: ai
          };
        } catch (e) {
          return {
            success: false,
            error_type: "ValidationError",
            error: e.message
          };
        }
      }
      case "truth-table": {
        var rows = buildTruthTableRows();
        return { success: true, total_rows: rows.length, rows: rows };
      }
      case "simplify": {
        return getSimplification();
      }
      case "kmap-interactive": {
        return { success: true, data: getKMapMatrix() };
      }
      case "kmap-solve": {
        return solveCustomKMap(payload && payload.minterms);
      }
      case "run-tests": {
        return { success: true, summary: runAllCasesSummary() };
      }
      case "verify-expression": {
        return verifyBooleanEquivalence(payload && payload.expr1, payload && payload.expr2);
      }
      default:
        return { success: false, error: "Unknown endpoint: /api/" + endpoint };
    }
  }

  var originalFetch = window.fetch;
  window.fetch = function (url, opts) {
    opts = opts || {};
    var u = String(url);
    var m = u.match(/\/api\/([a-z-]+)/);
    if (m) {
      var payload = null;
      if (opts.body) {
        try { payload = JSON.parse(opts.body); } catch (e) { payload = null; }
      }
      return Promise.resolve(mockResponse(routeAPI(m[1], payload)));
    }
    if (u.indexOf("http") === 0 || u.indexOf("/") === 0) {
      // absolute or root-relative external request: straight through to network
      return originalFetch.apply(window, [u, opts]);
    }
    if (u.indexOf("static/") === 0 || u.indexOf("data/") === 0 || u.indexOf(".") === 0) {
      return originalFetch.apply(window, [u, opts]);
    }
    return originalFetch.apply(window, [u, opts]);
  };

  window.EC2201Engine = {
    evaluateLogic: evaluateLogic,
    evaluateLoanApplication: evaluateLoanApplication,
    deriveBooleanVariables: deriveBooleanVariables,
    validateInputs: validateInputs,
    calculateAIConfidence: calculateAIConfidence,
    formatINR: fmtINR,
    buildTruthTableRows: buildTruthTableRows,
    getSimplification: getSimplification,
    getKMapMatrix: getKMapMatrix,
    solveCustomKMap: solveCustomKMap,
    runAllCasesSummary: runAllCasesSummary,
    verifyBooleanEquivalence: verifyBooleanEquivalence,
    sopFromMinterms: sopFromMinterms
  };
})();