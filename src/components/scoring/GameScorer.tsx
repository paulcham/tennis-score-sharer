import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { GameScore, MatchConfig, Player, SetScore, TieBreakScore } from '../../types/Scoring';
import { addPointToGame, removePointFromGame, isSetWon, isTieBreakNeeded, addPointToTieBreak } from '../../utils/scoring';
import Scoreboard from './Scoreboard';

interface GameScorerProps {
  config: MatchConfig;
}

const GameScorer: React.FC<GameScorerProps> = ({ config }) => {
  const [gameScore, setGameScore] = useState<GameScore>({
    player1Points: 0,
    player2Points: 0,
    server: 'player1'
  });

  const [sets, setSets] = useState<SetScore[]>([
    { player1Games: 0, player2Games: 0, isComplete: false }
  ]);

  const [currentSet, setCurrentSet] = useState(1);
  const [gameHistory, setGameHistory] = useState<any[]>([]); // Changed type to any[] to accommodate new structure
  const [gameNumber, setGameNumber] = useState(1);
  
  // Tiebreak state
  const [isTieBreak, setIsTieBreak] = useState(false);
  const [tieBreakScore, setTieBreakScore] = useState<TieBreakScore>({
    player1Points: 0,
    player2Points: 0,
    isComplete: false,
    server: 'player1'
  });

  const handlePoint = (scoringPlayer: Player) => {
    // Check if current set is already complete - if so, don't allow scoring
    const currentSetIndex = currentSet - 1;
    const currentSetData = sets[currentSetIndex];
    if (currentSetData?.isComplete) {
      console.log(`Set ${currentSet} is already complete. Cannot score more points.`);
      return;
    }

    // Handle tiebreak scoring
    if (isTieBreak) {
      const newTieBreakScore = addPointToTieBreak(tieBreakScore, scoringPlayer, config);
      console.log('Tiebreak point scored:', scoringPlayer);
      console.log('Current tiebreak score:', tieBreakScore);
      console.log('New tiebreak score:', newTieBreakScore);
      console.log('Server changed from', tieBreakScore.server, 'to', newTieBreakScore.server);
      
      setTieBreakScore(newTieBreakScore);
      
      if (newTieBreakScore.isComplete) {
        console.log(`Tiebreak complete! Winner: ${scoringPlayer}`);
        
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
        
        setGameHistory([...gameHistory, tiebreakHistoryEntry]);
        
        // Update set score based on set duration (tiebreak winner wins the set)
        const updatedSets = [...sets];
        const setDuration = config.setDuration;
        if (scoringPlayer === 'player1') {
          updatedSets[currentSetIndex].player1Games = setDuration;
          updatedSets[currentSetIndex].player2Games = setDuration - 1;
        } else {
          updatedSets[currentSetIndex].player1Games = setDuration - 1;
          updatedSets[currentSetIndex].player2Games = setDuration;
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
          console.log('Match complete!');
          // Could add match completion logic here
        } else {
          // Start next set
          const nextSet = currentSet + 1;
          setCurrentSet(nextSet);
          if (!updatedSets[nextSet - 1]) {
            updatedSets[nextSet - 1] = { player1Games: 0, player2Games: 0, isComplete: false };
          }
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
      }
      return;
    }

    const newGameScore = addPointToGame(gameScore, scoringPlayer, config);
    console.log('Before point:', gameScore);
    console.log('After point:', newGameScore);
    console.log('Scoring player:', scoringPlayer);
    console.log('Config scoring system:', config.scoringSystem);
    
    // Debug advantage scenarios
    if (gameScore.player1Points === 'advantage' || gameScore.player2Points === 'advantage') {
      console.log('ADVANTAGE SCENARIO:');
      console.log('  Player 1 had advantage:', gameScore.player1Points === 'advantage');
      console.log('  Player 2 had advantage:', gameScore.player2Points === 'advantage');
      console.log('  Scoring player:', scoringPlayer);
      console.log('  New scores:', newGameScore);
    }
    
    setGameScore(newGameScore);
    
    // Check if this point won the game
    const gameWon = checkIfGameWon(newGameScore, scoringPlayer, config);
    console.log('Game won:', gameWon);
    
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
      
      setGameHistory([...gameHistory, gameHistoryEntry]);
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
        console.log('Tiebreak needed! Starting tiebreak...');
        setIsTieBreak(true);
        setTieBreakScore({
          player1Points: 0,
          player2Points: 0,
          isComplete: false,
          server: newGameScore.server === 'player1' ? 'player2' : 'player1'
        });
        setSets(updatedSets);
        
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
        console.log(`Set ${currentSet} complete! Winner: ${scoringPlayer}`);
        
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
          console.log('Match complete!');
          // Could add match completion logic here
        } else {
          // Start next set immediately
          const nextSet = currentSet + 1;
          setCurrentSet(nextSet);
          setGameNumber(1); // Reset game number for new set
          if (!updatedSets[nextSet - 1]) {
            updatedSets[nextSet - 1] = { player1Games: 0, player2Games: 0, isComplete: false };
          }
        }
      }
      
      setSets(updatedSets);
      
      // Reset for next game
      setGameScore({
        player1Points: 0,
        player2Points: 0,
        server: newGameScore.server === 'player1' ? 'player2' : 'player1'
      });
    }
  };

  const handleRemovePoint = (scoringPlayer: Player) => {
    // Check if current set is already complete - if so, don't allow scoring
    const currentSetIndex = currentSet - 1;
    const currentSetData = sets[currentSetIndex];
    if (currentSetData?.isComplete) {
      console.log(`Set ${currentSet} is already complete. Cannot remove points.`);
      return;
    }

    // For tiebreak, we can't easily remove points since it's just incrementing numbers
    // We'll need to implement a more sophisticated undo system
    if (isTieBreak) {
      console.log('Tiebreak point removal not implemented yet');
      return;
    }

    const newGameScore = removePointFromGame(gameScore, scoringPlayer, config);
    console.log('Before removing point:', gameScore);
    console.log('After removing point:', newGameScore);
    console.log('Removing point for player:', scoringPlayer);
    
    setGameScore(newGameScore);
  };

  const handleSetServer = (player: Player) => {
    console.log('Setting server to:', player);
    
    if (isTieBreak) {
      // Update tiebreak server
      setTieBreakScore(prev => ({
        ...prev,
        server: player
      }));
    } else {
      // Update game server
      setGameScore(prev => ({
        ...prev,
        server: player
      }));
    }
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

  return (
    <div className="space-y-6 w-full">
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
      />

      {/* Game History */}
      {gameHistory.length > 0 && !isTieBreak && (
        <Card>
          <CardHeader>
            <CardTitle>Game History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {gameHistory.map((entry, index) => {
                if (entry.type === 'tiebreak') {
                  // Display tiebreak result
                  const winnerName = entry.winner === 'player1' ? config.player1Name : config.player2Name;
                  
                  return (
                    <div key={index} className="p-3 bg-orange-50 border border-orange-200 rounded">
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
                    <div key={index} className="p-3 bg-muted rounded">
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