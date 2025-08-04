import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import GameScorer from '../components/scoring/GameScorer';
import { MatchConfig } from '../types/Scoring';

const ScoreMatch: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [config, setConfig] = useState<MatchConfig | null>(null);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if we have config from navigation state (new match)
    if (location.state?.config) {
      setConfig(location.state.config);
      if (location.state?.matchId) {
        setMatchId(location.state.matchId);
      }
      if (location.state?.adminToken) {
        setAdminToken(location.state.adminToken);
      }
    } else {
      // Check URL parameters for existing match
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('matchId');
      const token = urlParams.get('adminToken');
      
      if (id && token) {
        setMatchId(id);
        setAdminToken(token);
      } else {
        // No valid match data, redirect to home
        navigate('/');
      }
    }
  }, [location, navigate]);

  if (!config && !matchId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-white"
            >
              ← Back to Home
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-white">Tennis Match Scoring</h1>
            {config && (
              <p className="text-sm text-gray-400">
                {config.player1Name} vs {config.player2Name}
              </p>
            )}
          </div>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Scoring Interface */}
      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          {config && (
            <GameScorer 
              config={config}
              matchId={matchId || undefined}
              adminToken={adminToken || undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ScoreMatch; 