import { Match, MatchConfig } from '../types/Scoring';

const API_BASE = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8898/.netlify/functions' 
  : '/.netlify/functions';

// Debug logging for API calls
console.log('API_BASE:', API_BASE);
console.log('NODE_ENV:', process.env.NODE_ENV);

export class MatchAPI {
  static async createMatch(config: MatchConfig): Promise<{ match: Match; message: string }> {
    console.log('Creating match with config:', config);
    console.log('API URL:', `${API_BASE}/create-match`);
    
    const response = await fetch(`${API_BASE}/create-match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ config }),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

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
    adminToken: string, 
    updates: Partial<Match>
  ): Promise<{ match: Match; message: string }> {
    const response = await fetch(`${API_BASE}/update-match`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ matchId, adminToken, updates }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update match');
    }

    return response.json();
  }
} 