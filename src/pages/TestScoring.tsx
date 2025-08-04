import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import GameScorer from '../components/scoring/GameScorer';
import { MatchConfig } from '../types/Scoring';
import { TENNIS_COLORS } from '../lib/colors';

const TestScoring: React.FC = () => {
  const [config, setConfig] = useState<MatchConfig>({
    scoringSystem: 'ad',
    matchFormat: 'best-of-3',
    setDuration: 6,
    tieBreakRules: '10-point',
    player1Name: 'Nicky',
    player2Name: 'Opponent'
  });

  const [showScorer, setShowScorer] = useState(false);

  const handleConfigChange = (field: keyof MatchConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="w-full">
        {showScorer ? (
          // Show only the scoreboard when match has started
          <div className="w-full">
            <GameScorer config={config} />
          </div>
        ) : (
          // Show configuration and rules when match hasn't started
          <>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Match Configuration</CardTitle>
                  <CardDescription>
                    Configure the scoring rules
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Player 1 Name</label>
                    <input
                      type="text"
                      value={config.player1Name}
                      onChange={(e) => handleConfigChange('player1Name', e.target.value)}
                      className="w-full p-2 border"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Player 2 Name</label>
                    <input
                      type="text"
                      value={config.player2Name}
                      onChange={(e) => handleConfigChange('player2Name', e.target.value)}
                      className="w-full p-2 border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Scoring System</label>
                    <select
                      value={config.scoringSystem}
                      onChange={(e) => handleConfigChange('scoringSystem', e.target.value)}
                      className="w-full p-2 border"
                    >
                      <option value="ad">Ad Scoring</option>
                      <option value="no-ad">No-Ad Scoring</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Match Format</label>
                    <select
                      value={config.matchFormat}
                      onChange={(e) => handleConfigChange('matchFormat', e.target.value)}
                      className="w-full p-2 border"
                    >
                      <option value="single">Single Set</option>
                      <option value="best-of-3">Best of 3 Sets</option>
                      <option value="best-of-5">Best of 5 Sets</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Set Duration</label>
                    <select
                      value={config.setDuration}
                      onChange={(e) => handleConfigChange('setDuration', parseInt(e.target.value))}
                      className="w-full p-2 border"
                    >
                      <option value={4}>4 Games</option>
                      <option value={6}>6 Games</option>
                      <option value={8}>8 Games (Pro-Set)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tie Break Rules</label>
                    <select
                      value={config.tieBreakRules}
                      onChange={(e) => handleConfigChange('tieBreakRules', e.target.value)}
                      className="w-full p-2 border"
                    >
                      <option value="none">No Tie Break</option>
                      <option value="7-point">7-Point Tie Break</option>
                      <option value="10-point">10-Point Tie Break</option>
                    </select>
                  </div>

                  <Button 
                    onClick={() => setShowScorer(true)}
                    className="w-full text-white"
                    style={{
                      backgroundColor: TENNIS_COLORS.GREEN,
                      borderColor: TENNIS_COLORS.GREEN
                    }}
                  >
                    Start Scoring Test
                  </Button>
                </CardContent>
              </Card>

              <div>
                {/* Empty space for balance */}
              </div>
            </div>

            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Scoring Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Ad Scoring:</strong> Players must win by 2 points after deuce</p>
                    <p><strong>No-Ad Scoring:</strong> At deuce, next point wins the game</p>
                    <p><strong>Set Duration:</strong> Number of games needed to win a set</p>
                    <p><strong>Tie Break:</strong> Used to decide sets that reach the required games</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TestScoring; 