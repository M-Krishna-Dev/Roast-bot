const TITLES = [
  { label: "Undisputed Savage",   condition: (p) => p.streak >= 10 },
  { label: "Roast King",          condition: (p) => p.wins >= 50 },
  { label: "Certified Menace",    condition: (p) => p.wins >= 30 },
  { label: "Serial Burner",       condition: (p) => p.streak >= 5 },
  { label: "Battle-Hardened",     condition: (p) => p.totalBattles >= 20 && p.wins > p.losses },
  { label: "Rising Flame",        condition: (p) => p.wins >= 10 },
  { label: "Scoreboard Regular",  condition: (p) => p.totalBattles >= 10 },
  { label: "Frequent Flammer",    condition: (p) => p.wins >= 5 },
  { label: "Still Learning",      condition: (p) => p.losses >= 10 && p.wins < 3 },
  { label: "Rookie Roaster",      condition: () => true }
];

function resolveTitle(player) {
  for (const tier of TITLES) {
    if (tier.condition(player)) return tier.label;
  }
  return "Rookie Roaster";
}

module.exports = { resolveTitle };
