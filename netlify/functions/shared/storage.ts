import { Match } from '../../../src/types/Scoring';

// DEBUG: Let's understand what's happening with storage
let matchesStorage: Record<string, Match> = {};

// DEBUG: Track all operations
const debugLog = (operation: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] STORAGE DEBUG - ${operation}:`, data);
};

// Read matches from storage
const readMatches = async (): Promise<Record<string, Match>> => {
  debugLog('READ_MATCHES', {
    storageKeys: Object.keys(matchesStorage),
    storageSize: Object.keys(matchesStorage).length,
    storageContent: matchesStorage
  });
  return matchesStorage;
};

// Write matches to storage
const writeMatches = async (matches: Record<string, Match>): Promise<void> => {
  debugLog('WRITE_MATCHES', {
    newKeys: Object.keys(matches),
    newSize: Object.keys(matches).length,
    newContent: matches
  });
  matchesStorage = matches;
};

export class MatchStorage {
  static async createMatch(match: Match): Promise<void> {
    debugLog('CREATE_MATCH_START', { matchId: match.id, matchData: match });
    
    const matches = await readMatches();
    debugLog('CREATE_MATCH_READ_STORAGE', { 
      existingKeys: Object.keys(matches),
      existingSize: Object.keys(matches).length 
    });
    
    matches[match.id] = match;
    debugLog('CREATE_MATCH_ADDED_TO_STORAGE', { 
      newKeys: Object.keys(matches),
      newSize: Object.keys(matches).length 
    });
    
    await writeMatches(matches);
    debugLog('CREATE_MATCH_COMPLETE', { 
      finalKeys: Object.keys(matches),
      finalSize: Object.keys(matches).length 
    });
  }

  static async getMatch(matchId: string): Promise<Match | null> {
    debugLog('GET_MATCH_START', { matchId });
    
    const matches = await readMatches();
    debugLog('GET_MATCH_READ_STORAGE', { 
      availableKeys: Object.keys(matches),
      availableSize: Object.keys(matches).length,
      lookingFor: matchId 
    });
    
    const match = matches[matchId] || null;
    debugLog('GET_MATCH_RESULT', { 
      matchFound: !!match,
      matchId,
      matchData: match 
    });
    
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