import { TennisPoint, Player, GameScore, SetScore, TieBreakScore, MatchConfig } from '../types/Scoring';

// Tennis point progression
const POINT_SEQUENCE: TennisPoint[] = [0, 15, 30, 40];

// Get next point in sequence
export function getNextPoint(currentPoint: TennisPoint): TennisPoint {
  const currentIndex = POINT_SEQUENCE.indexOf(currentPoint);
  if (currentIndex === -1 || currentIndex === POINT_SEQUENCE.length - 1) {
    return 40; // Return 40 instead of 'deuce'
  }
  return POINT_SEQUENCE[currentIndex + 1];
}

// Check if a game is won
export function isGameWon(gameScore: GameScore, config: MatchConfig): boolean {
  const { player1Points, player2Points } = gameScore;
  
  if (config.scoringSystem === 'no-ad') {
    // No-ad scoring: at 40-40, next point wins
    if (player1Points === 40 && player2Points === 40) {
      return false; // Game continues
    }
    // In no-ad, reaching 40 and winning the next point wins the game
    return false; // Game is never automatically won, needs next point
  } else {
    // Ad scoring: need advantage and then win
    if (player1Points === 'advantage' || player2Points === 'advantage') {
      return true; // Next point wins
    }
    return false; // Game continues
  }
}

// Add a point to a game
export function addPointToGame(gameScore: GameScore, scoringPlayer: Player, config: MatchConfig): GameScore {
  if (config.scoringSystem === 'no-ad') {
    return addPointNoAd(gameScore, scoringPlayer);
  } else {
    return addPointAd(gameScore, scoringPlayer);
  }
}

// Add point with ad scoring
function addPointAd(gameScore: GameScore, scoringPlayer: Player): GameScore {
  const { player1Points, player2Points } = gameScore;
  
  // If either player has advantage, handle that first
  if (player1Points === 'advantage') {
    if (scoringPlayer === 'player1') {
      // Player 1 had advantage and scores again - wins the game
      return { ...gameScore, player1Points: 'game' };
    } else {
      // Player 1 had advantage but player 2 scores - back to deuce
      return { ...gameScore, player1Points: 40, player2Points: 40 };
    }
  }
  
  if (player2Points === 'advantage') {
    if (scoringPlayer === 'player2') {
      // Player 2 had advantage and scores again - wins the game
      return { ...gameScore, player2Points: 'game' };
    } else {
      // Player 2 had advantage but player 1 scores - back to deuce
      return { ...gameScore, player1Points: 40, player2Points: 40 };
    }
  }
  
  // Normal point progression
  if (scoringPlayer === 'player1') {
    if (player1Points === 0) return { ...gameScore, player1Points: 15 };
    if (player1Points === 15) return { ...gameScore, player1Points: 30 };
    if (player1Points === 30) return { ...gameScore, player1Points: 40 };
    if (player1Points === 40) {
      if (player2Points === 40) {
        // Deuce - player 1 gets advantage
        return { ...gameScore, player1Points: 'advantage', player2Points: 0 };
      } else {
        // Player 1 wins the game (opponent not at 40)
        return { ...gameScore, player1Points: 'game' };
      }
    }
  } else {
    if (player2Points === 0) return { ...gameScore, player2Points: 15 };
    if (player2Points === 15) return { ...gameScore, player2Points: 30 };
    if (player2Points === 30) return { ...gameScore, player2Points: 40 };
    if (player2Points === 40) {
      if (player1Points === 40) {
        // Deuce - player 2 gets advantage
        return { ...gameScore, player2Points: 'advantage', player1Points: 0 };
      } else {
        // Player 2 wins the game (opponent not at 40)
        return { ...gameScore, player2Points: 'game' };
      }
    }
  }
  
  return gameScore;
}

