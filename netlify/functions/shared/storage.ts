import { Match } from '../../../src/types/Scoring';
import { createClient } from '@supabase/supabase-js';

// Supabase client for server-side operations
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables for server-side operations');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// DEBUG: Track all operations
const debugLog = (operation: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] SUPABASE DEBUG - ${operation}:`, data);
};

// Convert Match to database format
const matchToDb = (match: Match) => ({
  id: match.id,
  config: match.config,
  status: match.status,
  current_set: match.currentSet,
  current_game: match.currentGame,
  game_number: match.gameNumber,
  sets: match.sets,
  current_game_score: match.currentGameScore,
  is_tie_break: match.isTieBreak,
  tie_break_score: match.tieBreakScore,
  game_history: match.gameHistory,
  match_winner: match.matchWinner,
  final_scoreline: match.finalScoreline,
  share_url: match.shareUrl,
  admin_token: match.adminToken
});

// Convert database format to Match
const dbToMatch = (dbMatch: any): Match => ({
  id: dbMatch.id,
  config: dbMatch.config,
  status: dbMatch.status,
  currentSet: dbMatch.current_set,
  currentGame: dbMatch.current_game,
  gameNumber: dbMatch.game_number,
  sets: dbMatch.sets,
  currentGameScore: dbMatch.current_game_score,
  isTieBreak: dbMatch.is_tie_break,
  tieBreakScore: dbMatch.tie_break_score,
  gameHistory: dbMatch.game_history,
  matchWinner: dbMatch.match_winner,
  finalScoreline: dbMatch.final_scoreline,
  createdAt: new Date(dbMatch.created_at),
  updatedAt: new Date(dbMatch.updated_at),
  shareUrl: dbMatch.share_url,
  adminToken: dbMatch.admin_token
});

export class MatchStorage {
  static async createMatch(match: Match): Promise<void> {
    debugLog('CREATE_MATCH_START', { matchId: match.id, matchData: match });
    
    try {
      const { error } = await supabase
        .from('matches')
        .insert(matchToDb(match));
      
      if (error) {
        debugLog('CREATE_MATCH_ERROR', { error });
        throw error;
      }
      
      debugLog('CREATE_MATCH_SUCCESS', { matchId: match.id });
    } catch (error) {
      debugLog('CREATE_MATCH_EXCEPTION', { error });
      throw error;
    }
  }

  static async getMatch(matchId: string): Promise<Match | null> {
    debugLog('GET_MATCH_START', { matchId });
    
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('id', matchId)
        .single();
      
      if (error) {
        debugLog('GET_MATCH_ERROR', { error });
        return null;
      }
      
      const match = data ? dbToMatch(data) : null;
      debugLog('GET_MATCH_RESULT', { 
        matchFound: !!match,
        matchId,
        matchData: match 
      });
      
      return match;
    } catch (error) {
      debugLog('GET_MATCH_EXCEPTION', { error });
      return null;
    }
  }

  static async updateMatch(matchId: string, updates: Partial<Match>): Promise<Match | null> {
    debugLog('UPDATE_MATCH_START', { matchId, updates });
    
    try {
      const { data, error } = await supabase
        .from('matches')
        .update(matchToDb(updates as Match))
        .eq('id', matchId)
        .select()
        .single();
      
      if (error) {
        debugLog('UPDATE_MATCH_ERROR', { error });
        return null;
      }
      
      const match = data ? dbToMatch(data) : null;
      debugLog('UPDATE_MATCH_SUCCESS', { matchId, match });
      return match;
    } catch (error) {
      debugLog('UPDATE_MATCH_EXCEPTION', { error });
      return null;
    }
  }

  static async deleteMatch(matchId: string): Promise<boolean> {
    debugLog('DELETE_MATCH_START', { matchId });
    
    try {
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', matchId);
      
      if (error) {
        debugLog('DELETE_MATCH_ERROR', { error });
        return false;
      }
      
      debugLog('DELETE_MATCH_SUCCESS', { matchId });
      return true;
    } catch (error) {
      debugLog('DELETE_MATCH_EXCEPTION', { error });
      return false;
    }
  }

  static async listMatches(): Promise<Match[]> {
    debugLog('LIST_MATCHES_START');
    
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        debugLog('LIST_MATCHES_ERROR', { error });
        return [];
      }
      
      const matches = data ? data.map(dbToMatch) : [];
      debugLog('LIST_MATCHES_SUCCESS', { count: matches.length });
      return matches;
    } catch (error) {
      debugLog('LIST_MATCHES_EXCEPTION', { error });
      return [];
    }
  }

  static async verifyAdminToken(matchId: string, adminToken: string): Promise<boolean> {
    debugLog('VERIFY_ADMIN_TOKEN_START', { matchId, adminToken });
    
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('admin_token')
        .eq('id', matchId)
        .single();
      
      if (error || !data) {
        debugLog('VERIFY_ADMIN_TOKEN_ERROR', { error });
        return false;
      }
      
      const isValid = data.admin_token === adminToken;
      debugLog('VERIFY_ADMIN_TOKEN_RESULT', { matchId, isValid });
      return isValid;
    } catch (error) {
      debugLog('VERIFY_ADMIN_TOKEN_EXCEPTION', { error });
      return false;
    }
  }
} 