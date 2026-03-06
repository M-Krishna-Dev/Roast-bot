require("dotenv").config();
const { COMMANDS } = require("./commands");

const BASE = "https://discord.com/api/v10";
const { DISCORD_BOT_TOKEN, DISCORD_APPLICATION_ID, DISCORD_GUILD_ID } = process.env;

async function register() {
  const url = DISCORD_GUILD_ID
    ? `${BASE}/applications/${DISCORD_APPLICATION_ID}/guilds/${DISCORD_GUILD_ID}/commands`
    : `${BASE}/applications/${DISCORD_APPLICATION_ID}/commands`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(COMMANDS)
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Failed to register commands:", err);
    process.exit(1);
  }

  const data = await res.json();
  console.log(`Registered ${data.length} command(s) successfully.`);
  data.forEach((cmd) => console.log(` - /${cmd.name}`));
}

register();
