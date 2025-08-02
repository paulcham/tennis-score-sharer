import React from 'react';
import { Card, CardContent } from '../ui/card';
import { GameScore, SetScore, MatchConfig } from '../../types/Scoring';

interface ScoreboardProps {
  config: MatchConfig;
  currentGameScore: GameScore;
  sets: SetScore[];
  currentSet: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ config, currentGameScore, sets, currentSet }) => {
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
    if (point === 'game') return 'text-green-700 font-bold';
    return 'text-green-500';
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-0">
        <div className="bg-gray-900 text-white rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gray-800 px-6 py-3 border-b border-gray-700">
            <h2 className="text-xl font-bold text-center text-yellow-400">
              Tennis Match
            </h2>
          </div>

          {/* Scoreboard Content */}
          <div className="p-6">
            {/* Player Names Row */}
            <div className="grid grid-cols-5 gap-4 mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs">★</span>
                </div>
                <span className="font-semibold text-sm">{config.player1Name}</span>
              </div>
              <div className="text-center">
                <span className="text-xs text-gray-400">Set 1</span>
                <div className="text-lg font-bold text-green-400">
                  {sets[0]?.player1Games || 0}
                </div>
              </div>
              <div className="text-center">
                <span className="text-xs text-gray-400">Set 2</span>
                <div className="text-lg font-bold text-green-400">
                  {sets[1]?.player1Games || 0}
                </div>
              </div>
              <div className="text-center">
                <span className="text-xs text-gray-400">Set 3</span>
                <div className="text-lg font-bold text-green-400">
                  {sets[2]?.player1Games || 0}
                </div>
              </div>
              <div className="text-center">
                <span className="text-xs text-gray-400">Game</span>
                <div className={`text-lg font-bold ${getPointColor(currentGameScore.player1Points)}`}>
                  {formatPoint(currentGameScore.player1Points)}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-700 my-4"></div>

            {/* Player 2 Row */}
            <div className="grid grid-cols-5 gap-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs">●</span>
                </div>
                <span className="font-semibold text-sm">{config.player2Name}</span>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">
                  {sets[0]?.player2Games || 0}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">
                  {sets[1]?.player2Games || 0}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">
                  {sets[2]?.player2Games || 0}
                </div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-bold ${getPointColor(currentGameScore.player2Points)}`}>
                  {formatPoint(currentGameScore.player2Points)}
                </div>
              </div>
            </div>

            {/* Match Info */}
            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Scoring:</span>
                  <span className="ml-2 font-semibold">
                    {config.scoringSystem === 'ad' ? 'Ad' : 'No-Ad'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Server:</span>
                  <span className="ml-2 font-semibold">
                    {currentGameScore.server === 'player1' ? config.player1Name : config.player2Name}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Set Duration:</span>
                  <span className="ml-2 font-semibold">{config.setDuration} games</span>
                </div>
                <div>
                  <span className="text-gray-400">Current Set:</span>
                  <span className="ml-2 font-semibold">{currentSet}</span>
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