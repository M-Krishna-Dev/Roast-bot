const COMMANDS = [
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

module.exports = { COMMANDS };
