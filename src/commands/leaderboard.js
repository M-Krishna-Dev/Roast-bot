const { getLeaderboard } = require("../lib/store");

async function handleLeaderboard() {
  const players = await getLeaderboard();

  if (!players.length) {
    return {
      type: 4,
      data: {
        content: "No battles have been recorded yet. Start one with /battle."
      }
    };
  }

  const top = players.slice(0, 10);
  const rows = top
    .map((p, i) => {
      const rank = i + 1;
      const record = `${p.wins}W / ${p.losses}L`;
      const streak = p.streak > 1 ? ` | ${p.streak}-win streak` : "";
      return `**#${rank}** <@${p.userId}> — ${record}${streak}\n       ${p.title}`;
    })
    .join("\n\n");

  return {
    type: 4,
    data: {
      content: `**Roast Battle Leaderboard**\n\n${rows}`
    }
  };
}

module.exports = { handleLeaderboard };
