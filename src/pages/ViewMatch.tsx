import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MatchAPI } from '../services/api';
import { Match } from '../types/Scoring';
import Scoreboard from '../components/scoring/Scoreboard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useMatchUpdates } from '../hooks/useMatchUpdates';

const ViewMatch: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const [initialMatch, setInitialMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Real-time updates
  const { match: realtimeMatch, isConnected, error: sseError, reconnect, lastUpdate } = useMatchUpdates({
    matchId: matchId || '',
    enabled: !!matchId && !loading
  });

  // Use real-time match if available, otherwise use initial match
  const match = realtimeMatch || initialMatch;

  useEffect(() => {
    if (!matchId) {
      setError('No match ID provided');
      setLoading(false);
      return;
    }

    const loadMatch = async () => {
      try {
        setLoading(true);
        setError('');
        const result = await MatchAPI.getMatch(matchId);
        setInitialMatch(result.match);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load match');
      } finally {
        setLoading(false);
      }
    };

    loadMatch();
  }, [matchId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading match...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Match</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Match Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">The requested match could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            {match.config.player1Name} vs {match.config.player2Name}
          </h1>
          <div className="flex items-center gap-4">
            <p className="text-gray-400">
              {match.status === 'completed' ? 'Match Complete' : 'Live Match'}
            </p>
            {isConnected && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400">
                  Live Updates
                  {lastUpdate && (
                    <span className="text-xs text-gray-500 ml-2">
                      (Last: {lastUpdate.toLocaleTimeString()})
                    </span>
                  )}
                </span>
              </div>
            )}
            {sseError && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm text-red-400">{sseError}</span>
                <button 
                  onClick={reconnect}
                  className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        </div>
        
        <Scoreboard 
          config={match.config}
          currentGameScore={match.currentGameScore}
          sets={match.sets}
          currentSet={match.currentSet}
          onAddPoint={() => {}} // No-op for read-only
          onRemovePoint={() => {}} // No-op for read-only
          onSetServer={() => {}} // No-op for read-only
          isTieBreak={match.isTieBreak}
          tieBreakScore={match.tieBreakScore}
          isMatchComplete={match.status === 'completed'}
          matchWinner={match.matchWinner}
          finalScoreline={match.finalScoreline}
          isReadOnly={true} // This makes it read-only
        />
      </div>
    </div>
  );
};

export default ViewMatch; 