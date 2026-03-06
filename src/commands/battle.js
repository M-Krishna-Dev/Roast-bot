const { getBattle, setBattle, getPlayer } = require("../lib/store");
const { sendMessage, getGuildMembers, createPoll } = require("../lib/discord");

const BATTLE_DURATION_MS = 2 * 60 * 1000;
const COUNTDOWN_INTERVAL_MS = 30 * 1000;

async function handleBattle(interaction) {
  const channelId = interaction.channel_id;
  const guildId = interaction.guild_id;
  const invoker = interaction.member.user;

  const existingBattle = await getBattle(channelId);
  if (existingBattle) {
    return {
      type: 4,
      data: {
        content: "A roast battle is already active in this channel. Wait for it to finish."
      }
    };
  }

  const options = interaction.data.options || [];
  let fighter1Id = options.find((o) => o.name === "fighter1")?.value || null;
  let fighter2Id = options.find((o) => o.name === "fighter2")?.value || null;

  if (!fighter1Id || !fighter2Id) {
    try {
      const members = await getGuildMembers(guildId, 100);
      const eligible = members
        .filter((m) => !m.user.bot && m.user.id !== invoker.id)
        .map((m) => m.user.id);

      if (eligible.length < 2) {
        return {
          type: 4,
          data: {
            content: "Not enough eligible members in this server to start a battle."
          }
        };
      }

      const shuffled = eligible.sort(() => Math.random() - 0.5);
      fighter1Id = fighter1Id || shuffled[0];
      fighter2Id = fighter2Id || shuffled[1];
    } catch {
      return {
        type: 4,
        data: { content: "Failed to fetch guild members." }
      };
    }
  }

  if (fighter1Id === fighter2Id) {
    return {
      type: 4,
      data: { content: "You cannot start a battle between the same user." }
    };
  }

  const battle = {
    channelId,
    guildId,
    fighter1Id,
    fighter2Id,
    startedAt: Date.now(),
    endsAt: Date.now() + BATTLE_DURATION_MS,
    initiatedBy: invoker.id
  };

  await setBattle(channelId, battle, 360);

  scheduleCountdownAndPoll(battle);

  return {
    type: 4,
    data: {
      content: [
        `A roast battle has been initiated.`,
        ``,
        `**Combatants:** <@${fighter1Id}> vs <@${fighter2Id}>`,
        `**Duration:** 2 minutes`,
        ``,
        `Both fighters have 2 minutes to roast each other in this channel. When time is up, the chat decides who won.`,
        ``,
        `The battle starts now.`
      ].join("\n")
    }
  };
}

function scheduleCountdownAndPoll(battle) {
  const { channelId, fighter1Id, fighter2Id, endsAt } = battle;
  const now = Date.now();
  const timeLeft = endsAt - now;

  const warningAt = timeLeft - 30000;
  if (warningAt > 0) {
    setTimeout(async () => {
      try {
        await sendMessage(channelId, {
          content: `30 seconds remaining. Make your final burns count — <@${fighter1Id}>, <@${fighter2Id}>.`
        });
      } catch {}
    }, warningAt);
  }

  setTimeout(async () => {
    try {
      await sendMessage(channelId, {
        content: `Time is up. <@${fighter1Id}> vs <@${fighter2Id}> — the community will now decide the winner.`
      });
      await createPoll(channelId, fighter1Id, fighter2Id, `<@${fighter1Id}>`, `<@${fighter2Id}>`);
    } catch {}
  }, timeLeft);
}

module.exports = { handleBattle };
