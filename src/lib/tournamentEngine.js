import { simulateMatch, getMatchWinner, updateMomentum } from './matchEngine';

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
    player: players[i] || null,
    isHuman: i < players.length,
    momentum: 0,
    stats: { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 },
  }));
}

export function generateGroups(teams) {
  // Sort by rating (serpentine seeding for balance)
  const sorted = [...teams].sort((a, b) => b.rating - a.rating);
  const numGroups = 12; // 48 teams / 4 per group = 12 groups
  const groups = Array.from({ length: numGroups }, (_, i) => ({
    name: String.fromCharCode(65 + i),
    teams: [],
    matches: [],
    matchday: 0,
    completed: false,
  }));

  // Serpentine distribution
  sorted.forEach((team, i) => {
    const pot = Math.floor(i / numGroups);
    const groupIdx = pot % 2 === 0 ? i % numGroups : numGroups - 1 - (i % numGroups);
    groups[groupIdx].teams.push(team);
  });

  // Generate matches for each group (round-robin)
  groups.forEach(group => {
    const t = group.teams;
    group.matchSchedule = [
      // Matchday 1
      [{ home: 0, away: 1 }, { home: 2, away: 3 }],
      // Matchday 2
      [{ home: 0, away: 2 }, { home: 1, away: 3 }],
      // Matchday 3
      [{ home: 0, away: 3 }, { home: 1, away: 2 }],
    ];
  });

  return groups;
}

export function playGroupMatchday(groups, matchdayIndex) {
  const updatedGroups = groups.map(group => {
    if (group.matchday > matchdayIndex || group.completed) return group;

    const matchday = group.matchSchedule[matchdayIndex];
    if (!matchday) return group;

    const newMatches = matchday.map(({ home, away }) => {
      const teamA = group.teams[home];
      const teamB = group.teams[away];
      const result = simulateMatch(teamA, teamB, false);
      
      // Update stats
      teamA.stats.played++;
      teamB.stats.played++;
      teamA.stats.gf += result.goalsA;
      teamA.stats.ga += result.goalsB;
      teamB.stats.gf += result.goalsB;
      teamB.stats.ga += result.goalsA;

      if (result.goalsA > result.goalsB) {
        teamA.stats.won++;
        teamB.stats.lost++;
        teamA.stats.points += 3;
        updateMomentum(teamA, 'win');
        updateMomentum(teamB, 'loss');
      } else if (result.goalsA < result.goalsB) {
        teamB.stats.won++;
        teamA.stats.lost++;
        teamB.stats.points += 3;
        updateMomentum(teamB, 'win');
        updateMomentum(teamA, 'loss');
      } else {
        teamA.stats.drawn++;
        teamB.stats.drawn++;
        teamA.stats.points += 1;
        teamB.stats.points += 1;
        updateMomentum(teamA, 'draw');
        updateMomentum(teamB, 'draw');
      }

      return { teamA, teamB, result, matchday: matchdayIndex + 1 };
    });

    const newGroup = { ...group };
    newGroup.matches = [...group.matches, ...newMatches];
    newGroup.matchday = matchdayIndex + 1;
    if (matchdayIndex >= 2) newGroup.completed = true;

    // Sort standings
    newGroup.teams = [...group.teams].sort((a, b) => {
      if (b.stats.points !== a.stats.points) return b.stats.points - a.stats.points;
      const gdA = a.stats.gf - a.stats.ga;
      const gdB = b.stats.gf - b.stats.ga;
      if (gdB !== gdA) return gdB - gdA;
      return b.stats.gf - a.stats.gf;
    });

    return newGroup;
  });

  return updatedGroups;
}

export function getQualifiedTeams(groups) {
  // Top 2 from each group + 8 best third-placed teams
  const qualified = [];
  const thirdPlaced = [];

  groups.forEach(group => {
    if (group.teams.length >= 2) {
      qualified.push(group.teams[0]);
      qualified.push(group.teams[1]);
      if (group.teams[2]) thirdPlaced.push(group.teams[2]);
    }
  });

  // Sort third-placed teams
  thirdPlaced.sort((a, b) => {
    if (b.stats.points !== a.stats.points) return b.stats.points - a.stats.points;
    const gdA = a.stats.gf - a.stats.ga;
    const gdB = b.stats.gf - b.stats.ga;
    if (gdB !== gdA) return gdB - gdA;
    return b.stats.gf - a.stats.gf;
  });

  // Top 8 third-placed
  qualified.push(...thirdPlaced.slice(0, 8));

  return qualified;
}

export function generateKnockoutBracket(qualifiedTeams) {
  // Seed teams: sort by group performance then rating
  const seeded = [...qualifiedTeams].sort((a, b) => {
    if (b.stats.points !== a.stats.points) return b.stats.points - a.stats.points;
    return b.rating - a.rating;
  });

  // Create R16 matchups (1 vs 32, 2 vs 31, etc.)
  const r16 = [];
  for (let i = 0; i < 16; i++) {
    r16.push({
      teamA: seeded[i],
      teamB: seeded[31 - i],
      result: null,
      winner: null,
    });
  }

  return {
    r16,
    quarterFinals: [],
    semiFinals: [],
    thirdPlace: null,
    final: null,
    champion: null,
  };
}

export function playKnockoutRound(matches) {
  return matches.map(match => {
    const result = simulateMatch(match.teamA, match.teamB, true);
    const winner = getMatchWinner(result, match.teamA, match.teamB);
    const loser = winner === match.teamA ? match.teamB : match.teamA;

    updateMomentum(winner, 'win');
    updateMomentum(loser, 'loss');

    return { ...match, result, winner, loser };
  });
}

export function advanceKnockout(bracket, round) {
  const updated = { ...bracket };

  if (round === 'r16') {
    const played = playKnockoutRound(updated.r16);
    updated.r16 = played;
    // Generate QF
    updated.quarterFinals = [];
    for (let i = 0; i < played.length; i += 2) {
      updated.quarterFinals.push({
        teamA: played[i].winner,
        teamB: played[i + 1].winner,
        result: null,
        winner: null,
      });
    }
  } else if (round === 'quarterFinals') {
    const played = playKnockoutRound(updated.quarterFinals);
    updated.quarterFinals = played;
    updated.semiFinals = [];
    for (let i = 0; i < played.length; i += 2) {
      updated.semiFinals.push({
        teamA: played[i].winner,
        teamB: played[i + 1].winner,
        result: null,
        winner: null,
      });
    }
  } else if (round === 'semiFinals') {
    const played = playKnockoutRound(updated.semiFinals);
    updated.semiFinals = played;
    // Third place match
    updated.thirdPlace = {
      teamA: played[0].loser,
      teamB: played[1].loser,
      result: null,
      winner: null,
    };
    // Final
    updated.final = {
      teamA: played[0].winner,
      teamB: played[1].winner,
      result: null,
      winner: null,
    };
  } else if (round === 'thirdPlace') {
    const played = playKnockoutRound([updated.thirdPlace]);
    updated.thirdPlace = played[0];
  } else if (round === 'final') {
    const played = playKnockoutRound([updated.final]);
    updated.final = played[0];
    updated.champion = played[0].winner;
  }

  return updated;
}