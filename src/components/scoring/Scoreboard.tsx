import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { GameScore, SetScore, MatchConfig, Player, TieBreakScore } from '../../types/Scoring';
import { TENNIS_COLORS } from '../../lib/colors';

interface ScoreboardProps {
  config: MatchConfig;
  currentGameScore: GameScore;
  sets: SetScore[];
  currentSet: number;
  onAddPoint: (player: Player) => void;
  onRemovePoint: (player: Player) => void;
  onSetServer: (player: Player) => void;
  onAdjustGameScore?: (player: Player, adjustment: number) => void;
  onAdjustSetScore?: (setIndex: number, player: Player, adjustment: number) => void;
  isTieBreak?: boolean;
  tieBreakScore?: TieBreakScore;
  isMatchComplete?: boolean;
  matchWinner?: Player | null;
  finalScoreline?: string;
  isReadOnly?: boolean;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ 
  config, 
  currentGameScore, 
  sets, 
  currentSet, 
  onAddPoint, 
  onRemovePoint,
  onSetServer,
  onAdjustGameScore,
  onAdjustSetScore,
  isTieBreak = false,
  tieBreakScore,
  isMatchComplete,
  matchWinner,
  finalScoreline,
  isReadOnly = false
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
    if (point === 'advantage') return { color: TENNIS_COLORS.YELLOW, fontWeight: 'bold' };
    if (point === 'game') return { color: TENNIS_COLORS.YELLOW, fontWeight: 'bold' };
    return { color: TENNIS_COLORS.YELLOW };
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
      const hasStarted = set && (set.player1Games > 0 || set.player2Games > 0);
      
      let setClass = "font-bold";
      let setStyle: React.CSSProperties = { color: TENNIS_COLORS.YELLOW, fontSize: '2.5rem' };
      let cellClass = "p-4 text-center border-r";
      let cellStyle: React.CSSProperties = { borderColor: TENNIS_COLORS.WHITE };
      
