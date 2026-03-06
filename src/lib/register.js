const { COMMANDS } = require("./commands");

const BASE = "https://discord.com/api/v10";
const DISCORD_BOT_TOKEN = "your_bot_token_here";
const DISCORD_APPLICATION_ID = "your_application_id_here";
const DISCORD_GUILD_ID = "your_guild_id_here";

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
