import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { GameScore, SetScore, MatchConfig, Player, TieBreakScore } from '../../types/Scoring';
import { isTieBreakNeeded } from '../../utils/scoring';

interface ScoreboardProps {
  config: MatchConfig;
  currentGameScore: GameScore;
  sets: SetScore[];
  currentSet: number;
  onAddPoint: (player: Player) => void;
  onRemovePoint: (player: Player) => void;
  isTieBreak?: boolean;
  tieBreakScore?: TieBreakScore;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ 
  config, 
  currentGameScore, 
  sets, 
  currentSet, 
  onAddPoint, 
  onRemovePoint,
  isTieBreak = false,
  tieBreakScore
}) => {
  const formatPoint = (point: number | string, opponentPoint?: number | string): string => {
    if (point === 0) {
      // Show blank only if opponent has advantage
      if (opponentPoint === 'advantage') return '';
      return '0';
    }
    if (point === 15) return '15';
    if (point === 30) return '30';
    if (point === 40) return '40';
    if (point === 'advantage') return 'Ad';
    if (point === 'game') return 'Game!';
    return String(point);
  };

  const getPointColor = (point: number | string): string => {
    if (point === 'advantage') return 'text-green-600 font-bold';
    if (point === 'game') return 'text-green-700 font-bold';
    return 'text-green-500';
  };

  // Determine how many sets to show based on match format
  const getSetCount = () => {
    switch (config.matchFormat) {
      case 'single':
        return 1;
      case 'best-of-3':
        return 3;
      case 'best-of-5':
        return 5;
      default:
        return 3;
    }
  };

  const setCount = getSetCount();

  // Generate set columns dynamically
  const renderSetColumns = () => {
    const columns = [];
    for (let i = 0; i < setCount; i++) {
      const set = sets[i];
      const isComplete = set?.isComplete || false;
      const isCurrentSet = i === currentSet - 1;
      const tieBreakNeeded = set && isTieBreakNeeded(set, config);
      
      let setClass = "text-lg font-bold text-green-400";
      if (isComplete) {
        setClass = "text-lg font-bold text-yellow-400";
      } else if (tieBreakNeeded) {
        setClass = "text-lg font-bold text-orange-400";
      } else if (isCurrentSet) {
        setClass = "text-lg font-bold text-blue-400";
      }
      
      // Format set score with tiebreak superscript if applicable
      const formatSetScore = (games: number, isPlayer1: boolean) => {
        if (isComplete && set?.tieBreakScore) {
          const tiebreakPoints = isPlayer1 ? set.tieBreakScore.player1Points : set.tieBreakScore.player2Points;
          return <span>{games}<sup className="text-xs font-normal">{tiebreakPoints}</sup></span>;
        } else {
          return games;
        }
      };
      
      columns.push(
        <div key={i} className="text-center">
          <span className="text-xs text-gray-400">Set {i + 1}</span>
          <div className={setClass}>
            {formatSetScore(sets[i]?.player1Games || 0, true)}
          </div>
          {isComplete && (
            <div className="text-xs text-yellow-400">
              {set?.winner === 'player1' ? '✓' : '✗'}
            </div>
          )}
          {tieBreakNeeded && (
            <div className="text-xs text-orange-400">TB</div>
          )}
        </div>
      );
    }
    return columns;
  };

  const renderSetColumnsPlayer2 = () => {
    const columns = [];
    for (let i = 0; i < setCount; i++) {
      const set = sets[i];
      const isComplete = set?.isComplete || false;
      const isCurrentSet = i === currentSet - 1;
      const tieBreakNeeded = set && isTieBreakNeeded(set, config);
      
      let setClass = "text-lg font-bold text-green-400";
      if (isComplete) {
        setClass = "text-lg font-bold text-yellow-400";
      } else if (tieBreakNeeded) {
        setClass = "text-lg font-bold text-orange-400";
      } else if (isCurrentSet) {
        setClass = "text-lg font-bold text-blue-400";
      }
      
      // Format set score with tiebreak superscript if applicable
      const formatSetScore = (games: number, isPlayer1: boolean) => {
        if (isComplete && set?.tieBreakScore) {
          const tiebreakPoints = isPlayer1 ? set.tieBreakScore.player1Points : set.tieBreakScore.player2Points;
          return <span>{games}<sup className="text-xs font-normal">{tiebreakPoints}</sup></span>;
        } else {
          return games;
        }
      };
      
      columns.push(
        <div key={i} className="text-center">
          <div className={setClass}>
            {formatSetScore(sets[i]?.player2Games || 0, false)}
          </div>
          {isComplete && (
            <div className="text-xs text-yellow-400">
              {set?.winner === 'player2' ? '✓' : '✗'}
            </div>
          )}
          {tieBreakNeeded && (
            <div className="text-xs text-orange-400">TB</div>
          )}
        </div>
      );
    }
    return columns;
  };

  // Check if current set needs tiebreak
  const currentSetData = sets[currentSet - 1];
  const tieBreakNeeded = currentSetData && isTieBreakNeeded(currentSetData, config);
  const currentSetComplete = currentSetData?.isComplete || false;

  // Format current game/tiebreak score for individual player
  const getCurrentScore = (player: Player) => {
    if (isTieBreak && tieBreakScore) {
      return player === 'player1' ? tieBreakScore.player1Points : tieBreakScore.player2Points;
    } else {
      if (player === 'player1') {
        return formatPoint(currentGameScore.player1Points, currentGameScore.player2Points);
      } else {
        return formatPoint(currentGameScore.player2Points, currentGameScore.player1Points);
      }
    }
  };

  const getCurrentScoreColor = (player: Player) => {
    if (isTieBreak) {
      return 'text-orange-400 font-bold';
    }
    if (player === 'player1') {
      return getPointColor(currentGameScore.player1Points);
    } else {
      return getPointColor(currentGameScore.player2Points);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-0">
        <div className="bg-gray-900 text-white rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gray-800 px-6 py-3 border-b border-gray-700">
            <h2 className="text-xl font-bold text-center text-yellow-400">
              Tennis Match
            </h2>
            {tieBreakNeeded && !isTieBreak && (
              <div className="text-center mt-2">
                <span className="text-orange-400 text-sm font-semibold">
                  ⚠️ Tiebreak needed at {config.setDuration}-{config.setDuration}
                </span>
              </div>
            )}
            {isTieBreak && (
              <div className="text-center mt-2">
                <span className="text-orange-400 text-sm font-semibold">
                  🎾 Tiebreak in Progress
                </span>
              </div>
            )}
            {currentSetComplete && (
              <div className="text-center mt-2">
                <span className="text-yellow-400 text-sm font-semibold">
                  ✓ Set {currentSet} Complete! Starting Set {currentSet + 1}
                </span>
              </div>
            )}
          </div>

          {/* Scoreboard Content */}
          <div className="p-6">
            {/* Player Names Row */}
            <div className={`grid gap-4 mb-4`} style={{ gridTemplateColumns: `1fr repeat(${setCount}, 1fr) 1fr` }}>
              <div className="flex items-center">
                {/* Scoring Controls for Player 1 */}
                <div className="flex items-center gap-2 mr-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className={`h-10 w-10 p-0 text-lg border-green-500 text-white ${
                      currentSetComplete 
                        ? 'bg-gray-600 border-gray-500 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                    onClick={() => onAddPoint('player1')}
                    disabled={currentSetComplete}
                  >
                    +
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={`h-6 w-6 p-0 text-xs border-red-500 text-white ${
                      currentSetComplete 
                        ? 'bg-gray-600 border-gray-500 cursor-not-allowed' 
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                    onClick={() => onRemovePoint('player1')}
                    disabled={currentSetComplete}
                  >
                    −
                  </Button>
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs">★</span>
                </div>
                <span className="font-semibold text-sm">{config.player1Name}</span>
                {currentGameScore.server === 'player1' && (
                  <span className="ml-2 text-yellow-500 text-lg">🎾</span>
                )}
              </div>
              {renderSetColumns()}
              <div className="text-center">
                <span className="text-xs text-gray-400">Game</span>
                <div className={`text-lg font-bold ${getCurrentScoreColor('player1')}`}>
                  {getCurrentScore('player1')}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-700 my-4"></div>

            {/* Player 2 Row */}
            <div className={`grid gap-4`} style={{ gridTemplateColumns: `1fr repeat(${setCount}, 1fr) 1fr` }}>
              <div className="flex items-center">
                {/* Scoring Controls for Player 2 */}
                <div className="flex items-center gap-2 mr-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className={`h-10 w-10 p-0 text-lg border-green-500 text-white ${
                      currentSetComplete 
                        ? 'bg-gray-600 border-gray-500 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                    onClick={() => onAddPoint('player2')}
                    disabled={currentSetComplete}
                  >
                    +
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={`h-6 w-6 p-0 text-xs border-red-500 text-white ${
                      currentSetComplete 
                        ? 'bg-gray-600 border-gray-500 cursor-not-allowed' 
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                    onClick={() => onRemovePoint('player2')}
                    disabled={currentSetComplete}
                  >
                    −
                  </Button>
                </div>
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs">●</span>
                </div>
                <span className="font-semibold text-sm">{config.player2Name}</span>
                {currentGameScore.server === 'player2' && (
                  <span className="ml-2 text-yellow-500 text-lg">🎾</span>
                )}
              </div>
              {renderSetColumnsPlayer2()}
              <div className="text-center">
                <div className={`text-lg font-bold ${getCurrentScoreColor('player2')}`}>
                  {getCurrentScore('player2')}
                </div>
              </div>
            </div>

            {/* Match Info */}
            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Format:</span>
                  <span className="ml-2 font-semibold">
                    {config.matchFormat === 'single' ? 'Single Set' : 
                     config.matchFormat === 'best-of-3' ? 'Best of 3' : 'Best of 5'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Set Duration:</span>
                  <span className="ml-2 font-semibold">{config.setDuration} games</span>
                </div>
                <div>
                  <span className="text-gray-400">Scoring:</span>
                  <span className="ml-2 font-semibold">
                    {config.scoringSystem === 'ad' ? 'Ad' : 'No-Ad'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Scoreboard; 