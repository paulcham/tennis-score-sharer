import { Match } from '../../../src/types/Scoring';
import * as fs from 'fs';
import * as path from 'path';

const STORAGE_FILE = '/tmp/matches.json';

// Ensure the storage file exists
const ensureStorageFile = () => {
  if (!fs.existsSync(STORAGE_FILE)) {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify({}));
  }
};

// Read matches from file
const readMatches = (): Record<string, Match> => {
  try {
    ensureStorageFile();
    const data = fs.readFileSync(STORAGE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading matches:', error);
    return {};
  }
};

// Write matches to file
const writeMatches = (matches: Record<string, Match>) => {
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(matches, null, 2));
  } catch (error) {
    console.error('Error writing matches:', error);
  }
};

export class MatchStorage {
  static async createMatch(match: Match): Promise<void> {
    const matches = readMatches();
    matches[match.id] = match;
    writeMatches(matches);
  }

  static async getMatch(matchId: string): Promise<Match | null> {
    const matches = readMatches();
    return matches[matchId] || null;
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