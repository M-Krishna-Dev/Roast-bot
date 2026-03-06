'use strict';

/**
 * Battle duration in milliseconds.
 * Users roast each other for this period before voting begins.
 */
const BATTLE_DURATION_MS = 2 * 60 * 1000; // 2 minutes

/**
 * Voting duration in milliseconds.
 * How long the vote buttons remain active after the battle ends.
 */
const VOTE_DURATION_MS = 60 * 1000; // 60 seconds

/**
 * Title definitions.
 * Evaluated in order — first matching rule wins.
 * Each rule has a `check(stats)` function that receives the user's stats object.
 */
const TITLES = [
  // --- Streak-based titles (take priority) ---
  {
    id: 'unkillable',
    label: 'Unkillable',
    description: 'Achieved a win streak of 10 or more.',
    check: (s) => s.current_streak >= 10,
  },
  {
    id: 'untouchable',
    label: 'Untouchable',
    description: 'Achieved a win streak of 5 or more.',
    check: (s) => s.current_streak >= 5,
  },
  {
    id: 'on_fire',
    label: 'On Fire',
    description: 'Achieved a win streak of 3 or more.',
    check: (s) => s.current_streak >= 3,
  },

  // --- Loss-based shame titles (only when wins are minimal) ---
  {
    id: 'cooked',
    label: 'Cooked',
    description: 'Lost 3 battles in a row.',
    check: (s) => s.current_streak <= -3 && s.total_wins <= 2,
  },
  {
    id: 'punching_bag',
    label: 'Punching Bag',
    description: 'Accumulated 5 or more losses with very few wins.',
    check: (s) => s.total_losses >= 5 && s.total_wins === 0,
  },

  // --- Win-count titles ---
  {
    id: 'roast_royalty',
    label: 'Roast Royalty',
    description: 'Won 25 or more battles.',
    check: (s) => s.total_wins >= 25,
  },
  {
    id: 'battle_hardened',
    label: 'Battle Hardened',
    description: 'Won 15 or more battles.',
    check: (s) => s.total_wins >= 15,
  },
  {
    id: 'savage',
    label: 'Savage',
    description: 'Won 10 or more battles.',
    check: (s) => s.total_wins >= 10,
  },
  {
    id: 'verbal_assassin',
    label: 'Verbal Assassin',
    description: 'Won 6 or more battles.',
    check: (s) => s.total_wins >= 6,
  },
  {
    id: 'trash_talker',
    label: 'Trash Talker',
    description: 'Won 3 or more battles.',
    check: (s) => s.total_wins >= 3,
  },
  {
    id: 'rookie_roaster',
    label: 'Rookie Roaster',
    description: 'Won at least 1 battle.',
    check: (s) => s.total_wins >= 1,
  },

  // --- Default ---
  {
    id: 'unranked',
    label: 'Unranked',
    description: 'Has not won a battle yet.',
    check: () => true,
  },
];

/**
 * Returns all title definitions (used for the /rewards command).
 */
const ALL_TITLES = TITLES;

/**
 * Computes the correct title label for a given stats object.
 * @param {Object} stats - User stats from DB
 * @returns {string} The title label
 */
function resolveTitle(stats) {
  const match = TITLES.find((t) => t.check(stats));
  return match ? match.label : 'Unranked';
}

/**
 * Colors used in Discord embeds (decimal format).
 */
const COLORS = {
  battle: 0xe74c3c,     // Red — battle announcement
  victory: 0xf1c40f,    // Gold — winner
  info: 0x3498db,       // Blue — informational
  leaderboard: 0x9b59b6, // Purple — leaderboard
  neutral: 0x2c2f33,    // Dark — neutral/help
  vote: 0xe67e22,       // Orange — voting phase
};

module.exports = {
  BATTLE_DURATION_MS,
  VOTE_DURATION_MS,
  TITLES,
  ALL_TITLES,
  resolveTitle,
  COLORS,
};
