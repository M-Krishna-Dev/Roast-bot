const battles = new Map();
const leaderboard = new Map();

async function getBattle(channelId) {
  if (process.env.KV_REST_API_URL) {
    const res = await fetch(`${process.env.KV_REST_API_URL}/get/battle:${channelId}`, {
      headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` }
    });
    const data = await res.json();
    return data.result ? JSON.parse(data.result) : null;
  }
  return battles.get(channelId) || null;
}

async function setBattle(channelId, payload, ttlSeconds = 300) {
  if (process.env.KV_REST_API_URL) {
    await fetch(`${process.env.KV_REST_API_URL}/set/battle:${channelId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ value: JSON.stringify(payload), ex: ttlSeconds })
    });
    return;
  }
  battles.set(channelId, payload);
}

async function deleteBattle(channelId) {
  if (process.env.KV_REST_API_URL) {
    await fetch(`${process.env.KV_REST_API_URL}/del/battle:${channelId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` }
    });
    return;
  }
  battles.delete(channelId);
}

async function getPlayer(userId) {
  if (process.env.KV_REST_API_URL) {
    const res = await fetch(`${process.env.KV_REST_API_URL}/get/player:${userId}`, {
      headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` }
    });
    const data = await res.json();
    return data.result
      ? JSON.parse(data.result)
      : { userId, wins: 0, losses: 0, streak: 0, totalBattles: 0, title: "Rookie Roaster" };
  }
  return leaderboard.get(userId) || { userId, wins: 0, losses: 0, streak: 0, totalBattles: 0, title: "Rookie Roaster" };
}

async function updatePlayer(userId, updates) {
  const current = await getPlayer(userId);
  const updated = { ...current, ...updates };
  if (process.env.KV_REST_API_URL) {
    await fetch(`${process.env.KV_REST_API_URL}/set/player:${userId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ value: JSON.stringify(updated) })
    });
  } else {
    leaderboard.set(userId, updated);
  }
  return updated;
}

async function getLeaderboard() {
  if (process.env.KV_REST_API_URL) {
    const keysRes = await fetch(`${process.env.KV_REST_API_URL}/keys/player:*`, {
      headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` }
    });
    const keysData = await keysRes.json();
    const keys = keysData.result || [];
    const players = await Promise.all(
      keys.map(async (key) => {
        const res = await fetch(`${process.env.KV_REST_API_URL}/get/${key}`, {
          headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` }
        });
        const data = await res.json();
        return data.result ? JSON.parse(data.result) : null;
      })
    );
    return players.filter(Boolean).sort((a, b) => b.wins - a.wins);
  }
  return Array.from(leaderboard.values()).sort((a, b) => b.wins - a.wins);
}

module.exports = { getBattle, setBattle, deleteBattle, getPlayer, updatePlayer, getLeaderboard };