// Add point with no-ad scoring
function addPointNoAd(gameScore: GameScore, scoringPlayer: Player): GameScore {
  const { player1Points, player2Points } = gameScore;
  
  if (scoringPlayer === 'player1') {
    if (player1Points === 0) return { ...gameScore, player1Points: 15 };
    if (player1Points === 15) return { ...gameScore, player1Points: 30 };
    if (player1Points === 30) return { ...gameScore, player1Points: 40 };
    if (player1Points === 40) {
      if (player2Points === 40) {
        // Deuce - next point wins the game
        return { ...gameScore, player1Points: 'game' };
      } else {
        // Player 1 wins the game (opponent not at 40)
        return { ...gameScore, player1Points: 'game' };
      }
    }
  } else {
    if (player2Points === 0) return { ...gameScore, player2Points: 15 };
    if (player2Points === 15) return { ...gameScore, player2Points: 30 };
    if (player2Points === 30) return { ...gameScore, player2Points: 40 };
    if (player2Points === 40) {
      if (player1Points === 40) {
        // Deuce - next point wins the game
        return { ...gameScore, player2Points: 'game' };
      } else {
        // Player 2 wins the game (opponent not at 40)
        return { ...gameScore, player2Points: 'game' };
      }
    }
  }
  
  return gameScore;
}

// Remove a point from a game (for correcting mistakes)
export function removePointFromGame(gameScore: GameScore, scoringPlayer: Player, config: MatchConfig): GameScore {
  if (config.scoringSystem === 'no-ad') {
    return removePointNoAd(gameScore, scoringPlayer);
  } else {
    return removePointAd(gameScore, scoringPlayer);
  }
}

// Remove point with ad scoring
function removePointAd(gameScore: GameScore, scoringPlayer: Player): GameScore {
  const { player1Points, player2Points } = gameScore;
  
  if (scoringPlayer === 'player1') {
    if (player1Points === 'game') {
      // If game was won, go back to advantage
      return { ...gameScore, player1Points: 'advantage', player2Points: 0 };
    }
    if (player1Points === 'advantage') {
      // If had advantage, go back to 40 (deuce)
      return { ...gameScore, player1Points: 40, player2Points: 40 };
    }
    if (player1Points === 40) {
      if (player2Points === 40) {
        // At deuce, go back to 30
        return { ...gameScore, player1Points: 30 };
      } else {
        // Opponent not at 40, go back to 30
        return { ...gameScore, player1Points: 30 };
      }
    }
    if (player1Points === 30) return { ...gameScore, player1Points: 15 };
    if (player1Points === 15) return { ...gameScore, player1Points: 0 };
    // Can't go below 0
    return gameScore;
  } else {
    if (player2Points === 'game') {
      // If game was won, go back to advantage
      return { ...gameScore, player2Points: 'advantage', player1Points: 0 };
    }
    if (player2Points === 'advantage') {
      // If had advantage, go back to 40 (deuce)
      return { ...gameScore, player1Points: 40, player2Points: 40 };
    }
    if (player2Points === 40) {
      if (player1Points === 40) {
        // At deuce, go back to 30
        return { ...gameScore, player2Points: 30 };
      } else {
        // Opponent not at 40, go back to 30
        return { ...gameScore, player2Points: 30 };
      }
    }
    if (player2Points === 30) return { ...gameScore, player2Points: 15 };
    if (player2Points === 15) return { ...gameScore, player2Points: 0 };
    // Can't go below 0
    return gameScore;
  }
}

// Remove point with no-ad scoring
function removePointNoAd(gameScore: GameScore, scoringPlayer: Player): GameScore {
  const { player1Points, player2Points } = gameScore;
  
  if (scoringPlayer === 'player1') {
    if (player1Points === 'game') {
      // If game was won, go back to 40
      return { ...gameScore, player1Points: 40 };
    }
    if (player1Points === 40) {
      if (player2Points === 40) {
        // At deuce, go back to 30
        return { ...gameScore, player1Points: 30 };
      } else {
        // Opponent not at 40, go back to 30
        return { ...gameScore, player1Points: 30 };
      }
    }
    if (player1Points === 30) return { ...gameScore, player1Points: 15 };
    if (player1Points === 15) return { ...gameScore, player1Points: 0 };
    // Can't go below 0
    return gameScore;
  } else {
    if (player2Points === 'game') {
      // If game was won, go back to 40
      return { ...gameScore, player2Points: 40 };
    }
    if (player2Points === 40) {
      if (player1Points === 40) {
        // At deuce, go back to 30
        return { ...gameScore, player2Points: 30 };
      } else {
        // Opponent not at 40, go back to 30
        return { ...gameScore, player2Points: 30 };
      }
    }
    if (player2Points === 30) return { ...gameScore, player2Points: 15 };
    if (player2Points === 15) return { ...gameScore, player2Points: 0 };
    // Can't go below 0
    return gameScore;
  }
}

