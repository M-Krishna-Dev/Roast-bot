const { MongoClient } = require("mongodb");

let client = null;
let db = null;

async function getDb() {
  if (db) return db;
  client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  db = client.db("roast-bot");
  await db.collection("battles").createIndex({ channelId: 1 }, { unique: true });
  await db.collection("battles").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  await db.collection("players").createIndex({ userId: 1 }, { unique: true });
  return db;
}

async function getBattle(channelId) {
  const database = await getDb();
  const doc = await database.collection("battles").findOne({ channelId });
  if (!doc) return null;
  const { _id, expiresAt, ...battle } = doc;
  return battle;
}

async function setBattle(channelId, payload, ttlSeconds = 300) {
  const database = await getDb();
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
  await database.collection("battles").updateOne(
    { channelId },
    { $set: { ...payload, channelId, expiresAt } },
    { upsert: true }
  );
}

async function deleteBattle(channelId) {
  const database = await getDb();
  await database.collection("battles").deleteOne({ channelId });
}

async function getPlayer(userId) {
  const database = await getDb();
  const doc = await database.collection("players").findOne({ userId });
  if (!doc) return { userId, wins: 0, losses: 0, streak: 0, totalBattles: 0, title: "Rookie Roaster" };
  const { _id, ...player } = doc;
  return player;
}

async function updatePlayer(userId, updates) {
  const database = await getDb();
  const current = await getPlayer(userId);
  const updated = { ...current, ...updates };
  await database.collection("players").updateOne(
    { userId },
    { $set: updated },
    { upsert: true }
  );
  return updated;
}

async function getLeaderboard() {
  const database = await getDb();
  const docs = await database.collection("players").find({}).sort({ wins: -1 }).limit(10).toArray();
  return docs.map(({ _id, ...player }) => player);
}

module.exports = { getBattle, setBattle, deleteBattle, getPlayer, updatePlayer, getLeaderboard };
