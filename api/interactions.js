const nacl = require("tweetnacl");

const { handleBattle } = require("../src/commands/battle");
const { handleLeaderboard } = require("../src/commands/leaderboard");
const { handleBattleUserInfo } = require("../src/commands/battleuserinfo");
const { handleRewards } = require("../src/commands/rewards");
const { handleHelp } = require("../src/commands/help");

const INTERACTION_TYPE = {
  PING: 1,
  APPLICATION_COMMAND: 2,
  MESSAGE_COMPONENT: 3
};

function verifyRequest(req, rawBody) {
  const signature = req.headers["x-signature-ed25519"];
  const timestamp = req.headers["x-signature-timestamp"];
  const publicKey = process.env.DISCORD_PUBLIC_KEY;

  if (!signature || !timestamp || !publicKey) return false;

  try {
    return nacl.sign.detached.verify(
      Buffer.from(timestamp + rawBody),
      Buffer.from(signature, "hex"),
      Buffer.from(publicKey, "hex")
    );
  } catch {
    return false;
  }
}

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

async function routeCommand(interaction) {
  const name = interaction.data?.name;

  switch (name) {
    case "battle":
      return handleBattle(interaction);
    case "leaderboard":
      return handleLeaderboard(interaction);
    case "battleuserinfo":
      return handleBattleUserInfo(interaction);
    case "rewards":
      return handleRewards(interaction);
    case "help":
      return handleHelp(interaction);
    default:
      return {
        type: 4,
        data: { content: "Unknown command.", flags: 64 }
      };
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rawBody = await getRawBody(req);

  if (!verifyRequest(req, rawBody)) {
    return res.status(401).json({ error: "Invalid request signature" });
  }

  let interaction;
  try {
    interaction = JSON.parse(rawBody);
  } catch {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  if (interaction.type === INTERACTION_TYPE.PING) {
    return res.status(200).json({ type: 1 });
  }

  if (interaction.type === INTERACTION_TYPE.APPLICATION_COMMAND) {
    try {
      const response = await routeCommand(interaction);
      return res.status(200).json(response);
    } catch (err) {
      console.error("Command handler error:", err);
      return res.status(200).json({
        type: 4,
        data: { content: "An internal error occurred. Please try again.", flags: 64 }
      });
    }
  }

  return res.status(200).json({ type: 1 });
};
