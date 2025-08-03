import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { GameScore, MatchConfig, Player, SetScore } from '../../types/Scoring';
import { addPointToGame } from '../../utils/scoring';
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

  const [currentSet] = useState(1);
  const [gameHistory, setGameHistory] = useState<GameScore[]>([]);

  const handlePoint = (scoringPlayer: Player) => {
    const newGameScore = addPointToGame(gameScore, scoringPlayer, config);
    setGameScore(newGameScore);
    
    // Check if this point won the game
    const gameWon = checkIfGameWon(newGameScore, scoringPlayer, config);
    if (gameWon) {
      setGameHistory([...gameHistory, newGameScore]);
      
      // Update set scores
      const currentSetIndex = currentSet - 1;
      const updatedSets = [...sets];
      if (!updatedSets[currentSetIndex]) {
        updatedSets[currentSetIndex] = { player1Games: 0, player2Games: 0, isComplete: false };
      }
      
      if (scoringPlayer === 'player1') {
        updatedSets[currentSetIndex].player1Games += 1;
      } else {
        updatedSets[currentSetIndex].player2Games += 1;
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

  // Check if the game was won by the scoring player
  const checkIfGameWon = (gameScore: GameScore, scoringPlayer: Player, config: MatchConfig): boolean => {
    const { player1Points, player2Points } = gameScore;
    
    if (config.scoringSystem === 'no-ad') {
      // No-ad: if scoring player reaches 40 and opponent is not at 40, game is won
      if (scoringPlayer === 'player1') {
        return player1Points === 40 && player2Points !== 40;
      } else {
        return player2Points === 40 && player1Points !== 40;
      }
    } else {
      // Ad scoring: if scoring player has advantage or game, game is won
      if (scoringPlayer === 'player1') {
        return player1Points === 'advantage' || player1Points === 'game';
      } else {
        return player2Points === 'advantage' || player2Points === 'game';
      }
    }
  };

  const formatPoint = (point: number | string): string => {
    if (point === 0) return '0';
    if (point === 15) return '15';
    if (point === 30) return '30';
    if (point === 40) return '40';
    if (point === 'deuce') return 'Deuce';
    if (point === 'advantage') return 'Ad';
    if (point === 'game') return 'Game!';
    return String(point);
  };

  const getPointColor = (point: number | string): string => {
    if (point === 'advantage') return 'text-green-600 font-bold';
    if (point === 'deuce') return 'text-blue-600 font-bold';
    if (point === 'game') return 'text-green-700 font-bold text-lg';
    return '';
  };

  return (
    <div className="space-y-6 w-full">
      {/* Scoreboard */}
      <Scoreboard 
        config={config}
        currentGameScore={gameScore}
        sets={sets}
        currentSet={currentSet}
      />

      {/* Scoring Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Scoring Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <h3 className="font-semibold mb-2">{config.player1Name}</h3>
              <div className={`text-2xl font-bold ${getPointColor(gameScore.player1Points)}`}>
                {formatPoint(gameScore.player1Points)}
              </div>
              <Button 
                onClick={() => handlePoint('player1')}
                className="mt-2 w-full"
              >
                Point
              </Button>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">{config.player2Name}</h3>
              <div className={`text-2xl font-bold ${getPointColor(gameScore.player2Points)}`}>
                {formatPoint(gameScore.player2Points)}
              </div>
              <Button 
                onClick={() => handlePoint('player2')}
                className="mt-2 w-full"
              >
                Point
              </Button>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Server: {gameScore.server === 'player1' ? config.player1Name : config.player2Name}
            </p>
            <p className="text-sm text-muted-foreground">
              Scoring: {config.scoringSystem === 'ad' ? 'Ad' : 'No-Ad'}
            </p>
          </div>
        </CardContent>
      </Card>

      {gameHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Game History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {gameHistory.map((game, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                  <span className="text-sm">
                    Game {index + 1}: {formatPoint(game.player1Points)} - {formatPoint(game.player2Points)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {game.server === 'player1' ? config.player1Name : config.player2Name} served
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GameScorer; 