import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import GameScorer from '../components/scoring/GameScorer';
import { MatchConfig } from '../types/Scoring';
import { MatchAPI } from '../services/api';

const ScoreMatch: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { matchId: urlMatchId } = useParams<{ matchId: string }>();
  const [config, setConfig] = useState<MatchConfig | null>(null);
  const [matchId, setMatchId] = useState<string | null>(urlMatchId || null);

  const loadMatchFromAPI = useCallback(async (matchId: string) => {
    try {
      const { match } = await MatchAPI.getMatch(matchId);
      setConfig(match.config);
    } catch (error) {
      console.error('Error loading match:', error);
      // If we can't load the match, redirect to home
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    // Check if we have config from navigation state (new match)
    if (location.state?.config) {
      setConfig(location.state.config);
    } else if (matchId && !config) {
      // If we have a matchId but no config, load it from the API
      loadMatchFromAPI(matchId);
    }
  }, [location, navigate, matchId, config, loadMatchFromAPI]);

  if (!matchId) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="max-w-md mx-auto p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Return to Match</h1>
            <p className="text-gray-300">Enter your match details to continue scoring</p>
          </div>
          
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Match ID</label>
                <input
                  type="text"
                  placeholder="Enter match ID"
                  className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setMatchId(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={() => {
                  if (matchId) {
                    navigate(`/score-match/${matchId}`);
                  }
                }}
                disabled={!matchId}
                className="w-full text-white"
                style={{
                  backgroundColor: '#22c55e',
                  borderColor: '#22c55e'
                }}
              >
                Continue Match
              </Button>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white"
            >
              ← Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="mx-auto flex items-center justify-between" style={{ maxWidth: '66rem' }}>
          <div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-white hover:bg-gray-800"
            >
              ← Back to Home
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-white">MatchSync</h1>
            {matchId && (
              <p className="text-xs text-gray-500 mt-1">
                Match ID: {matchId}
              </p>
            )}
          </div>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Scoring Interface */}
      <div className="p-4">
        <div className="mx-auto" style={{ maxWidth: '66rem' }}>
          {config ? (
            <GameScorer 
              config={config}
              matchId={matchId || undefined}
            />
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white">Loading match configuration...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScoreMatch; 