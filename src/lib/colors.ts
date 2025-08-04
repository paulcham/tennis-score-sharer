// Tennis Color Palette
export const TENNIS_COLORS = {
  YELLOW: '#dfff4e',
  GREEN: '#6c935c', 
  BLUE: '#3c638e',
  WHITE: '#ffffff',
  // Grey colors for scoreboard
  LIGHT_GREY: '#9ca3af',
  MEDIUM_DARK_GREY: '#4b5563',
  // Additional colors
  BLACK: '#000000'
} as const;

// Color usage guidelines:
// - YELLOW: Scores and server indicator
// - GREEN: "+" score button
// - BLUE: "Make server" button
// - WHITE: Text, rules, and borders
// - LIGHT_GREY: Completed set scores
// - MEDIUM_DARK_GREY: Set winner backgrounds 