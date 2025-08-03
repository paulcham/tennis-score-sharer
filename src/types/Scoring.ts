export type TennisPoint = 0 | 15 | 30 | 40 | 'advantage' | 'game';
export type ScoringSystem = 'ad' | 'no-ad';
export type MatchFormat = 'single' | 'best-of-3' | 'best-of-5';
export type SetDuration = 4 | 6 | 8;
export type TieBreakRules = 'none' | '7-point' | '10-point';
export type Player = 'player1' | 'player2';

export interface GameScore {
  player1Points: TennisPoint;
  player2Points: TennisPoint;
  server: Player;
}

export interface SetScore {
  player1Games: number;
  player2Games: number;
  isComplete: boolean;
  winner?: Player;
}

export interface TieBreakScore {
  player1Points: number;
  player2Points: number;
  isComplete: boolean;
  winner?: Player;
}

export interface MatchConfig {
  scoringSystem: ScoringSystem;
  matchFormat: MatchFormat;
  setDuration: SetDuration;
  tieBreakRules: TieBreakRules;
  player1Name: string;
  player2Name: string;
}

export interface Match {
  id: string;
  config: MatchConfig;
  status: 'in-progress' | 'completed' | 'paused';
  currentSet: number;
  currentGame: number;
  sets: SetScore[];
  currentGameScore: GameScore;
  isTieBreak: boolean;
  tieBreakScore?: TieBreakScore;
  createdAt: Date;
  updatedAt: Date;
  shareUrl: string;
} 