import { Match } from '../../../src/types/Scoring';
import * as fs from 'fs';
import * as path from 'path';

// Use a persistent file in /tmp that actually works in Netlify
const STORAGE_FILE = '/tmp/matches.json';

// Ensure the storage file exists and is readable
const ensureStorageFile = () => {
  try {
    if (!fs.existsSync(STORAGE_FILE)) {
      fs.writeFileSync(STORAGE_FILE, JSON.stringify({}));
    }
  } catch (error) {
    console.error('Error ensuring storage file:', error);
  }
};

// Read matches from file with better error handling
const readMatches = (): Record<string, Match> => {
  try {
    ensureStorageFile();
    const data = fs.readFileSync(STORAGE_FILE, 'utf8');
    const parsed = JSON.parse(data);
    console.log('Read matches from file:', Object.keys(parsed));
    return parsed;
  } catch (error) {
    console.error('Error reading matches from file:', error);
    return {};
  }
};

// Write matches to file with better error handling
const writeMatches = (matches: Record<string, Match>) => {
  try {
    ensureStorageFile();
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(matches, null, 2));
    console.log('Wrote matches to file:', Object.keys(matches));
  } catch (error) {
    console.error('Error writing matches to file:', error);
  }
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