import { createClient } from '@supabase/supabase-js';

// These will be environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      matches: {
        Row: {
          id: string;
          config: any;
          status: string;
          current_set: number;
          current_game: number;
          game_number: number;
          sets: any[];
          current_game_score: any;
          is_tie_break: boolean;
          tie_break_score?: any;
          game_history: any[];
          match_winner?: string;
          final_scoreline?: string;
          created_at: string;
          updated_at: string;
          share_url: string;
          admin_token: string;
        };
        Insert: {
          id: string;
          config: any;
          status: string;
          current_set: number;
          current_game: number;
          game_number: number;
          sets: any[];
          current_game_score: any;
          is_tie_break: boolean;
          tie_break_score?: any;
          game_history: any[];
          match_winner?: string;
          final_scoreline?: string;
          created_at?: string;
          updated_at?: string;
          share_url: string;
          admin_token: string;
        };
        Update: {
          id?: string;
          config?: any;
          status?: string;
          current_set?: number;
          current_game?: number;
          game_number?: number;
          sets?: any[];
          current_game_score?: any;
          is_tie_break?: boolean;
          tie_break_score?: any;
          game_history?: any[];
          match_winner?: string;
          final_scoreline?: string;
          created_at?: string;
          updated_at?: string;
          share_url?: string;
          admin_token?: string;
        };
      };
    };
  };
} 