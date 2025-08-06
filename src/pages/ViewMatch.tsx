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
  const { match: realtimeMatch } = useMatchUpdates({
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
    <div className="min-h-screen bg-black">
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
  );
};

export default ViewMatch; 