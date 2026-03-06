async function handleRewards() {
  const tiers = [
    { title: "Undisputed Savage",  requirement: "Reach a 10-win streak without losing" },
    { title: "Roast King",         requirement: "Win 50 total battles" },
    { title: "Certified Menace",   requirement: "Win 30 total battles" },
    { title: "Serial Burner",      requirement: "Reach a 5-win streak" },
    { title: "Battle-Hardened",    requirement: "Play 20+ battles with a positive record" },
    { title: "Rising Flame",       requirement: "Win 10 total battles" },
    { title: "Scoreboard Regular", requirement: "Participate in 10 battles" },
    { title: "Frequent Flammer",   requirement: "Win 5 total battles" },
    { title: "Still Learning",     requirement: "Accumulate 10+ losses with fewer than 3 wins" },
    { title: "Rookie Roaster",     requirement: "Default — all new participants start here" }
  ];

  const lines = [
    "**Earnable Titles**",
    "",
    "Titles are assigned automatically based on your battle history. The highest applicable title is always shown.",
    ""
  ];

  tiers.forEach(({ title, requirement }) => {
    lines.push(`**${title}**`);
    lines.push(`Unlock: ${requirement}`);
    lines.push("");
  });

  return {
    type: 4,
    data: { content: lines.join("\n") }
  };
}

module.exports = { handleRewards };
