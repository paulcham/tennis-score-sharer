import { Match } from '../../../src/types/Scoring';

// In-memory storage for Netlify functions
// Note: This will reset between deployments, but works for demo purposes
let matchesStorage: Record<string, Match> = {};

// Read matches from memory
const readMatches = (): Record<string, Match> => {
  return matchesStorage;
};

// Write matches to memory
const writeMatches = (matches: Record<string, Match>) => {
  matchesStorage = matches;
};

export class MatchStorage {
  static async createMatch(match: Match): Promise<void> {
    console.log('Creating match:', match.id);
    const matches = readMatches();
    matches[match.id] = match;
    writeMatches(matches);
    console.log('Match created, total matches:', Object.keys(matches).length);
  }

  static async getMatch(matchId: string): Promise<Match | null> {
    console.log('Getting match:', matchId);
    const matches = readMatches();
    console.log('Available matches:', Object.keys(matches));
    const match = matches[matchId] || null;
    console.log('Match found:', !!match);
    return match;
  }

  static async updateMatch(matchId: string, updates: Partial<Match>): Promise<Match | null> {
    const matches = readMatches();
    const match = matches[matchId];
    
    if (!match) return null;

    const updatedMatch: Match = {
      ...match,
      ...updates,
      updatedAt: new Date()
    };

    matches[matchId] = updatedMatch;
    writeMatches(matches);
    return updatedMatch;
  }

  static async deleteMatch(matchId: string): Promise<boolean> {
    const matches = readMatches();
    if (matches[matchId]) {
      delete matches[matchId];
      writeMatches(matches);
      return true;
    }
    return false;
  }

  static async listMatches(): Promise<Match[]> {
    const matches = readMatches();
    return Object.values(matches);
  }

  static async verifyAdminToken(matchId: string, adminToken: string): Promise<boolean> {
    const matches = readMatches();
    const match = matches[matchId];
    return match?.adminToken === adminToken;
  }
} 