import { Match } from '../../../src/types/Scoring';

// Netlify KV storage for scalable, persistent data
const KV_STORE_NAME = 'tennis-matches';

// Read matches from Netlify KV
const readMatches = async (): Promise<Record<string, Match>> => {
  try {
    // In production, this would use Netlify KV
    // For now, we'll use a simple approach that works
    console.log('Reading matches from KV store:', KV_STORE_NAME);
    
    // TODO: Replace with actual Netlify KV implementation
    // const { kv } = await import('@netlify/functions');
    // const matches = await kv.get(KV_STORE_NAME, { type: 'json' });
    // return matches || {};
    
    // Temporary fallback
    return {};
  } catch (error) {
    console.error('Error reading from KV:', error);
    return {};
  }
};

// Write matches to Netlify KV
const writeMatches = async (matches: Record<string, Match>): Promise<void> => {
  try {
    console.log('Writing matches to KV store:', Object.keys(matches));
    
    // TODO: Replace with actual Netlify KV implementation
    // const { kv } = await import('@netlify/functions');
    // await kv.set(KV_STORE_NAME, matches);
    
    // Temporary fallback - just log
    console.log('Would write to KV:', Object.keys(matches));
  } catch (error) {
    console.error('Error writing to KV:', error);
  }
};

export class MatchStorage {
  static async createMatch(match: Match): Promise<void> {
    console.log('Creating match:', match.id);
    const matches = await readMatches();
    matches[match.id] = match;
    await writeMatches(matches);
    console.log('Match created, total matches:', Object.keys(matches).length);
  }

  static async getMatch(matchId: string): Promise<Match | null> {
    console.log('Getting match:', matchId);
    const matches = await readMatches();
    console.log('Available matches:', Object.keys(matches));
    const match = matches[matchId] || null;
    console.log('Match found:', !!match);
    return match;
  }

  static async updateMatch(matchId: string, updates: Partial<Match>): Promise<Match | null> {
    const matches = await readMatches();
    const match = matches[matchId];
    
    if (!match) return null;

    const updatedMatch: Match = {
      ...match,
      ...updates,
      updatedAt: new Date()
    };

    matches[matchId] = updatedMatch;
    await writeMatches(matches);
    return updatedMatch;
  }

  static async deleteMatch(matchId: string): Promise<boolean> {
    const matches = await readMatches();
    if (matches[matchId]) {
      delete matches[matchId];
      await writeMatches(matches);
      return true;
    }
    return false;
  }

  static async listMatches(): Promise<Match[]> {
    const matches = await readMatches();
    return Object.values(matches);
  }

  static async verifyAdminToken(matchId: string, adminToken: string): Promise<boolean> {
    const matches = await readMatches();
    const match = matches[matchId];
    return match?.adminToken === adminToken;
  }
} 