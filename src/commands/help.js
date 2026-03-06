async function handleHelp() {
  const content = [
    "**Roast Bot — Command Reference**",
    "",
    "**/battle**",
    "Starts a 2-minute roast battle. Without arguments, two random server members are selected. Moderators may target specific users by passing fighter1 and fighter2.",
    "",
    "**/leaderboard**",
    "Displays the top 10 roasters ranked by total wins.",
    "",
    "**/battleuserinfo [user]**",
    "Shows the battle record, win rate, streak, and current title for any user.",
    "",
    "**/rewards**",
    "Lists every earnable title and the conditions required to unlock each one.",
    "",
    "**/help**",
    "Shows this reference guide.",
    "",
    "**How battles work**",
    "When a battle starts, both fighters have 2 minutes to roast each other in the channel. At the end of the timer, a poll is posted and the community votes on the winner. The victor's record and title update automatically."
  ].join("\n");

  return {
    type: 4,
    data: { content }
  };
}

module.exports = { handleHelp };
