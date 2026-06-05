/**
 * FIFA 2026 Match Engine — Gaussian Variance + Logistic Win Probability
 *
 * Key changes from v1:
 * - Gaussian (Box-Muller) variance replaces uniform flat variance
 * - Standard deviation of 4 pts → extreme swings are rare (3σ ≈ 0.3%)
 * - Logistic (sigmoid) win probability amplifies large rating gaps
 * - No artificial draw forcing — draws emerge naturally from Poisson
 * - Goal lambda scaled by real strength differential (each 10 BS pts ≈ +0.5 goals)
 * - Knockout pedigree bonus raised for elite teams (BS > 80)
 * - Penalty accuracy more strongly tied to BS
 */

// ── Gaussian (Box-Muller) variance — mean=0, stddev=4 ────────────────────────
// 68% of results within ±4 pts | 95% within ±8 pts | 99.7% within ±12 pts
function gaussianVariance(stddev = 4) {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) * stddev;
}

// ── Base Strength normalisation ───────────────────────────────────────────────
// Maps raw rating (58–97) → BS in [30, 95]
export function baseStrength(rating) {
  const MIN_R = 58, MAX_R = 97;
  const MIN_BS = 30, MAX_BS = 95;
  const clamped = Math.max(MIN_R, Math.min(MAX_R, rating));
  return MIN_BS + ((clamped - MIN_R) / (MAX_R - MIN_R)) * (MAX_BS - MIN_BS);
}

// ── Performance score ─────────────────────────────────────────────────────────
function performance(bs) {
  return bs + gaussianVariance(4);
}

// ── Logistic (sigmoid) win probability ────────────────────────────────────────
// powerDiff = (bsA - bsB). Each 10 pts of BS ≈ 15% extra win probability.
// At diff=0: 50/50. At diff=+20: ~73%. At diff=+40: ~90%.
function logisticWinProb(bsA, bsB) {
  const k = 0.07; // steepness — tune higher = more dominant top teams
  return 1 / (1 + Math.exp(-k * (bsA - bsB)));
}

// ── Goal simulation (Poisson) ─────────────────────────────────────────────────
function poisson(lambda) {
  const L = Math.exp(-Math.max(0.05, lambda));
  let k = 0, p = 1;
  do { k++; p *= Math.random(); } while (p > L);
  return k - 1;
}

// ── Penalty shootout ──────────────────────────────────────────────────────────
// Accuracy more strongly tied to BS — elite teams convert better
function shootout(bsA, bsB) {
  // Range: 0.62 (BS=30) → 0.85 (BS=95) — stronger teams are noticeably better
  const accA = Math.min(0.85, 0.62 + (bsA - 30) / 200);
  const accB = Math.min(0.85, 0.62 + (bsB - 30) / 200);
  let pA = 0, pB = 0;
  for (let i = 0; i < 5; i++) {
    if (Math.random() < accA) pA++;
    if (Math.random() < accB) pB++;
  }
  let round = 0;
  while (pA === pB && round < 20) {
    if (Math.random() < accA) pA++;
    if (Math.random() < accB) pB++;
    round++;
  }
  // Final deterministic fallback — favour higher BS
  if (pA === pB) {
    if (bsA >= bsB) pA++; else pB++;
  }
  return [pA, pB];
}

// ── Match statistics helper ────────────────────────────────────────────────────
function buildStats(winProb, bsA, bsB) {
  const possA = Math.round(38 + winProb * 24 + gaussianVariance(3));
  const possB = 100 - possA;
  const shotsA = Math.round(7 + (bsA / 95) * 12 + Math.abs(gaussianVariance(2)));
  const shotsB = Math.round(7 + (bsB / 95) * 12 + Math.abs(gaussianVariance(2)));
  const sotA   = Math.round(shotsA * (0.30 + Math.random() * 0.18));
  const sotB   = Math.round(shotsB * (0.30 + Math.random() * 0.18));
  return {
    possession:    [Math.max(25, Math.min(75, possA)), Math.max(25, Math.min(75, possB))],
    shots:         [shotsA, shotsB],
    shotsOnTarget: [sotA, sotB],
    corners:       [Math.round(3 + (possA / 100) * 7 + Math.random() * 2),
                    Math.round(3 + (possB / 100) * 7 + Math.random() * 2)],
    fouls:         [Math.round(8 + Math.random() * 8), Math.round(8 + Math.random() * 8)],
  };
}

// ── Main simulation ────────────────────────────────────────────────────────────
export function simulateMatch(teamA, teamB, isKnockout = false) {
  const bsA = baseStrength(teamA.rating);
  const bsB = baseStrength(teamB.rating);

  // Logistic win probability — primary driver of outcome
  const winProb = logisticWinProb(bsA, bsB);

  // Goal lambdas: base 1.1 goals each, modulated by win probability
  // Stronger team can have λ up to ~2.3; weaker team down to ~0.5
  const lambdaA = 1.1 * (0.35 + 1.3 * winProb);
  const lambdaB = 1.1 * (0.35 + 1.3 * (1 - winProb));

  let goalsA = Math.min(poisson(lambdaA), 9);
  let goalsB = Math.min(poisson(lambdaB), 9);

  const result = {
    goalsA, goalsB,
    stats: buildStats(winProb, bsA, bsB),
    extraTime:    false,
    penalties:    false,
    penaltyScore: null,
    etGoalsA:     0,
    etGoalsB:     0,
  };

  // ── Group stage: draws emerge naturally from Poisson ─────────────────────
  // No artificial draw forcing — if goals are equal it IS a draw.
  if (!isKnockout) {
    return result;
  }

  // ── Knockout: force a winner ─────────────────────────────────────────────
  if (isKnockout && goalsA === goalsB) {
    result.extraTime = true;

    // Extra time: elite bonus — teams with BS > 80 get +8 (experience/depth)
    const eliteBonusA = bsA > 80 ? 8 : (bsA > 70 ? 4 : 0);
    const eliteBonusB = bsB > 80 ? 8 : (bsB > 70 ? 4 : 0);
    const etBsA = bsA + eliteBonusA;
    const etBsB = bsB + eliteBonusB;

    const etPa = performance(etBsA);
    const etPb = performance(etBsB);
    const etDiff = etPa - etPb;

    if (Math.abs(etDiff) > 4) {
      if (etDiff > 0) { result.etGoalsA = 1; result.goalsA += 1; }
      else            { result.etGoalsB = 1; result.goalsB += 1; }
    } else {
      result.penalties = true;
      const [pA, pB] = shootout(etBsA, etBsB);
      result.penaltyScore = [pA, pB];
    }
  }

  return result;
}

export function getMatchWinner(result, teamA, teamB) {
  if (result.penalties) {
    return result.penaltyScore[0] > result.penaltyScore[1] ? teamA : teamB;
  }
  if (result.goalsA > result.goalsB) return teamA;
  if (result.goalsB > result.goalsA) return teamB;
  return null; // group stage draw
}

export function updateMomentum(team, outcome) {
  if (team.momentum === undefined) team.momentum = 0;
  if (outcome === 'win')       team.momentum = Math.min(3,  team.momentum + 1);
  else if (outcome === 'loss') team.momentum = Math.max(-3, team.momentum - 1);
  else                         team.momentum = Math.round(team.momentum * 0.5);
}