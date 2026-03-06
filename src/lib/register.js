const BOT_TOKEN = "your_bot_token_here";
const APP_ID = "your_application_id_here";
const GUILD_ID = "your_guild_id_here";

const commands = [
  {
    name: "battle",
    description: "Start a roast battle. Optionally target two specific users.",
    options: [
      {
        name: "fighter1",
        description: "First participant (omit for random selection)",
        type: 6,
        required: false
      },
      {
        name: "fighter2",
        description: "Second participant (omit for random selection)",
        type: 6,
        required: false
      }
    ]
  },
  {
    name: "leaderboard",
    description: "Display the top roasters ranked by wins."
  },
  {
    name: "battleuserinfo",
    description: "View battle statistics for a user.",
    options: [
      {
        name: "user",
        description: "The user to inspect",
        type: 6,
        required: true
      }
    ]
  },
  {
    name: "rewards",
    description: "Show all earnable titles and how to unlock them."
  },
  {
    name: "help",
    description: "Show all available commands and how to use the bot."
  }
];

async function register() {
  const url = `https://discord.com/api/v10/applications/${APP_ID}/guilds/${GUILD_ID}/commands`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bot ${BOT_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(commands)
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Failed to register commands");
    console.error("Status:", response.status);
    console.error("Error:", error);
    return;
  }

  const data = await response.json();
  console.log("Commands registered successfully!");
  console.log("Status:", response.status);
  data.forEach((cmd) => console.log(`Registered: /${cmd.name}`));
}

register().catch((err) => {
  console.error("Unexpected error:", err.message);
});
