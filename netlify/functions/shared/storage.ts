import { Match } from '../../../src/types/Scoring';

// Simple in-memory storage for now (will be replaced with proper database)
const matches = new Map<string, Match>();

export class MatchStorage {
  static async createMatch(match: Match): Promise<void> {
    matches.set(match.id, match);
  }

  static async getMatch(matchId: string): Promise<Match | null> {
    return matches.get(matchId) || null;
  }

  static async updateMatch(matchId: string, updates: Partial<Match>): Promise<Match | null> {
    const match = matches.get(matchId);
    if (!match) return null;

    const updatedMatch: Match = {
      ...match,
      ...updates,
      updatedAt: new Date()
    };

    matches.set(matchId, updatedMatch);
    return updatedMatch;
  }

  static async deleteMatch(matchId: string): Promise<boolean> {
    return matches.delete(matchId);
  }

  static async listMatches(): Promise<Match[]> {
    return Array.from(matches.values());
  }

  static async verifyAdminToken(matchId: string, adminToken: string): Promise<boolean> {
    const match = matches.get(matchId);
    return match?.adminToken === adminToken;
  }
} 