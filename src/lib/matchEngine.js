// Dynamic match simulation engine with realism modifiers

const FORM_VALUES = ['terrible', 'poor', 'average', 'good', 'excellent'];
const FORM_MODIFIERS = { terrible: -8, poor: -4, average: 0, good: 4, excellent: 8 };

function getRandomForm() {
  const weights = [0.08, 0.17, 0.40, 0.25, 0.10];
  const r = Math.random();
  let cum = 0;
  for (let i = 0; i < weights.length; i++) {
    cum += weights[i];
    if (r <= cum) return FORM_VALUES[i];
  }
  return 'average';
}

function getUpsetModifier(ratingDiff) {
  // Bigger underdog bonus when gap is large
  if (ratingDiff > 20) return Math.random() * 12 + 5;
  if (ratingDiff > 10) return Math.random() * 8 + 3;
  if (ratingDiff > 5) return Math.random() * 5 + 1;
  return 0;
}

function getMomentumModifier(team) {
  if (!team.momentum) return 0;
  if (team.momentum >= 3) return 4;
  if (team.momentum >= 2) return 2;
  if (team.momentum >= 1) return 1;
  if (team.momentum <= -2) return -3;
  if (team.momentum <= -1) return -1;
  return 0;
}

function getKnockoutPressure(team, isKnockout) {
  if (!isKnockout) return 0;
  // Elite teams (90+) get composure bonus
  if (team.rating >= 90) return 3;
  if (team.rating >= 85) return 1;
  // Lower rated teams get slight pressure penalty
  if (team.rating < 70) return -2;
  return 0;
}

export function simulateMatch(teamA, teamB, isKnockout = false) {
  const formA = getRandomForm();
  const formB = getRandomForm();

  const ratingDiff = Math.abs(teamA.rating - teamB.rating);
  const isAStronger = teamA.rating >= teamB.rating;

  // Calculate effective ratings
  let effA = teamA.rating + FORM_MODIFIERS[formA] + getMomentumModifier(teamA) + getKnockoutPressure(teamA, isKnockout);
  let effB = teamB.rating + FORM_MODIFIERS[formB] + getMomentumModifier(teamB) + getKnockoutPressure(teamB, isKnockout);

  // Upset bonus for weaker team
  if (isAStronger) {
    effB += getUpsetModifier(ratingDiff);
  } else {
    effA += getUpsetModifier(ratingDiff);
  }

  // Add randomness
  effA += (Math.random() - 0.5) * 12;
  effB += (Math.random() - 0.5) * 12;

  // Clamp
  effA = Math.max(40, effA);
  effB = Math.max(40, effB);

  // Win probability
  const probA = effA / (effA + effB);

  // Generate goals based on effective ratings
  const avgGoalsA = (effA / 100) * 2.2 + Math.random() * 0.5;
  const avgGoalsB = (effB / 100) * 2.2 + Math.random() * 0.5;

  let goalsA = poissonRandom(avgGoalsA);
  let goalsB = poissonRandom(avgGoalsB);

  // Cap extreme scores
  goalsA = Math.min(goalsA, 7);
  goalsB = Math.min(goalsB, 7);

  // Generate stats
  const possA = Math.round(40 + (probA - 0.5) * 30 + (Math.random() - 0.5) * 10);
  const possB = 100 - possA;
  const shotsA = Math.round(8 + (effA / 100) * 10 + Math.random() * 4);
  const shotsB = Math.round(8 + (effB / 100) * 10 + Math.random() * 4);
  const sotA = Math.round(shotsA * (0.3 + Math.random() * 0.2));
  const sotB = Math.round(shotsB * (0.3 + Math.random() * 0.2));
  const cornersA = Math.round(3 + (possA / 100) * 6 + Math.random() * 3);
  const cornersB = Math.round(3 + (possB / 100) * 6 + Math.random() * 3);
  const foulsA = Math.round(8 + Math.random() * 10);
  const foulsB = Math.round(8 + Math.random() * 10);

  let result = {
    goalsA,
    goalsB,
    formA,
    formB,
    stats: {
      possession: [possA, possB],
      shots: [shotsA, shotsB],
      shotsOnTarget: [sotA, sotB],
      corners: [cornersA, cornersB],
      fouls: [foulsA, foulsB],
    },
    extraTime: false,
    penalties: false,
    penaltyScore: null,
    etGoalsA: 0,
    etGoalsB: 0,
  };

  // Knockout: handle draws with extra time + penalties
  if (isKnockout && goalsA === goalsB) {
    // Extra time
    const etA = poissonRandom(avgGoalsA * 0.3);
    const etB = poissonRandom(avgGoalsB * 0.3);
    result.extraTime = true;
    result.etGoalsA = Math.min(etA, 3);
    result.etGoalsB = Math.min(etB, 3);

    const totalA = goalsA + result.etGoalsA;
    const totalB = goalsB + result.etGoalsB;

    if (totalA === totalB) {
      // Penalties
      result.penalties = true;
      const penA = simulatePenalties(effA);
      const penB = simulatePenalties(effB);
      // Ensure no tie in penalties
      if (penA === penB) {
        if (Math.random() < probA) {
          result.penaltyScore = [penA + 1, penB];
        } else {
          result.penaltyScore = [penA, penB + 1];
        }
      } else {
        result.penaltyScore = [penA, penB];
      }
    }

    result.goalsA = totalA;
    result.goalsB = totalB;
  }

  return result;
}

function simulatePenalties(effRating) {
  let scored = 0;
  const accuracy = 0.65 + (effRating / 100) * 0.15;
  for (let i = 0; i < 5; i++) {
    if (Math.random() < accuracy) scored++;
  }
  return scored;
}

function poissonRandom(lambda) {
  let L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

export function getMatchWinner(match, teamA, teamB) {
  if (match.penalties) {
    return match.penaltyScore[0] > match.penaltyScore[1] ? teamA : teamB;
  }
  if (match.goalsA > match.goalsB) return teamA;
  if (match.goalsB > match.goalsA) return teamB;
  return null; // draw (group stage)
}

export function updateMomentum(team, result) {
  if (!team.momentum) team.momentum = 0;
  if (result === 'win') team.momentum = Math.min(3, team.momentum + 1);
  else if (result === 'loss') team.momentum = Math.max(-3, team.momentum - 1);
  else team.momentum = Math.round(team.momentum * 0.5);
}