      if (isComplete) {
        // Completed sets: use winner/loser styling
        if (set?.winner === 'player1') {
          // Player 1 won this set - white text with dark background
          setStyle = { color: TENNIS_COLORS.WHITE, fontSize: '2.5rem' };
          cellStyle = { ...cellStyle, backgroundColor: TENNIS_COLORS.MEDIUM_DARK_GREY };
        } else if (set?.winner === 'player2') {
          // Player 1 lost this set - light grey text, no background
          setStyle = { color: TENNIS_COLORS.LIGHT_GREY, fontSize: '2.5rem' };
        } else {
          // No winner determined yet - white text
          setStyle = { color: TENNIS_COLORS.WHITE, fontSize: '2.5rem' };
        }
      } else if (isCurrentSet) {
        // Active set: yellow background, black text
        setStyle = { color: TENNIS_COLORS.BLACK, fontSize: '2.5rem' };
        cellStyle = { ...cellStyle, backgroundColor: TENNIS_COLORS.YELLOW };
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
        content: (hasStarted || isCurrentSet) ? (
          <div className="flex flex-col items-center">
            <div className={setClass} style={setStyle}>
              {formatSetScore(sets[i]?.player1Games || 0, true)}
            </div>
            {!isReadOnly && onAdjustSetScore && (
              <div className="flex items-center gap-1 mt-1">
                <Button
                  size="sm"
                  variant="outline"
                  className={`aspect-square h-6 w-6 p-0 text-xs ${
                    isMatchComplete 
                      ? 'text-gray-500 cursor-not-allowed' 
                      : 'text-gray-400 hover:text-white hover:bg-opacity-80'
                  }`}
                  style={{
                    backgroundColor: isMatchComplete ? '#444' : 'transparent',
                    borderColor: isMatchComplete ? '#444' : '#555'
                  }}
                  onClick={() => onAdjustSetScore(i, 'player1', -1)}
                  disabled={isMatchComplete}
                >
                  −
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className={`aspect-square h-6 w-6 p-0 text-xs ${
                    isMatchComplete 
                      ? 'text-gray-500 cursor-not-allowed' 
                      : 'text-gray-400 hover:text-white hover:bg-opacity-80'
                  }`}
                  style={{
                    backgroundColor: isMatchComplete ? '#444' : 'transparent',
                    borderColor: isMatchComplete ? '#444' : '#555'
                  }}
                  onClick={() => onAdjustSetScore(i, 'player1', 1)}
                  disabled={isMatchComplete}
                >
                  +
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className={setClass} style={setStyle}>
              &nbsp;
            </div>
            {!isReadOnly && onAdjustSetScore && (
              <div className="flex items-center gap-1 mt-1">
                <Button
                  size="sm"
                  variant="outline"
                  className={`aspect-square h-6 w-6 p-0 text-xs ${
                    isMatchComplete 
                      ? 'text-gray-500 cursor-not-allowed' 
                      : 'text-gray-400 hover:text-white hover:bg-opacity-80'
                  }`}
                  style={{
                    backgroundColor: isMatchComplete ? '#444' : 'transparent',
                    borderColor: isMatchComplete ? '#444' : '#555'
                  }}
                  onClick={() => onAdjustSetScore(i, 'player1', -1)}
                  disabled={isMatchComplete}
                >
                  −
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className={`aspect-square h-6 w-6 p-0 text-xs ${
                    isMatchComplete 
                      ? 'text-gray-500 cursor-not-allowed' 
                      : 'text-gray-400 hover:text-white hover:bg-opacity-80'
                  }`}
                  style={{
                    backgroundColor: isMatchComplete ? '#444' : 'transparent',
                    borderColor: isMatchComplete ? '#444' : '#555'
                  }}
                  onClick={() => onAdjustSetScore(i, 'player1', 1)}
                  disabled={isMatchComplete}
                >
                  +
                </Button>
              </div>
            )}
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
      const hasStarted = set && (set.player1Games > 0 || set.player2Games > 0);
      
      let setClass = "font-bold";
      let setStyle: React.CSSProperties = { color: TENNIS_COLORS.YELLOW, fontSize: '2.5rem' };
      let cellClass = "p-4 text-center border-r";
      let cellStyle: React.CSSProperties = { borderColor: TENNIS_COLORS.WHITE };
      
      if (isComplete) {
        // Completed sets: use winner/loser styling
        if (set?.winner === 'player2') {
          // Player 2 won this set - white text with dark background
          setStyle = { color: TENNIS_COLORS.WHITE, fontSize: '2.5rem' };
          cellStyle = { ...cellStyle, backgroundColor: TENNIS_COLORS.MEDIUM_DARK_GREY };
        } else if (set?.winner === 'player1') {
          // Player 2 lost this set - light grey text, no background
          setStyle = { color: TENNIS_COLORS.LIGHT_GREY, fontSize: '2.5rem' };
        } else {
          // No winner determined yet - white text
          setStyle = { color: TENNIS_COLORS.WHITE, fontSize: '2.5rem' };
        }
      } else if (isCurrentSet) {
        // Active set: yellow background, black text
        setStyle = { color: TENNIS_COLORS.BLACK, fontSize: '2.5rem' };
        cellStyle = { ...cellStyle, backgroundColor: TENNIS_COLORS.YELLOW };
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
        content: (hasStarted || isCurrentSet) ? (
          <div className="flex flex-col items-center">
            <div className={setClass} style={setStyle}>
              {formatSetScore(sets[i]?.player2Games || 0, false)}
            </div>
            {!isReadOnly && onAdjustSetScore && (
              <div className="flex items-center gap-1 mt-1">
                <Button
                  size="sm"
                  variant="outline"
                  className={`aspect-square h-6 w-6 p-0 text-xs ${
                    isMatchComplete 
                      ? 'text-gray-500 cursor-not-allowed' 
                      : 'text-gray-400 hover:text-white hover:bg-opacity-80'
                  }`}
                  style={{
                    backgroundColor: isMatchComplete ? '#444' : 'transparent',
                    borderColor: isMatchComplete ? '#444' : '#555'
                  }}
                  onClick={() => onAdjustSetScore(i, 'player2', -1)}
                  disabled={isMatchComplete}
                >
                  −
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className={`aspect-square h-6 w-6 p-0 text-xs ${
                    isMatchComplete 
                      ? 'text-gray-500 cursor-not-allowed' 
                      : 'text-gray-400 hover:text-white hover:bg-opacity-80'
                  }`}
                  style={{
                    backgroundColor: isMatchComplete ? '#444' : 'transparent',
                    borderColor: isMatchComplete ? '#444' : '#555'
                  }}
                  onClick={() => onAdjustSetScore(i, 'player2', 1)}
                  disabled={isMatchComplete}
                >
                  +
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className={setClass} style={setStyle}>
              &nbsp;
            </div>
            {!isReadOnly && onAdjustSetScore && (
              <div className="flex items-center gap-1 mt-1">
                <Button
                  size="sm"
                  variant="outline"
                  className={`aspect-square h-6 w-6 p-0 text-xs ${
                    isMatchComplete 
                      ? 'text-gray-500 cursor-not-allowed' 
                      : 'text-gray-400 hover:text-white hover:bg-opacity-80'
                  }`}
                  style={{
                    backgroundColor: isMatchComplete ? '#444' : 'transparent',
                    borderColor: isMatchComplete ? '#444' : '#555'
                  }}
                  onClick={() => onAdjustSetScore(i, 'player2', -1)}
                  disabled={isMatchComplete}
                >
                  −
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className={`aspect-square h-6 w-6 p-0 text-xs ${
                    isMatchComplete 
                      ? 'text-gray-500 cursor-not-allowed' 
                      : 'text-gray-400 hover:text-white hover:bg-opacity-80'
                  }`}
                  style={{
                    backgroundColor: isMatchComplete ? '#444' : 'transparent',
                    borderColor: isMatchComplete ? '#444' : '#555'
                  }}
                  onClick={() => onAdjustSetScore(i, 'player2', 1)}
                  disabled={isMatchComplete}
                >
                  +
                </Button>
              </div>
            )}
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
      return { color: TENNIS_COLORS.YELLOW, fontWeight: 'bold' };
    }
    if (player === 'player1') {
      return getPointColorStyle(currentGameScore.player1Points);
    } else {
      return getPointColorStyle(currentGameScore.player2Points);
    }
  };

  return (
    <Card className="w-full border-0">
      <CardContent className="p-0">
        <div className="bg-gray-900 text-white  overflow-hidden">
                      {/* Header */}
            <div className="bg-gray-800 px-6 py-3 border-b border-gray-700">
              <div className="text-center">
                <h2 className="text-lg font-bold mb-1" style={{ color: TENNIS_COLORS.YELLOW }}>
                  {config.player1Name} vs {config.player2Name}
                </h2>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm text-gray-300">Live Match</span>
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: TENNIS_COLORS.SUCCESS_GREEN }}></div>
                  <span className="text-sm" style={{ color: TENNIS_COLORS.SUCCESS_GREEN }}>Live Updates</span>
                  <span className="text-xs text-gray-500">(Last: {new Date().toLocaleTimeString()})</span>
                </div>
              </div>
            </div>

            {/* Match Completion Announcement */}
            {isMatchComplete && matchWinner && finalScoreline && (
              <div className="px-6 py-4 border-b" style={{ backgroundColor: TENNIS_COLORS.GREEN, borderColor: TENNIS_COLORS.GREEN }}>
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
                gridTemplateColumns: isReadOnly ? `1fr repeat(${setCount}, 80px) 80px` : `120px 1fr repeat(${setCount}, 80px) 80px`,
                gridTemplateAreas: isReadOnly ? `"player1 ${Array.from({length: setCount}, (_, i) => `set${i+1}`).join(' ')} game1"` : `"buttons player1 ${Array.from({length: setCount}, (_, i) => `set${i+1}`).join(' ')} game1"`
              }}
            >
              {/* Empty Buttons Column */}
              {!isReadOnly && <div></div>}

              {/* Empty Player Column */}
              <div></div>

              {/* Set Labels */}
              {Array.from({length: setCount}, (_, i) => (
                <div 
                  key={i}
                  className="text-center"
                  style={{ gridArea: `set${i + 1}` }}
                >
                  <span className="text-xs" style={{ color: TENNIS_COLORS.WHITE }}>Set {i + 1}</span>
                </div>
              ))}

              {/* Empty Game Column */}
                              <div className="text-center">
                  <span className="text-xs" style={{ color: TENNIS_COLORS.WHITE }}>Game</span>
                </div>
            </div>

            {/* Player Names Row */}
            <div 
              className="grid gap-0 mb-4 border  overflow-hidden"
              style={{ 
                gridTemplateColumns: isReadOnly ? `1fr repeat(${setCount}, 80px) 80px` : `120px 1fr repeat(${setCount}, 80px) 80px`,
                gridTemplateAreas: isReadOnly ? `"player1 ${Array.from({length: setCount}, (_, i) => `set${i+1}`).join(' ')} game1"` : `"buttons player1 ${Array.from({length: setCount}, (_, i) => `set${i+1}`).join(' ')} game1"`,
                borderColor: TENNIS_COLORS.WHITE
              }}
            >
              {/* Scoring Buttons Column for Player 1 */}
              {!isReadOnly && (
                <div className="p-4 border-r bg-gray-800" style={{ borderColor: TENNIS_COLORS.WHITE }}>
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
                          backgroundColor: currentSetComplete ? '#666' : TENNIS_COLORS.GREEN,
                          borderColor: currentSetComplete ? '#666' : TENNIS_COLORS.GREEN
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
                        backgroundColor: TENNIS_COLORS.BLUE,
                        borderColor: TENNIS_COLORS.BLUE
                      }}
                      onClick={() => onSetServer('player1')}
                    >
                      Make Server
                    </Button>
                  </div>
                </div>
              )}

              {/* Player 1 Column */}
              <div className="p-4 border-r bg-gray-800 flex items-center" style={{ borderColor: TENNIS_COLORS.WHITE }}>
                <div className="flex items-center w-full">
                  {(isTieBreak && tieBreakScore && tieBreakScore.server === 'player1') || (!isTieBreak && currentGameScore.server === 'player1') ? (
                    <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: TENNIS_COLORS.YELLOW }}></div>
                  ) : (
                    <div className="w-3 h-3 mr-3"></div>
                  )}
                  <span className="font-semibold" style={{ color: TENNIS_COLORS.WHITE, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>{config.player1Name}</span>
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
                <div className="p-4 text-center border-r flex flex-col items-center justify-center" style={{ borderColor: TENNIS_COLORS.WHITE }}>
                <div className="font-bold" style={{ ...getCurrentScoreColorStyle('player1'), fontSize: '2.5rem' }}>
                  {getCurrentScore('player1')}
                </div>
                {!isReadOnly && onAdjustGameScore && !isTieBreak && (
                  <div className="flex items-center gap-1 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="aspect-square h-6 w-6 p-0 text-xs text-white hover:bg-opacity-80"
                      style={{
                        backgroundColor: '#666',
                        borderColor: '#666'
                      }}
                      onClick={() => onAdjustGameScore('player1', -1)}
                      disabled={currentSetComplete}
                    >
                      −
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="aspect-square h-6 w-6 p-0 text-xs text-white hover:bg-opacity-80"
                      style={{
                        backgroundColor: '#666',
                        borderColor: '#666'
                      }}
                      onClick={() => onAdjustGameScore('player1', 1)}
                      disabled={currentSetComplete}
                    >
                      +
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Player 2 Row */}
            <div 
              className="grid gap-0 border overflow-hidden"
              style={{ 
                gridTemplateColumns: isReadOnly ? `1fr repeat(${setCount}, 80px) 80px` : `120px 1fr repeat(${setCount}, 80px) 80px`,
                gridTemplateAreas: isReadOnly ? `"player2 ${Array.from({length: setCount}, (_, i) => `set${i+1}`).join(' ')} game2"` : `"buttons player2 ${Array.from({length: setCount}, (_, i) => `set${i+1}`).join(' ')} game2"`,
                borderColor: TENNIS_COLORS.WHITE
              }}
            >
                              {/* Scoring Buttons Column for Player 2 */}
              {!isReadOnly && (
                <div className="p-4 border-r bg-gray-800" style={{ borderColor: TENNIS_COLORS.WHITE }}>
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
                          backgroundColor: currentSetComplete ? '#666' : TENNIS_COLORS.GREEN,
                          borderColor: currentSetComplete ? '#666' : TENNIS_COLORS.GREEN
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
                        backgroundColor: TENNIS_COLORS.BLUE,
                        borderColor: TENNIS_COLORS.BLUE
                      }}
                      onClick={() => onSetServer('player2')}
                    >
                      Make Server
                    </Button>
                  </div>
                </div>
              )}

                              {/* Player 2 Column */}
                <div className="p-4 border-r bg-gray-800 flex items-center" style={{ borderColor: TENNIS_COLORS.WHITE }}>
                <div className="flex items-center w-full">
                  {(isTieBreak && tieBreakScore && tieBreakScore.server === 'player2') || (!isTieBreak && currentGameScore.server === 'player2') ? (
                    <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: TENNIS_COLORS.YELLOW }}></div>
                  ) : (
                    <div className="w-3 h-3 mr-3"></div>
                  )}
                  <span className="font-semibold" style={{ color: TENNIS_COLORS.WHITE, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>{config.player2Name}</span>
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
              <div className="p-4 text-center flex flex-col items-center justify-center">
                <div className="font-bold" style={{ ...getCurrentScoreColorStyle('player2'), fontSize: '2.5rem' }}>
                  {getCurrentScore('player2')}
                </div>
                {!isReadOnly && onAdjustGameScore && !isTieBreak && (
                  <div className="flex items-center gap-1 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="aspect-square h-6 w-6 p-0 text-xs text-white hover:bg-opacity-80"
                      style={{
                        backgroundColor: '#666',
                        borderColor: '#666'
                      }}
                      onClick={() => onAdjustGameScore('player2', -1)}
                      disabled={currentSetComplete}
                    >
                      −
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="aspect-square h-6 w-6 p-0 text-xs text-white hover:bg-opacity-80"
                      style={{
                        backgroundColor: '#666',
                        borderColor: '#666'
                      }}
                      onClick={() => onAdjustGameScore('player2', 1)}
                      disabled={currentSetComplete}
                    >
                      +
                    </Button>
                  </div>
                )}
              </div>
            </div>

                          {/* Match Info */}
              <div className="mt-6 pt-4">
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <span style={{ color: TENNIS_COLORS.WHITE }}>Format:</span>
                  <span className="ml-2 font-semibold" style={{ color: TENNIS_COLORS.WHITE }}>
                    {config.matchFormat === 'single' ? 'Single Set' : 
                     config.matchFormat === 'best-of-3' ? 'Best of 3' : 'Best of 5'}
                  </span>
                </div>
                <div>
                  <span style={{ color: TENNIS_COLORS.WHITE }}>Set Duration:</span>
                  <span className="ml-2 font-semibold" style={{ color: TENNIS_COLORS.WHITE }}>{config.setDuration} games</span>
                </div>
                <div>
                  <span style={{ color: TENNIS_COLORS.WHITE }}>Scoring:</span>
                  <span className="ml-2 font-semibold" style={{ color: TENNIS_COLORS.WHITE }}>
                    {config.scoringSystem === 'ad' ? 'Ad' : 'No-Ad'}
                  </span>
                </div>
                <div>
                  <span style={{ color: TENNIS_COLORS.WHITE }}>Set Tie-Break:</span>
                  <span className="ml-2 font-semibold" style={{ color: TENNIS_COLORS.WHITE }}>
                    {config.tieBreakRules === 'none' ? 'None' : 
                     config.tieBreakRules === '7-point' ? '7-Point' : '10-Point'}
                  </span>
                </div>
              </div>
              
              {/* Final Set Tiebreak Info */}
              {config.finalSetTieBreak && (
                <div className="mt-4 pt-3 border-t border-gray-700">
                  <div className="text-center">
                    <span style={{ color: TENNIS_COLORS.YELLOW }} className="font-semibold">
                      🎾 Final Set: {config.finalSetTieBreakPoints || 10}-Point Tiebreak Only
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Scoreboard; 