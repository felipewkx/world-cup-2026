import { simulateMatch, getMatchWinner, updateMomentum, baseStrength } from './matchEngine';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function assignTeams(players, teams) {
  const shuffled = shuffle(teams);
  return shuffled.map((team, i) => ({
    ...team,
    player:   players[i] || null,
    isHuman:  i < players.length,
    momentum: 0,
    stats:    { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 },
  }));
}

/**
 * 4-Pot strict FIFA draw:
 * Pot 1 = top 12 by rating (seeds)
 * Pot 2 = ranks 13–24
 * Pot 3 = ranks 25–36
 * Pot 4 = ranks 37–48
 * Each group: exactly 1 team from each pot → guaranteed balance.
 */
export function generateGroups(teams) {
  const NUM_GROUPS = 12;
  const sorted = [...teams].sort((a, b) => b.rating - a.rating);

  const pot1 = shuffle(sorted.slice(0,  12));
  const pot2 = shuffle(sorted.slice(12, 24));
  const pot3 = shuffle(sorted.slice(24, 36));
  const pot4 = shuffle(sorted.slice(36, 48));

  return Array.from({ length: NUM_GROUPS }, (_, i) => ({
    name: String.fromCharCode(65 + i),
    teams: [pot1[i], pot2[i], pot3[i], pot4[i]],
    matches: [],
    matchday: 0,
    completed: false,
    matchSchedule: [
      [{ home: 0, away: 1 }, { home: 2, away: 3 }],
      [{ home: 0, away: 2 }, { home: 1, away: 3 }],
      [{ home: 0, away: 3 }, { home: 1, away: 2 }],
    ],
  }));
}

export function playGroupMatchday(groups, matchdayIndex) {
  return groups.map(group => {
    if (group.matchday > matchdayIndex || group.completed) return group;
    const schedule = group.matchSchedule[matchdayIndex];
    if (!schedule) return group;

    // Work on mutable copies of stats
    const teams = group.teams.map(t => ({
      ...t,
      stats: { ...t.stats },
      momentum: t.momentum,
    }));

    const newMatches = schedule.map(({ home, away }) => {
      const tA = teams[home];
      const tB = teams[away];
      const result = simulateMatch(tA, tB, false);

      tA.stats.played++;
      tB.stats.played++;
      tA.stats.gf += result.goalsA;
      tA.stats.ga += result.goalsB;
      tB.stats.gf += result.goalsB;
      tB.stats.ga += result.goalsA;

      if (result.goalsA > result.goalsB) {
        tA.stats.won++;  tB.stats.lost++;
        tA.stats.points += 3;
        updateMomentum(tA, 'win');
        updateMomentum(tB, 'loss');
      } else if (result.goalsB > result.goalsA) {
        tB.stats.won++;  tA.stats.lost++;
        tB.stats.points += 3;
        updateMomentum(tB, 'win');
        updateMomentum(tA, 'loss');
      } else {
        tA.stats.drawn++;  tB.stats.drawn++;
        tA.stats.points += 1;
        tB.stats.points += 1;
        updateMomentum(tA, 'draw');
        updateMomentum(tB, 'draw');
      }

      return { teamA: { ...tA }, teamB: { ...tB }, result, matchday: matchdayIndex + 1 };
    });

    const sortedTeams = [...teams].sort((a, b) => {
      if (b.stats.points !== a.stats.points) return b.stats.points - a.stats.points;
      const gdA = a.stats.gf - a.stats.ga;
      const gdB = b.stats.gf - b.stats.ga;
      if (gdB !== gdA) return gdB - gdA;
      if (b.stats.gf !== a.stats.gf) return b.stats.gf - a.stats.gf;
      return b.rating - a.rating;
    });

    return {
      ...group,
      teams: sortedTeams,
      matches: [...group.matches, ...newMatches],
      matchday: matchdayIndex + 1,
      completed: matchdayIndex >= 2,
    };
  });
}