// Check if a set is won
export function isSetWon(setScore: SetScore, config: MatchConfig): boolean {
  const { player1Games, player2Games } = setScore;
  const requiredGames = config.setDuration;
  
  // Must win by 2 games
  if (player1Games >= requiredGames && player1Games - player2Games >= 2) {
    return true;
  }
  if (player2Games >= requiredGames && player2Games - player1Games >= 2) {
    return true;
  }
  
  return false;
}

// Check if tie break is needed
export function isTieBreakNeeded(setScore: SetScore, config: MatchConfig): boolean {
  if (config.tieBreakRules === 'none') return false;
  
  const { player1Games, player2Games } = setScore;
  const requiredGames = config.setDuration;
  
  return player1Games === requiredGames && player2Games === requiredGames;
}

// Add point to tie break
export function addPointToTieBreak(
  tieBreakScore: TieBreakScore, 
  scoringPlayer: Player, 
  config: MatchConfig,
  isFinalSetTieBreak: boolean = false,
  finalSetTieBreakPoints?: number
): TieBreakScore {
  const { player1Points, player2Points, server } = tieBreakScore;
  
  // Determine required points based on tiebreak type
  let requiredPoints: number;
  if (isFinalSetTieBreak && finalSetTieBreakPoints) {
    requiredPoints = finalSetTieBreakPoints;
  } else {
    requiredPoints = config.tieBreakRules === '10-point' ? 10 : 7;
  }
  
  const totalPoints = player1Points + player2Points;
  
  // Determine who should serve next based on tiebreak rules
  let nextServer: Player;
  
  // Calculate which server should serve the NEXT point (after this one is scored)
  const nextPointNumber = totalPoints + 2; // The point after the one we're about to score
  
  if (nextPointNumber === 1) {
    // Point 1: original server
    nextServer = server;
  } else {
    // Simple logic: switch servers on even-numbered points
    if (nextPointNumber % 2 === 0) {
      // Even point - switch to other player
      nextServer = server === 'player1' ? 'player2' : 'player1';
    } else {
      // Odd point - keep same player
      nextServer = server;
    }
  }
  
  if (scoringPlayer === 'player1') {
    const newPlayer1Points = player1Points + 1;
    const isComplete = newPlayer1Points >= requiredPoints && newPlayer1Points - player2Points >= 2;
    
    return {
      ...tieBreakScore,
      player1Points: newPlayer1Points,
      server: nextServer,
      isComplete,
      winner: isComplete ? 'player1' : undefined
    };
  } else {
    const newPlayer2Points = player2Points + 1;
    const isComplete = newPlayer2Points >= requiredPoints && newPlayer2Points - player1Points >= 2;
    
    return {
      ...tieBreakScore,
      player2Points: newPlayer2Points,
      server: nextServer,
      isComplete,
      winner: isComplete ? 'player2' : undefined
    };
  }
}

// Get winner of a match
export function getMatchWinner(match: { sets: SetScore[], config: MatchConfig }): Player | null {
  const { sets, config } = match;
  const completedSets = sets.filter(set => set.isComplete);
  
  if (config.matchFormat === 'single') {
    return completedSets.length > 0 ? completedSets[0].winner! : null;
  }
  
  const player1Sets = completedSets.filter(set => set.winner === 'player1').length;
  const player2Sets = completedSets.filter(set => set.winner === 'player2').length;
  
  if (config.matchFormat === 'best-of-3') {
    if (player1Sets >= 2) return 'player1';
    if (player2Sets >= 2) return 'player2';
  } else if (config.matchFormat === 'best-of-5') {
    if (player1Sets >= 3) return 'player1';
    if (player2Sets >= 3) return 'player2';
  }
  
  return null;
} 