const BASE = "https://discord.com/api/v10";

async function discordRequest(path, method = "GET", body = null) {
  const options = {
    method,
    headers: {
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      "Content-Type": "application/json"
    }
  };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, options);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Discord API error ${res.status}: ${err}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

async function sendMessage(channelId, payload) {
  return discordRequest(`/channels/${channelId}/messages`, "POST", payload);
}

async function editMessage(channelId, messageId, payload) {
  return discordRequest(`/channels/${channelId}/messages/${messageId}`, "PATCH", payload);
}

async function getGuildMembers(guildId, limit = 100) {
  return discordRequest(`/guilds/${guildId}/members?limit=${limit}`);
}

async function createPoll(channelId, fighter1Id, fighter2Id, fighter1Name, fighter2Name) {
  return sendMessage(channelId, {
    content: "The battle is over. Cast your vote — who delivered the best roast?",
    poll: {
      question: { text: "Who won the roast battle?" },
      answers: [
        { poll_media: { text: fighter1Name } },
        { poll_media: { text: fighter2Name } }
      ],
      duration: 1,
      allow_multiselect: false
    }
  });
}

module.exports = { discordRequest, sendMessage, editMessage, getGuildMembers, createPoll };
