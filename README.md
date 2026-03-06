# Roast Battle Bot

A Discord HTTP interactions bot for running roast battles between server members.

## Features

- `/battle` — Start a 2-minute roast battle between two random or selected users
- `/leaderboard` — Top 10 roasters by win count
- `/battleuserinfo` — Stats for any user
- `/rewards` — All earnable titles and unlock conditions
- `/help` — Command reference

## Project Structure

```
roast-bot/
  api/
    interactions.js     # Vercel serverless entry point
  src/
    commands/
      battle.js
      leaderboard.js
      battleuserinfo.js
      rewards.js
      help.js
    lib/
      store.js          # KV abstraction (memory locally, Vercel KV in prod)
      discord.js        # Discord REST helper
      commands.js       # Slash command definitions
      register.js       # Command registration script
      titles.js         # Title resolution logic
  .env.example
  vercel.json
  package.json
```

## Setup

### 1. Create a Discord Application

1. Go to https://discord.com/developers/applications
2. Create a New Application
3. Under **Bot**, enable the bot and copy the token
4. Under **OAuth2**, copy the Application ID and Public Key
5. Under **OAuth2 > URL Generator**, select `bot` + `applications.commands`, then invite the bot to your server

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in:

```
DISCORD_APPLICATION_ID=   # From Discord developer portal
DISCORD_PUBLIC_KEY=       # From Discord developer portal
DISCORD_BOT_TOKEN=        # Bot token
DISCORD_GUILD_ID=         # Optional: your server ID for faster command registration
KV_REST_API_URL=          # From Vercel KV (production only)
KV_REST_API_TOKEN=        # From Vercel KV (production only)
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Deploy to Vercel

```bash
npx vercel
```

Add each environment variable in the Vercel project dashboard under **Settings > Environment Variables**.

After deploying, copy your production URL (e.g. `https://roast-bot.vercel.app`).

### 5. Set Interactions Endpoint URL

In the Discord developer portal, under **General Information**, set the **Interactions Endpoint URL** to:

```
https://your-vercel-url.vercel.app/interactions
```

Discord will send a PING to verify the endpoint. The bot handles this automatically.

### 6. Register Slash Commands

```bash
npm run register
```

Run this once. If `DISCORD_GUILD_ID` is set, commands register instantly to that guild. Without it, global commands can take up to 1 hour to propagate.

## Production Storage

The bot uses in-memory storage by default. For production persistence, create a **Vercel KV** database:

1. In your Vercel dashboard, go to **Storage > Create KV Database**
2. Link it to your project
3. Vercel automatically injects `KV_REST_API_URL` and `KV_REST_API_TOKEN`

## Battle Flow

1. `/battle` is called — two fighters are selected (random or specified)
2. A 2-minute countdown begins
3. At 30 seconds remaining, a warning is sent to the channel
4. When time expires, a Discord Poll is posted asking the community to vote
5. After the poll closes, run `/battle settle` (or track winners manually) to update records

## Notes

- Only one active battle per channel at a time
- Battles time out automatically after 5 minutes if not settled
- Titles update automatically based on win/loss/streak history
