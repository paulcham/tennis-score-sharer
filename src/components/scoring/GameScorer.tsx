import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { GameScore, MatchConfig, Player, SetScore, TieBreakScore, Match } from '../../types/Scoring';
import { addPointToGame, removePointFromGame, isSetWon, isTieBreakNeeded, addPointToTieBreak } from '../../utils/scoring';
import Scoreboard from './Scoreboard';
import { MatchAPI } from '../../services/api';
import { TENNIS_COLORS } from '../../lib/colors';

interface GameScorerProps {
  config: MatchConfig;
  matchId?: string; // Optional: if provided, load existing match
  adminToken?: string; // Optional: for updating existing matches
  isReadOnly?: boolean; // Optional: if true, disable all interactions
}

const GameScorer: React.FC<GameScorerProps> = ({ config, matchId, adminToken, isReadOnly = false }) => {
  const [gameScore, setGameScore] = useState<GameScore>({
    player1Points: 0,
    player2Points: 0,
    server: 'player1'
  });

  const [sets, setSets] = useState<SetScore[]>([
    { player1Games: 0, player2Games: 0, isComplete: false }
  ]);

  const [currentSet, setCurrentSet] = useState(1);
  const [gameHistory, setGameHistory] = useState<any[]>([]);
  const [gameNumber, setGameNumber] = useState(1);
  
  // Tiebreak state
  const [isTieBreak, setIsTieBreak] = useState(false);
  const [tieBreakScore, setTieBreakScore] = useState<TieBreakScore>({
    player1Points: 0,
    player2Points: 0,
    isComplete: false,
    server: 'player1'
  });

  // Match completion state
  const [isMatchComplete, setIsMatchComplete] = useState(false);
  const [matchWinner, setMatchWinner] = useState<Player | null>(null);
  const [finalScoreline, setFinalScoreline] = useState<string>('');

  // Match persistence state
  const [currentMatchId, setCurrentMatchId] = useState<string | null>(matchId || null);
  const [currentAdminToken, setCurrentAdminToken] = useState<string | null>(adminToken || null);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');



  const loadExistingMatch = async (id: string) => {
    try {
      setIsLoading(true);
      setError('');
      const result = await MatchAPI.getMatch(id);
      const match = result.match;
      
      // Load match state
      setGameScore(match.currentGameScore);
      setSets(match.sets);
      setCurrentSet(match.currentSet);
      setGameHistory(match.gameHistory || []);
      setGameNumber(match.gameNumber || 1);
      setIsTieBreak(match.isTieBreak || false);
      setTieBreakScore(match.tieBreakScore || {
        player1Points: 0,
        player2Points: 0,
        isComplete: false,
        server: 'player1'
      });
      setIsMatchComplete(match.status === 'completed');
      setMatchWinner(match.matchWinner || null);
      setFinalScoreline(match.finalScoreline || '');
      setShareUrl(match.shareUrl);
      setCurrentMatchId(id);
      setCurrentAdminToken(match.adminToken || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load match');
    } finally {
      setIsLoading(false);
    }
  };

  const createNewMatch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const result = await MatchAPI.createMatch(config);
      const match = result.match;
      
      console.log('Created match:', { id: match.id, adminToken: match.adminToken });
      
      setCurrentMatchId(match.id);
      setCurrentAdminToken(match.adminToken || null);
      setShareUrl(match.shareUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create match');
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  // Load existing match if matchId is provided
  useEffect(() => {
    if (matchId) {
      loadExistingMatch(matchId);
    } else {
      // Create new match
      createNewMatch();
    }
  }, [matchId, createNewMatch]);

  const updateMatch = async (updates: Partial<Match>) => {
    if (isReadOnly) return; // Don't update in read-only mode
    
    if (!currentMatchId || !currentAdminToken) {
      console.log('Missing credentials:', { currentMatchId, currentAdminToken });
      return;
    }
    
    try {
      console.log('Updating match:', { currentMatchId, currentAdminToken, updates });
      await MatchAPI.updateMatch(currentMatchId, currentAdminToken, updates);
    } catch (err) {
      console.error('Update match error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update match');
    }
  };

  const handlePoint = (scoringPlayer: Player) => {
    if (isReadOnly) return; // Don't allow scoring in read-only mode
    
    // Check if current set is already complete - if so, don't allow scoring
    const currentSetIndex = currentSet - 1;
    const currentSetData = sets[currentSetIndex];
    if (currentSetData?.isComplete) {
      return;
    }

    // Handle tiebreak scoring
    if (isTieBreak) {
      // Check if this is the final set tiebreak
      const isFinalSet = (config.matchFormat === 'best-of-3' && currentSet === 3) || 
                        (config.matchFormat === 'best-of-5' && currentSet === 5);
      const isFinalSetTieBreak = isFinalSet && config.finalSetTieBreak;
      
      const newTieBreakScore = addPointToTieBreak(
        tieBreakScore, 
        scoringPlayer, 
        config,
        isFinalSetTieBreak,
        config.finalSetTieBreakPoints
      );
      
      setTieBreakScore(newTieBreakScore);
      
      if (newTieBreakScore.isComplete) {
        // Create tiebreak history entry
        const tiebreakHistoryEntry = {
          set: currentSet,
          type: 'tiebreak',
          winner: scoringPlayer,
          score: {
            player1Points: newTieBreakScore.player1Points,
            player2Points: newTieBreakScore.player2Points
          }
        };
        
        // Create updated game history with the tiebreak entry
        const updatedGameHistory = [...gameHistory, tiebreakHistoryEntry];
        setGameHistory(updatedGameHistory);
        
        // Update set score - tiebreak winner gets +1 game to their score
        const updatedSets = [...sets];
        const currentSetData = updatedSets[currentSetIndex];
        if (scoringPlayer === 'player1') {
          updatedSets[currentSetIndex].player1Games = currentSetData.player1Games + 1;
        } else {
          updatedSets[currentSetIndex].player2Games = currentSetData.player2Games + 1;
        }
        updatedSets[currentSetIndex].isComplete = true;
        updatedSets[currentSetIndex].winner = scoringPlayer;
        
        // Store the actual tiebreak score
        updatedSets[currentSetIndex].tieBreakScore = {
          player1Points: newTieBreakScore.player1Points,
          player2Points: newTieBreakScore.player2Points
        };
        
        // Check if match is complete
        const completedSets = updatedSets.filter(set => set.isComplete);
        const player1Sets = completedSets.filter(set => set.winner === 'player1').length;
        const player2Sets = completedSets.filter(set => set.winner === 'player2').length;
        
        let matchComplete = false;
        if (config.matchFormat === 'single') {
          matchComplete = true;
        } else if (config.matchFormat === 'best-of-3') {
          matchComplete = player1Sets >= 2 || player2Sets >= 2;
        } else if (config.matchFormat === 'best-of-5') {
          matchComplete = player1Sets >= 3 || player2Sets >= 3;
        }
        
        if (matchComplete) {
          // Set match completion state
          const matchWinner = player1Sets >= player2Sets ? 'player1' : 'player2';
          const finalScoreline = formatFinalScoreline(updatedSets);
          
          setIsMatchComplete(true);
          setMatchWinner(matchWinner);
          setFinalScoreline(finalScoreline);
          
          // Add match completion history entry
          const matchCompletionEntry = {
            type: 'match-complete',
            winner: matchWinner,
            finalScoreline: finalScoreline
          };
          setGameHistory([...updatedGameHistory, matchCompletionEntry]);
          
          // Update match in backend
          updateMatch({
            status: 'completed',
            sets: updatedSets,
            isTieBreak: false,
            tieBreakScore: newTieBreakScore,
            gameHistory: [...updatedGameHistory, matchCompletionEntry],
            matchWinner,
            finalScoreline
          });
        } else {
          // Start next set
          const nextSet = currentSet + 1;
          setCurrentSet(nextSet);
          if (!updatedSets[nextSet - 1]) {
            updatedSets[nextSet - 1] = { player1Games: 0, player2Games: 0, isComplete: false };
          }
          
          // Update match in backend
          updateMatch({
            sets: updatedSets,
            currentSet: nextSet,
            isTieBreak: false,
            tieBreakScore: newTieBreakScore,
            gameHistory: [...updatedGameHistory]
          });
        }
        
        setSets(updatedSets);
        
        // Reset tiebreak state
        setIsTieBreak(false);
        setTieBreakScore({
          player1Points: 0,
          player2Points: 0,
          isComplete: false,
          server: 'player1'
        });
        
        // Reset for next game
        setGameScore({
          player1Points: 0,
          player2Points: 0,
          server: newTieBreakScore.server === 'player1' ? 'player2' : 'player1'
        });
      } else {
        // Update match in backend with tiebreak progress
        updateMatch({
          isTieBreak: true,
          tieBreakScore: newTieBreakScore
        });
      }
      return;
    }

    const newGameScore = addPointToGame(gameScore, scoringPlayer, config);
    
    setGameScore(newGameScore);
    
    // Check if this point won the game
    const gameWon = checkIfGameWon(newGameScore, scoringPlayer, config);
    
    if (gameWon) {
      // Create detailed game history entry
      const gameHistoryEntry = {
        set: currentSet,
        game: gameNumber,
        server: newGameScore.server,
        winner: scoringPlayer,
        gameScore: newGameScore,
        runningScore: {
          player1Games: (sets[currentSetIndex]?.player1Games || 0) + (scoringPlayer === 'player1' ? 1 : 0),
          player2Games: (sets[currentSetIndex]?.player2Games || 0) + (scoringPlayer === 'player2' ? 1 : 0)
        }
      };
      
      // Create updated game history with the game entry
      const updatedGameHistory = [...gameHistory, gameHistoryEntry];
      setGameHistory(updatedGameHistory);
      setGameNumber(gameNumber + 1);
      
      // Update set scores
      const updatedSets = [...sets];
      if (!updatedSets[currentSetIndex]) {
        updatedSets[currentSetIndex] = { player1Games: 0, player2Games: 0, isComplete: false };
      }
      
      if (scoringPlayer === 'player1') {
        updatedSets[currentSetIndex].player1Games += 1;
      } else {
        updatedSets[currentSetIndex].player2Games += 1;
      }
      
      // Check if tiebreak is needed BEFORE checking set completion
      const tieBreakNeeded = isTieBreakNeeded(updatedSets[currentSetIndex], config);
      if (tieBreakNeeded) {
        setIsTieBreak(true);
        setTieBreakScore({
          player1Points: 0,
          player2Points: 0,
          isComplete: false,
          server: newGameScore.server === 'player1' ? 'player2' : 'player1'
        });
        setSets(updatedSets);
        
        // Update match in backend
        updateMatch({
          sets: updatedSets,
          gameNumber: gameNumber + 1,
          isTieBreak: true,
          tieBreakScore: {
            player1Points: 0,
            player2Points: 0,
            isComplete: false,
            server: newGameScore.server === 'player1' ? 'player2' : 'player1'
          },
          gameHistory: updatedGameHistory
        });
        
        // Reset for tiebreak (no game score in tiebreak)
        setGameScore({
          player1Points: 0,
          player2Points: 0,
          server: newGameScore.server === 'player1' ? 'player2' : 'player1'
        });
        return;
      }
      
      // Check if set is complete
      const setComplete = isSetWon(updatedSets[currentSetIndex], config);
      if (setComplete) {
        updatedSets[currentSetIndex].isComplete = true;
        updatedSets[currentSetIndex].winner = scoringPlayer;
        
        // Add set win history entry to the updated game history
        const setWinHistoryEntry = {
          set: currentSet,
          type: 'set-win',
          winner: scoringPlayer,
          setNumber: currentSet
        };
        setGameHistory([...updatedGameHistory, setWinHistoryEntry]);
        
        // Check if match is complete
        const completedSets = updatedSets.filter(set => set.isComplete);
        const player1Sets = completedSets.filter(set => set.winner === 'player1').length;
        const player2Sets = completedSets.filter(set => set.winner === 'player2').length;
        
        let matchComplete = false;
        if (config.matchFormat === 'single') {
          matchComplete = true;
        } else if (config.matchFormat === 'best-of-3') {
          matchComplete = player1Sets >= 2 || player2Sets >= 2;
        } else if (config.matchFormat === 'best-of-5') {
          matchComplete = player1Sets >= 3 || player2Sets >= 3;
        }
        
        if (matchComplete) {
          // Set match completion state
          const matchWinner = player1Sets >= player2Sets ? 'player1' : 'player2';
          const finalScoreline = formatFinalScoreline(updatedSets);
          
          setIsMatchComplete(true);
          setMatchWinner(matchWinner);
          setFinalScoreline(finalScoreline);
          
          // Add match completion history entry
          const matchCompletionEntry = {
            type: 'match-complete',
            winner: matchWinner,
            finalScoreline: finalScoreline
          };
          setGameHistory([...updatedGameHistory, matchCompletionEntry]);
          
          // Update match in backend
          updateMatch({
            status: 'completed',
            sets: updatedSets,
            gameNumber: gameNumber + 1,
            gameHistory: [...updatedGameHistory, matchCompletionEntry],
            matchWinner,
            finalScoreline
          });
        } else {
          // Start next set immediately
          const nextSet = currentSet + 1;
          setCurrentSet(nextSet);
          setGameNumber(1); // Reset game number for new set
          if (!updatedSets[nextSet - 1]) {
            updatedSets[nextSet - 1] = { player1Games: 0, player2Games: 0, isComplete: false };
          }
          
          // Check if this is the final set and should be played as tiebreaker only
          const isFinalSet = (config.matchFormat === 'best-of-3' && nextSet === 3) || 
                            (config.matchFormat === 'best-of-5' && nextSet === 5);
          
          if (isFinalSet && config.finalSetTieBreak) {
            // Start final set as tiebreaker immediately
            setIsTieBreak(true);
            setTieBreakScore({
              player1Points: 0,
              player2Points: 0,
              isComplete: false,
              server: newGameScore.server === 'player1' ? 'player2' : 'player1'
            });
            
            // Update match in backend
            updateMatch({
              sets: updatedSets,
              currentSet: nextSet,
              gameNumber: 1,
              isTieBreak: true,
              tieBreakScore: {
                player1Points: 0,
                player2Points: 0,
                isComplete: false,
                server: newGameScore.server === 'player1' ? 'player2' : 'player1'
              },
              gameHistory: [...updatedGameHistory]
            });
          } else {
            // Update match in backend
            updateMatch({
              sets: updatedSets,
              currentSet: nextSet,
              gameNumber: 1,
              gameHistory: [...updatedGameHistory]
            });
          }
        }
      }
      
      setSets(updatedSets);
      
      // Update match in backend
      updateMatch({
        sets: updatedSets,
        gameNumber: gameNumber + 1,
        gameHistory: updatedGameHistory
      });
      
      // Reset for next game
      setGameScore({
        player1Points: 0,
        player2Points: 0,
        server: newGameScore.server === 'player1' ? 'player2' : 'player1'
      });
    } else {
      // Update match in backend with current game score
      updateMatch({
        currentGameScore: newGameScore
      });
    }
  };

  const handleRemovePoint = (scoringPlayer: Player) => {
    if (isReadOnly) return; // Don't allow undo in read-only mode
    
    // Check if current set is already complete - if so, don't allow scoring
    const currentSetIndex = currentSet - 1;
    const currentSetData = sets[currentSetIndex];
    if (currentSetData?.isComplete) {
      return;
    }

    // For tiebreak, we can't easily remove points since it's just incrementing numbers
    // We'll need to implement a more sophisticated undo system
    if (isTieBreak) {
      return;
    }

    const newGameScore = removePointFromGame(gameScore, scoringPlayer, config);
    
    setGameScore(newGameScore);
    
    // Update match in backend
    updateMatch({
      currentGameScore: newGameScore
    });
  };

  const handleSetServer = (player: Player) => {
    if (isReadOnly) return; // Don't allow server changes in read-only mode
    
    if (isTieBreak) {
      setTieBreakScore(prev => prev ? { ...prev, server: player } : prev);
    } else {
      setGameScore(prev => ({ ...prev, server: player }));
    }
    
    // Update match with new server
    updateMatch({
      currentGameScore: isTieBreak ? gameScore : { ...gameScore, server: player },
      tieBreakScore: isTieBreak ? (tieBreakScore ? { ...tieBreakScore, server: player } : tieBreakScore) : tieBreakScore
    });
  };

  // Check if the game was won by the scoring player
  const checkIfGameWon = (gameScore: GameScore, scoringPlayer: Player, config: MatchConfig): boolean => {
    const { player1Points, player2Points } = gameScore;
    
    if (config.scoringSystem === 'no-ad') {
      // No-ad: if scoring player reaches 40 and opponent is not at 40, game is won
      // Or if both are at 40, next point wins
      if (scoringPlayer === 'player1') {
        return (player1Points === 40 && player2Points !== 40) || 
               (player1Points === 'game');
      } else {
        return (player2Points === 40 && player1Points !== 40) || 
               (player2Points === 'game');
      }
    } else {
      // Ad scoring: only win if player has 'game' (not 'advantage')
      if (scoringPlayer === 'player1') {
        return player1Points === 'game';
      } else {
        return player2Points === 'game';
      }
    }
  };

  // Format final scoreline for completed match
  const formatFinalScoreline = (sets: SetScore[]): string => {
    return sets
      .filter(set => set.isComplete)
      .map(set => {
        if (set.tieBreakScore) {
          // Show tiebreak score (e.g., "7-6(7-5)")
          const winnerGames = set.winner === 'player1' ? set.player1Games : set.player2Games;
          const loserGames = set.winner === 'player1' ? set.player2Games : set.player1Games;
          const winnerTiebreak = set.winner === 'player1' ? set.tieBreakScore.player1Points : set.tieBreakScore.player2Points;
          const loserTiebreak = set.winner === 'player1' ? set.tieBreakScore.player2Points : set.tieBreakScore.player1Points;
          return `${winnerGames}-${loserGames}(${winnerTiebreak}-${loserTiebreak})`;
        } else {
          // Show regular set score
          return `${set.player1Games}-${set.player2Games}`;
        }
      })
      .join(', ');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading match...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="mb-4" style={{ color: TENNIS_COLORS.ERROR_RED }}>Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 text-white rounded"
            style={{ backgroundColor: TENNIS_COLORS.INFO_BLUE }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Share URL Display */}
      {shareUrl && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Share Match</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 p-2 bg-gray-700 text-white border border-gray-600 rounded"
              />
              <button
                onClick={() => navigator.clipboard.writeText(shareUrl)}
                className="px-4 py-2 text-white rounded"
                style={{ backgroundColor: TENNIS_COLORS.INFO_BLUE }}
              >
                Copy
              </button>
            </div>
            <p className="text-sm text-gray-300 mt-2">
              Share this URL with others to let them view the match in real-time
            </p>
          </CardContent>
        </Card>
      )}

      {/* Scoreboard at top */}
      <Scoreboard 
        config={config}
        currentGameScore={gameScore}
        sets={sets}
        currentSet={currentSet}
        onAddPoint={handlePoint}
        onRemovePoint={handleRemovePoint}
        isTieBreak={isTieBreak}
        tieBreakScore={tieBreakScore}
        onSetServer={handleSetServer}
        isMatchComplete={isMatchComplete}
        matchWinner={matchWinner}
        finalScoreline={finalScoreline}
      />

      {/* Game History */}
      {gameHistory.length > 0 && !isTieBreak && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Game History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {gameHistory.map((entry, index) => {
                if (entry.type === 'match-complete') {
                  // Display match completion result
                  const winnerName = entry.winner === 'player1' ? config.player1Name : config.player2Name;
                  
                  return (
                    <div key={index} className="p-3 border rounded" style={{ backgroundColor: TENNIS_COLORS.LIGHT_BLUE, borderColor: TENNIS_COLORS.INFO_BLUE }}>
                      <div className="text-sm font-medium mb-1" style={{ color: TENNIS_COLORS.INFO_BLUE }}>
                        🏆 MATCH COMPLETE! 🏆
                      </div>
                      <div className="text-sm font-medium" style={{ color: TENNIS_COLORS.INFO_BLUE }}>
                        Winner: {winnerName}
                      </div>
                      <div className="text-sm font-medium" style={{ color: TENNIS_COLORS.INFO_BLUE }}>
                        Final Score: {entry.finalScoreline}
                      </div>
                    </div>
                  );
                } else if (entry.type === 'set-win') {
                  // Display set win result
                  const winnerName = entry.winner === 'player1' ? config.player1Name : config.player2Name;
                  
                  return (
                    <div key={index} className="p-3 border rounded" style={{ backgroundColor: TENNIS_COLORS.LIGHT_GREEN, borderColor: TENNIS_COLORS.SUCCESS_GREEN }}>
                      <div className="text-sm font-medium" style={{ color: TENNIS_COLORS.SUCCESS_GREEN }}>
                        {winnerName} wins Set {entry.setNumber}.
                      </div>
                    </div>
                  );
                } else if (entry.type === 'tiebreak') {
                  // Display tiebreak result
                  const winnerName = entry.winner === 'player1' ? config.player1Name : config.player2Name;
                  
                  return (
                    <div key={index} className="p-3 bg-orange-50 border border-orange-200 ">
                      <div className="text-sm font-medium text-orange-800">
                        Set {entry.set}, Tiebreak: {winnerName} won {entry.score.player1Points}-{entry.score.player2Points}
                      </div>
                    </div>
                  );
                } else {
                  // Display regular game result
                  const serverName = entry.server === 'player1' ? config.player1Name : config.player2Name;
                  const winnerName = entry.winner === 'player1' ? config.player1Name : config.player2Name;
                  const player1Name = config.player1Name;
                  const player2Name = config.player2Name;
                  
                  return (
                    <div key={index} className="p-3 bg-muted ">
                      <div className="text-sm font-medium">
                        Set {entry.set}, Game {entry.game}: {serverName} serving, {winnerName} won.
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Score: {player1Name}: {entry.runningScore.player1Games}, {player2Name}: {entry.runningScore.player2Games}
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GameScorer; 