import { Match, MatchConfig } from '../types/Scoring';

const API_BASE = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8898/.netlify/functions' 
  : '/.netlify/functions';

export class MatchAPI {
  static async createMatch(config: MatchConfig): Promise<{ match: Match; message: string }> {
    const response = await fetch(`${API_BASE}/create-match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ config }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('API Error:', error);
      throw new Error(error.error || 'Failed to create match');
    }

    return response.json();
  }

  static async getMatch(matchId: string): Promise<{ match: Match; message: string }> {
    const response = await fetch(`${API_BASE}/get-match?matchId=${matchId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get match');
    }

    return response.json();
  }

  static async updateMatch(
    matchId: string, 
    updates: Partial<Match>
  ): Promise<{ match: Match; message: string }> {
    const response = await fetch(`${API_BASE}/update-match`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ matchId, updates }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update match');
    }

    return response.json();
  }
} 