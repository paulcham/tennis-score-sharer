import { useState, useEffect, useCallback, useRef } from 'react';
import { Match } from '../types/Scoring';
import { MatchAPI } from '../services/api';

interface UseMatchUpdatesOptions {
  matchId: string;
  enabled?: boolean;
  pollInterval?: number;
}

export const useMatchUpdates = ({ 
  matchId, 
  enabled = true, 
  pollInterval = 2000 
}: UseMatchUpdatesOptions) => {
  const [match, setMatch] = useState<Match | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchUpdate = useCallback(async () => {
    if (!enabled || !matchId) return;

    try {
      const result = await MatchAPI.getMatch(matchId);
      setMatch(result.match);
      setLastUpdate(new Date());
      setIsConnected(true);
      setError(null);
    } catch (err) {
      console.error('Error fetching match update:', err);
      setIsConnected(false);
      setError('Failed to fetch updates');
    }
  }, [matchId, enabled]);

  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (enabled && matchId) {
      // Fetch immediately
      fetchUpdate();
      
      // Then poll at the specified interval
      intervalRef.current = setInterval(fetchUpdate, pollInterval);
    }
  }, [enabled, matchId, fetchUpdate, pollInterval]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsConnected(false);
  }, []);

  useEffect(() => {
    if (enabled && matchId) {
      startPolling();
    }

    return () => {
      stopPolling();
    };
  }, [enabled, matchId, startPolling, stopPolling]);

  const reconnect = useCallback(() => {
    setError(null);
    startPolling();
  }, [startPolling]);

  return {
    match,
    isConnected,
    error,
    reconnect,
    lastUpdate
  };
}; 