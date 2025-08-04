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
  onSetServer: (player: Player) => void;
  isTieBreak?: boolean;
  tieBreakScore?: TieBreakScore;
  isMatchComplete?: boolean;
  matchWinner?: Player | null;
  finalScoreline?: string;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ 
  config, 
  currentGameScore, 
  sets, 
  currentSet, 
  onAddPoint, 
  onRemovePoint,
  onSetServer,
  isTieBreak = false,
  tieBreakScore,
  isMatchComplete,
  matchWinner,
  finalScoreline
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

  const getPointColorStyle = (point: number | string) => {
    if (point === 'advantage') return { color: '#4CAF50', fontWeight: 'bold' }; // Lime Green
    if (point === 'game') return { color: '#4CAF50', fontWeight: 'bold' }; // Lime Green
    return { color: '#4CAF50' }; // Lime Green
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
      const hasStarted = set && (set.player1Games > 0 || set.player2Games > 0);
      
      let setClass = "text-lg font-bold";
      let setStyle = { color: '#4CAF50' }; // Lime Green
      let cellClass = "p-4 text-center border-r";
      let cellStyle: React.CSSProperties = { borderColor: '#808080' }; // Steel Blue
      
      if (isComplete) {
        if (set?.winner === 'player1') {
          cellStyle = { ...cellStyle, backgroundColor: 'rgba(198, 237, 44, 0.2)' };
        }
      } else if (tieBreakNeeded) {
        // Keep lime green color for tiebreak scores
      } else if (isCurrentSet) {
        // Keep lime green color for current set
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
      
      columns.push({
        key: i,
        content: hasStarted ? (
          <>
            <div className={setClass} style={setStyle}>
              {formatSetScore(sets[i]?.player1Games || 0, true)}
            </div>
          </>
        ) : (
          <div className={setClass} style={setStyle}>
            &nbsp;
          </div>
        ),
        cellClass: cellClass,
        cellStyle: cellStyle
      });
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
      const hasStarted = set && (set.player1Games > 0 || set.player2Games > 0);
      
      let setClass = "text-lg font-bold";
      let setStyle = { color: '#4CAF50' }; // Lime Green
      let cellClass = "p-4 text-center border-r";
      let cellStyle: React.CSSProperties = { borderColor: '#808080' }; // Steel Blue
      
      if (isComplete) {
        if (set?.winner === 'player2') {
          cellStyle = { ...cellStyle, backgroundColor: 'rgba(198, 237, 44, 0.2)' };
        }
      } else if (tieBreakNeeded) {
        // Keep lime green color for tiebreak scores
      } else if (isCurrentSet) {
        // Keep lime green color for current set
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
      
      columns.push({
        key: i,
        content: hasStarted ? (
          <>
            <div className={setClass} style={setStyle}>
              {formatSetScore(sets[i]?.player2Games || 0, false)}
            </div>
          </>
        ) : (
          <div className={setClass} style={setStyle}>
            &nbsp;
          </div>
        ),
        cellClass: cellClass,
        cellStyle: cellStyle
      });
    }
    return columns;
  };

  // Check if current set is complete
  const currentSetData = sets[currentSet - 1];
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

  const getCurrentScoreColorStyle = (player: Player) => {
    if (isTieBreak) {
      return { color: '#4CAF50', fontWeight: 'bold' }; // Lime Green
    }
    if (player === 'player1') {
      return getPointColorStyle(currentGameScore.player1Points);
    } else {
      return getPointColorStyle(currentGameScore.player2Points);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-0">
        <div className="bg-gray-900 text-white rounded-lg overflow-hidden">
                      {/* Header */}
            <div className="bg-gray-800 px-6 py-3 border-b border-gray-700">
              <h2 className="text-xl font-bold text-center" style={{ color: '#4CAF50' }}>
                MatchSync
              </h2>
            </div>

            {/* Match Completion Announcement */}
            {isMatchComplete && matchWinner && finalScoreline && (
              <div className="bg-green-600 px-6 py-4 border-b border-green-700">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-white mb-1">
                    🏆 MATCH COMPLETE! 🏆
                  </h3>
                  <p className="text-white font-semibold">
                    Winner: {matchWinner === 'player1' ? config.player1Name : config.player2Name}
                  </p>
                  <p className="text-white text-sm mt-1">
                    Final Score: {finalScoreline}
                  </p>
                </div>
              </div>
            )}

          {/* Scoreboard Content */}
          <div className="p-6">
            {/* Set Labels Row */}
            <div 
              className="grid gap-0 mb-4"
              style={{ 
                gridTemplateColumns: `120px 1fr repeat(${setCount}, 80px) 80px`,
                gridTemplateAreas: `"buttons player1 ${Array.from({length: setCount}, (_, i) => `set${i+1}`).join(' ')} game1"`
              }}
            >
              {/* Empty Buttons Column */}
              <div></div>

              {/* Empty Player Column */}
              <div></div>

              {/* Set Labels */}
              {Array.from({length: setCount}, (_, i) => (
                <div 
                  key={i}
                  className="text-center"
                  style={{ gridArea: `set${i + 1}` }}
                >
                  <span className="text-xs" style={{ color: '#808080' }}>Set {i + 1}</span>
                </div>
              ))}

              {/* Empty Game Column */}
                              <div className="text-center">
                  <span className="text-xs" style={{ color: '#808080' }}>Game</span>
                </div>
            </div>

            {/* Player Names Row */}
            <div 
              className="grid gap-0 mb-4 border rounded-lg overflow-hidden"
              style={{ 
                gridTemplateColumns: `120px 1fr repeat(${setCount}, 80px) 80px`,
                gridTemplateAreas: `"buttons player1 ${Array.from({length: setCount}, (_, i) => `set${i+1}`).join(' ')} game1"`,
                borderColor: '#4A90E2' // Blue
              }}
            >
              {/* Scoring Buttons Column for Player 1 */}
              <div className="p-4 border-r bg-gray-800" style={{ borderColor: '#4A90E2' }}>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className={`aspect-square h-10 w-10 p-0 text-lg text-white ${
                        currentSetComplete 
                          ? 'bg-gray-600 border-gray-500 cursor-not-allowed' 
                          : 'hover:bg-opacity-80'
                      }`}
                      style={{
                        backgroundColor: currentSetComplete ? '#666' : '#339966',
                        borderColor: currentSetComplete ? '#666' : '#339966'
                      }}
                      onClick={() => onAddPoint('player1')}
                      disabled={currentSetComplete}
                    >
                      +
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className={`aspect-square h-10 w-10 p-0 text-xs text-white ${
                        currentSetComplete 
                          ? 'bg-gray-600 border-gray-500 cursor-not-allowed' 
                          : 'hover:bg-opacity-80'
                      }`}
                      style={{
                        backgroundColor: currentSetComplete ? '#666' : '#666',
                        borderColor: currentSetComplete ? '#666' : '#666'
                      }}
                      onClick={() => onRemovePoint('player1')}
                      disabled={currentSetComplete}
                    >
                      −
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 px-2 text-xs text-white hover:bg-opacity-80"
                    style={{
                      backgroundColor: '#4A90E2',
                      borderColor: '#4A90E2'
                    }}
                    onClick={() => onSetServer('player1')}
                  >
                    Make Server
                  </Button>
                </div>
              </div>

              {/* Player 1 Column */}
              <div className="p-4 border-r bg-gray-800 flex items-center" style={{ borderColor: '#4A90E2' }}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#4A90E2' }}>
                      <span className="text-white text-xs">★</span>
                    </div>
                    <span className="font-semibold text-sm" style={{ color: '#FFFFFF' }}>{config.player1Name}</span>
                  </div>
                  {isTieBreak && tieBreakScore && tieBreakScore.server === 'player1' && (
                    <div className="w-5 h-5 rounded-full" style={{ backgroundColor: '#4CAF50' }}></div>
                  )}
                  {!isTieBreak && currentGameScore.server === 'player1' && (
                    <div className="w-5 h-5 rounded-full" style={{ backgroundColor: '#4CAF50' }}></div>
                  )}
                </div>
              </div>

              {/* Set Columns for Player 1 */}
              {renderSetColumns().map((column, index) => (
                <div 
                  key={column.key} 
                  className={`${column.cellClass} flex items-center justify-center`}
                  style={{ ...column.cellStyle, gridArea: `set${index + 1}` }}
                >
                  {column.content}
                </div>
              ))}

              {/* Game Score Column for Player 1 */}
              <div className="p-4 text-center border-r flex items-center justify-center" style={{ borderColor: '#4A90E2' }}>
                <div className="text-lg font-bold" style={getCurrentScoreColorStyle('player1')}>
                  {getCurrentScore('player1')}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px my-4" style={{ backgroundColor: '#4A90E2' }}></div>

            {/* Player 2 Row */}
            <div 
              className="grid gap-0 border rounded-lg overflow-hidden"
              style={{ 
                gridTemplateColumns: `120px 1fr repeat(${setCount}, 80px) 80px`,
                gridTemplateAreas: `"buttons player2 ${Array.from({length: setCount}, (_, i) => `set${i+1}`).join(' ')} game2"`,
                borderColor: '#4A90E2'
              }}
            >
              {/* Scoring Buttons Column for Player 2 */}
              <div className="p-4 border-r bg-gray-800" style={{ borderColor: '#4A90E2' }}>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className={`aspect-square h-10 w-10 p-0 text-lg text-white ${
                        currentSetComplete 
                          ? 'bg-gray-600 border-gray-500 cursor-not-allowed' 
                          : 'hover:bg-opacity-80'
                      }`}
                      style={{
                        backgroundColor: currentSetComplete ? '#666' : '#339966',
                        borderColor: currentSetComplete ? '#666' : '#339966'
                      }}
                      onClick={() => onAddPoint('player2')}
                      disabled={currentSetComplete}
                    >
                      +
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className={`aspect-square h-10 w-10 p-0 text-xs text-white ${
                        currentSetComplete 
                          ? 'bg-gray-600 border-gray-500 cursor-not-allowed' 
                          : 'hover:bg-opacity-80'
                      }`}
                      style={{
                        backgroundColor: currentSetComplete ? '#666' : '#666',
                        borderColor: currentSetComplete ? '#666' : '#666'
                      }}
                      onClick={() => onRemovePoint('player2')}
                      disabled={currentSetComplete}
                    >
                      −
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 px-2 text-xs text-white hover:bg-opacity-80"
                    style={{
                      backgroundColor: '#4A90E2',
                      borderColor: '#4A90E2'
                    }}
                    onClick={() => onSetServer('player2')}
                  >
                    Make Server
                  </Button>
                </div>
              </div>

              {/* Player 2 Column */}
              <div className="p-4 border-r bg-gray-800 flex items-center" style={{ borderColor: '#4A90E2' }}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#FF9800' }}>
                      <span className="text-white text-xs">●</span>
                    </div>
                    <span className="font-semibold text-sm" style={{ color: '#FFFFFF' }}>{config.player2Name}</span>
                  </div>
                  {isTieBreak && tieBreakScore && tieBreakScore.server === 'player2' && (
                    <div className="w-5 h-5 rounded-full" style={{ backgroundColor: '#4CAF50' }}></div>
                  )}
                  {!isTieBreak && currentGameScore.server === 'player2' && (
                    <div className="w-5 h-5 rounded-full" style={{ backgroundColor: '#4CAF50' }}></div>
                  )}
                </div>
              </div>

              {/* Set Columns for Player 2 */}
              {renderSetColumnsPlayer2().map((column, index) => (
                <div 
                  key={column.key} 
                  className={`${column.cellClass} flex items-center justify-center`}
                  style={{ ...column.cellStyle, gridArea: `set${index + 1}` }}
                >
                  {column.content}
                </div>
              ))}

              {/* Game Score Column for Player 2 */}
              <div className="p-4 text-center flex items-center justify-center">
                <div className="text-lg font-bold" style={getCurrentScoreColorStyle('player2')}>
                  {getCurrentScore('player2')}
                </div>
              </div>
            </div>

            {/* Match Info */}
            <div className="mt-6 pt-4 border-t" style={{ borderColor: '#4A90E2' }}>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <span style={{ color: '#FFFFFF' }}>Format:</span>
                  <span className="ml-2 font-semibold" style={{ color: '#FFFFFF' }}>
                    {config.matchFormat === 'single' ? 'Single Set' : 
                     config.matchFormat === 'best-of-3' ? 'Best of 3' : 'Best of 5'}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#FFFFFF' }}>Set Duration:</span>
                  <span className="ml-2 font-semibold" style={{ color: '#FFFFFF' }}>{config.setDuration} games</span>
                </div>
                <div>
                  <span style={{ color: '#FFFFFF' }}>Scoring:</span>
                  <span className="ml-2 font-semibold" style={{ color: '#FFFFFF' }}>
                    {config.scoringSystem === 'ad' ? 'Ad' : 'No-Ad'}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#FFFFFF' }}>Tie-Break:</span>
                  <span className="ml-2 font-semibold" style={{ color: '#FFFFFF' }}>
                    {config.tieBreakRules === 'none' ? 'None' : 
                     config.tieBreakRules === '7-point' ? '7-Point' : '10-Point'}
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