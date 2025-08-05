import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { MatchConfig } from '../types/Scoring';
import { TENNIS_COLORS } from '../lib/colors';
import { MatchAPI } from '../services/api';

const NewMatch: React.FC = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<MatchConfig>({
    scoringSystem: 'ad',
    matchFormat: 'best-of-3',
    setDuration: 6,
    tieBreakRules: '10-point',
    player1Name: '',
    player2Name: ''
  });

  const [isCreating, setIsCreating] = useState(false);

  const handleConfigChange = (field: keyof MatchConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleStartMatch = async () => {
    if (!config.player1Name.trim() || !config.player2Name.trim()) {
      alert('Please enter both player names');
      return;
    }

    setIsCreating(true);
    
    try {
      // Create the match via API service
      const { match } = await MatchAPI.createMatch(config);
      
      // Navigate to scoring page with match data in URL
      navigate(`/score-match/${match.id}`, { 
        state: { 
          config,
          adminToken: match.adminToken
        } 
      });
    } catch (error) {
      console.error('Error creating match:', error);
      alert('Failed to create match. Please try again.');
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4 text-white hover:bg-gray-800"
          >
            ← Back to Home
          </Button>
          <h1 className="text-3xl font-bold text-white mb-2">New Match</h1>
          <p className="text-gray-300">Configure your tennis match settings</p>
        </div>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Match Configuration</CardTitle>
            <CardDescription className="text-gray-300">
              Set up the scoring rules and player names for your match
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Player Names */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Player 1 Name</label>
                <input
                  type="text"
                  value={config.player1Name}
                  onChange={(e) => handleConfigChange('player1Name', e.target.value)}
                  placeholder="Enter player 1 name"
                  className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Player 2 Name</label>
                <input
                  type="text"
                  value={config.player2Name}
                  onChange={(e) => handleConfigChange('player2Name', e.target.value)}
                  placeholder="Enter player 2 name"
                  className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Scoring System */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Scoring System</label>
              <select
                value={config.scoringSystem}
                onChange={(e) => handleConfigChange('scoringSystem', e.target.value)}
                className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ad">Ad Scoring (Traditional)</option>
                <option value="no-ad">No-Ad Scoring (College/Recreational)</option>
              </select>
              <p className="text-xs text-gray-400 mt-1">
                Ad scoring requires winning by 2 points after deuce. No-ad scoring decides the game at deuce.
              </p>
            </div>

            {/* Match Format */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Match Format</label>
              <select
                value={config.matchFormat}
                onChange={(e) => handleConfigChange('matchFormat', e.target.value)}
                className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="single">Single Set</option>
                <option value="best-of-3">Best of 3 Sets</option>
                <option value="best-of-5">Best of 5 Sets</option>
              </select>
            </div>

            {/* Set Duration */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Set Duration</label>
              <select
                value={config.setDuration}
                onChange={(e) => handleConfigChange('setDuration', parseInt(e.target.value))}
                className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={4}>4 Games (Short Set)</option>
                <option value={6}>6 Games (Standard)</option>
                <option value={8}>8 Games (Pro-Set)</option>
              </select>
            </div>

            {/* Tie Break Rules */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Tie Break Rules</label>
              <select
                value={config.tieBreakRules}
                onChange={(e) => handleConfigChange('tieBreakRules', e.target.value)}
                className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="none">No Tie Break</option>
                <option value="7-point">7-Point Tie Break</option>
                <option value="10-point">10-Point Tie Break</option>
              </select>
              <p className="text-xs text-gray-400 mt-1">
                Tie breaks are used to decide sets that reach the required number of games.
              </p>
            </div>

            {/* Start Button */}
            <Button 
              onClick={handleStartMatch}
              disabled={isCreating || !config.player1Name.trim() || !config.player2Name.trim()}
              className="w-full text-white text-lg py-3"
              style={{
                backgroundColor: TENNIS_COLORS.GREEN,
                borderColor: TENNIS_COLORS.GREEN
              }}
            >
              {isCreating ? 'Creating Match...' : 'Start Match'}
            </Button>
          </CardContent>
        </Card>

        {/* Rules Explanation */}
        <Card className="mt-6 bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Scoring Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <strong className="text-white">Ad Scoring:</strong>
                <p className="text-gray-300">Players must win by 2 points after reaching deuce (40-40).</p>
              </div>
              <div>
                <strong className="text-white">No-Ad Scoring:</strong>
                <p className="text-gray-300">At deuce, the next point wins the game. Common in college tennis.</p>
              </div>
              <div>
                <strong className="text-white">Set Duration:</strong>
                <p className="text-gray-300">Number of games needed to win a set (must win by 2 games).</p>
              </div>
              <div>
                <strong className="text-white">Tie Break:</strong>
                <p className="text-gray-300">Used to decide sets that reach the required games (first to 7 or 10 points, win by 2).</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewMatch; 