-- Create matches table
CREATE TABLE matches (
  id TEXT PRIMARY KEY,
  config JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'in-progress',
  current_set INTEGER NOT NULL DEFAULT 1,
  current_game INTEGER NOT NULL DEFAULT 1,
  game_number INTEGER NOT NULL DEFAULT 1,
  sets JSONB NOT NULL DEFAULT '[]',
  current_game_score JSONB NOT NULL DEFAULT '{"player1Points": 0, "player2Points": 0, "server": "player1"}',
  is_tie_break BOOLEAN NOT NULL DEFAULT false,
  tie_break_score JSONB,
  game_history JSONB NOT NULL DEFAULT '[]',
  match_winner TEXT,
  final_scoreline TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  share_url TEXT NOT NULL,
  admin_token TEXT NOT NULL
);

-- Create index on admin_token for fast lookups
CREATE INDEX idx_matches_admin_token ON matches(admin_token);

-- Create index on created_at for sorting
CREATE INDEX idx_matches_created_at ON matches(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for now - we can add auth later)
CREATE POLICY "Allow all operations" ON matches FOR ALL USING (true);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_matches_updated_at 
    BEFORE UPDATE ON matches 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 