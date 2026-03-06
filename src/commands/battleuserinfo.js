const { getPlayer } = require("../lib/store");

async function handleBattleUserInfo(interaction) {
  const options = interaction.data.options || [];
  const userId = options.find((o) => o.name === "user")?.value;

  if (!userId) {
    return {
      type: 4,
      data: { content: "Please specify a user.", flags: 64 }
    };
  }

  const player = await getPlayer(userId);
  const winRate =
    player.totalBattles > 0
      ? ((player.wins / player.totalBattles) * 100).toFixed(1)
      : "0.0";

  const lines = [
    `**Battle Profile — <@${userId}>**`,
    ``,
    `Title: **${player.title}**`,
    `Wins: ${player.wins}`,
    `Losses: ${player.losses}`,
    `Total Battles: ${player.totalBattles}`,
    `Win Rate: ${winRate}%`,
    `Current Win Streak: ${player.streak}`
  ];

  return {
    type: 4,
    data: { content: lines.join("\n"), flags: 64 }
  };
}

module.exports = { handleBattleUserInfo };