export function getQualifiedTeams(groups) {
  const qualified   = [];
  const thirdPlaced = [];

  groups.forEach(group => {
    qualified.push(group.teams[0], group.teams[1]);
    if (group.teams[2]) thirdPlaced.push(group.teams[2]);
  });

  thirdPlaced.sort((a, b) => {
    if (b.stats.points !== a.stats.points) return b.stats.points - a.stats.points;
    const gdA = a.stats.gf - a.stats.ga;
    const gdB = b.stats.gf - b.stats.ga;
    if (gdB !== gdA) return gdB - gdA;
    if (b.stats.gf !== a.stats.gf) return b.stats.gf - a.stats.gf;
    return b.rating - a.rating;
  });

  qualified.push(...thirdPlaced.slice(0, 8));
  return qualified;
}

export function generateKnockoutBracket(qualifiedTeams) {
  const seeded = [...qualifiedTeams].sort((a, b) => {
    if (b.stats.points !== a.stats.points) return b.stats.points - a.stats.points;
    return b.rating - a.rating;
  });

  const r16 = [];
  for (let i = 0; i < 16; i++) {
    r16.push({ teamA: seeded[i], teamB: seeded[31 - i], result: null, winner: null });
  }

  return { r16, quarterFinals: [], semiFinals: [], thirdPlace: null, final: null, champion: null };
}

/**
 * Pedigree Resilience Bonus — applied before each knockout simulation.
 * Elite teams (BS > 80, i.e. roughly top 8 FIFA) receive +2 rating.
 * Strong teams (BS > 70, roughly top 20) receive +1 rating.
 * This reflects tournament experience, mental strength, and squad depth.
 * These small boosts compound through rounds, making upsets increasingly
 * rare as elite sides progress further in the bracket.
 */
function applyPedigreeBoost(team) {
  const bs = baseStrength(team.rating);
  if (bs > 80) return { ...team, rating: team.rating + 2 };
  if (bs > 70) return { ...team, rating: team.rating + 1 };
  return team;
}

function playKnockoutRound(matches) {
  return matches.map(match => {
    const teamABoosted = applyPedigreeBoost(match.teamA);
    const teamBBoosted = applyPedigreeBoost(match.teamB);

    const result = simulateMatch(teamABoosted, teamBBoosted, true);
    // Winner/loser reference original (unboosted) team objects for display consistency
    const winner = getMatchWinner(result, match.teamA, match.teamB);
    const loser  = winner === match.teamA ? match.teamB : match.teamA;
    updateMomentum(winner, 'win');
    updateMomentum(loser,  'loss');
    return { ...match, result, winner, loser };
  });
}

export function advanceKnockout(bracket, round) {
  const u = { ...bracket };

  if (round === 'r16') {
    const played = playKnockoutRound(u.r16);
    u.r16 = played;
    u.quarterFinals = [];
    for (let i = 0; i < played.length; i += 2) {
      u.quarterFinals.push({ teamA: played[i].winner, teamB: played[i+1].winner, result: null, winner: null });
    }
  } else if (round === 'quarterFinals') {
    const played = playKnockoutRound(u.quarterFinals);
    u.quarterFinals = played;
    u.semiFinals = [];
    for (let i = 0; i < played.length; i += 2) {
      u.semiFinals.push({ teamA: played[i].winner, teamB: played[i+1].winner, result: null, winner: null });
    }
  } else if (round === 'semiFinals') {
    const played = playKnockoutRound(u.semiFinals);
    u.semiFinals = played;
    u.thirdPlace = { teamA: played[0].loser, teamB: played[1].loser, result: null, winner: null };
    u.final      = { teamA: played[0].winner, teamB: played[1].winner, result: null, winner: null };
  } else if (round === 'thirdPlace') {
    u.thirdPlace = playKnockoutRound([u.thirdPlace])[0];
  } else if (round === 'final') {
    const played = playKnockoutRound([u.final]);
    u.final    = played[0];
    u.champion = played[0].winner;
  }

  return u;
}