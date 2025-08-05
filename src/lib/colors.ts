// Tennis Color Palette
export const TENNIS_COLORS = {
  YELLOW: '#dfff4e',
  GREEN: '#69b550', 
  BLUE: '#267ede',
  WHITE: '#ffffff',
  LIGHT_GREY: '#9ca3af',
  MEDIUM_DARK_GREY: '#4b5563',
  BLACK: '#000000',
  // UI State colors
  SUCCESS_GREEN: '#22c55e',
  ERROR_RED: '#ef4444',
  WARNING_RED: '#dc2626',
  INFO_BLUE: '#3b82f6',
  LIGHT_BLUE: '#dbeafe',
  LIGHT_GREEN: '#dcfce7',
  LIGHT_RED: '#fee2e2'
} as const;

// Color usage guidelines:
// - YELLOW: Scores and server indicator
// - GREEN: "+" score button
// - BLUE: "Make server" button
// - WHITE: Text, rules, and borders
// - LIGHT_GREY: Completed set scores
// - MEDIUM_DARK_GREY: Set winner backgrounds
// - SUCCESS_GREEN: Success states, live indicators
// - ERROR_RED: Error messages and states
// - WARNING_RED: Warning states
// - INFO_BLUE: Info buttons and links
// - LIGHT_BLUE: Light blue backgrounds
// - LIGHT_GREEN: Light green backgrounds
// - LIGHT_RED: Light red backgrounds 