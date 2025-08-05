import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MatchAPI } from '../services/api';
import { Match } from '../types/Scoring';
import Scoreboard from '../components/scoring/Scoreboard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useMatchUpdates } from '../hooks/useMatchUpdates';
import { TENNIS_COLORS } from '../lib/colors';

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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading match...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle style={{ color: TENNIS_COLORS.ERROR_RED }}>Error Loading Match</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle style={{ color: TENNIS_COLORS.ERROR_RED }}>Match Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">The requested match could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4">
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
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: TENNIS_COLORS.SUCCESS_GREEN }}></div>
                <span className="text-sm" style={{ color: TENNIS_COLORS.SUCCESS_GREEN }}>
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
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: TENNIS_COLORS.ERROR_RED }}></div>
                <span className="text-sm" style={{ color: TENNIS_COLORS.ERROR_RED }}>{sseError}</span>
                <button 
                  onClick={reconnect}
                  className="text-xs px-2 py-1 text-white rounded"
                  style={{ backgroundColor: TENNIS_COLORS.INFO_BLUE }}
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