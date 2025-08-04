# Tennis Score Sharer - Development Plan

## Project Overview
A real-time tennis match scoring and sharing web application that allows parents to track and share their children's tennis matches in real-time.

## User Roles & Workflow

### 🎯 **Primary User Flow**

1. **Match Admin** (Score Recorder)
   - Goes to app and clicks "Start New Match"
   - Configures match settings (scoring system, format, player names, etc.)
   - Gets access to interactive scoreboard with scoring controls
   - Receives a shareable URL to distribute to viewers
   - Records scores in real-time during the match
   - Can pause/resume match if needed

2. **Match Viewer** (Score Follower)
   - Receives shareable URL from match admin
   - Views read-only scoreboard (same layout, no controls)
   - Sees real-time score updates
   - Can view match history and game-by-game breakdown
   - No authentication required - just needs the URL

### 🔑 **Key Features by Role**

#### Match Admin Features
- ✅ **Match Configuration**: Set scoring rules, player names, format
- ✅ **Interactive Scoring**: Point buttons, undo functionality, server controls
- ✅ **Match Management**: Start, pause, resume, complete matches
- ✅ **Shareable Links**: Generate and distribute public URLs
- ⏳ **Match History**: View past matches and their results

#### Match Viewer Features
- ⏳ **Read-only Scoreboard**: Same visual layout, no controls
- ⏳ **Real-time Updates**: Live score updates without refresh
- ⏳ **Match History**: View completed games and sets
- ⏳ **Mobile Optimized**: Works great on phones for parents watching

## Tech Stack
- **Frontend**: React with TypeScript
- **UI Components**: shadcn/ui (built on Radix UI + Tailwind CSS)
- **Hosting**: Netlify
- **Backend**: Netlify Serverless Functions
- **Database**: Netlify Functions with local storage or simple file-based storage
- **Real-time Updates**: WebSocket or Server-Sent Events (SSE)
- **Deployment**: Netlify (automatic from Git)

## Core Features

### 1. Match Configuration
- **Scoring System**: Ad/No-Ad scoring
- **Match Format**: Single set, Best of 3, Best of 5
- **Set Duration**: 4 games, 6 games, 8 game pro-set
- **Tie Break Rules**: No tie break, 7-point, 10-point
- **Player Names**: Home player vs Away player

### 2. Match Scoring Interface (Admin Only)
- **Game Scoring**: 0, 15, 30, 40, Deuce, Advantage
- **Set Scoring**: Track games won per set
- **Match Scoring**: Track sets won per player
- **Point Buttons**: Easy one-click scoring
- **Undo Functionality**: Mistake correction
- **Match Status**: In Progress, Completed, Paused
- **Server Controls**: Manual server assignment

### 3. Real-time Sharing
- **Unique Match URLs**: Each match gets a shareable URL
- **Live Updates**: Real-time score updates for viewers
- **Match History**: View completed matches and games
- **Public Access**: No authentication required for viewers
- **Admin Controls**: Only match creator can modify scores

### 4. Match Management
- **Create New Match**: Quick setup with defaults
- **Active Matches**: List of ongoing matches for admin
- **Match Archive**: Historical matches
- **Export/Import**: Match data backup

## Technical Architecture

### Frontend Structure
```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── scoring/      # Scoring interface components
│   ├── match/        # Match management components
│   └── shared/       # Common components
├── pages/
│   ├── Home.tsx      # Landing page with "Start New Match"
│   ├── NewMatch.tsx  # Match creation and configuration
│   ├── ScoreMatch.tsx # Admin scoring interface (current TestScoring)
│   ├── ViewMatch.tsx # Public match viewing (read-only)
│   └── MatchHistory.tsx # Past matches
├── hooks/
│   ├── useMatch.ts   # Match state management
│   ├── useScoring.ts # Scoring logic
│   └── useRealTime.ts # Real-time updates
├── types/
│   ├── Match.ts      # Match data types
│   ├── Scoring.ts    # Scoring system types
│   └── Config.ts     # Configuration types
├── utils/
│   ├── scoring.ts    # Tennis scoring logic
│   ├── validation.ts # Input validation
│   └── helpers.ts    # Utility functions
└── services/
    ├── api.ts        # API calls to Netlify functions
    └── realtime.ts   # Real-time communication
```

### Netlify Functions Structure
```
netlify/functions/
├── create-match.ts   # Create new match
├── update-match.ts   # Update match score
├── get-match.ts      # Get match data
├── list-matches.ts   # List user's matches
└── delete-match.ts   # Delete match
```

### Data Models

#### Match Configuration
```typescript
interface MatchConfig {
  scoringSystem: 'ad' | 'no-ad';
  matchFormat: 'single' | 'best-of-3' | 'best-of-5';
  setDuration: 4 | 6 | 8;
  tieBreakRules: 'none' | '7-point' | '10-point';
  player1Name: string;
  player2Name: string;
}
```

#### Match State
```typescript
interface Match {
  id: string;
  config: MatchConfig;
  status: 'in-progress' | 'completed' | 'paused';
  currentSet: number;
  currentGame: number;
  sets: SetScore[];
  currentGameScore: GameScore;
  isTieBreak: boolean;
  tieBreakScore?: TieBreakScore;
  createdAt: Date;
  updatedAt: Date;
  shareUrl: string;
  adminToken?: string; // For admin access
}

interface GameScore {
  player1Points: 0 | 15 | 30 | 40 | 'deuce' | 'advantage';
  player2Points: 0 | 15 | 30 | 40 | 'deuce' | 'advantage';
  server: 'player1' | 'player2';
}

interface SetScore {
  player1Games: number;
  player2Games: number;
  isComplete: boolean;
  winner?: 'player1' | 'player2';
}

interface TieBreakScore {
  player1Points: number;
  player2Points: number;
  isComplete: boolean;
  winner?: 'player1' | 'player2';
}
```

## Development Phases

### Phase 1: Core Setup & Basic Scoring ✅ COMPLETED
1. **Project Setup** ✅
   - Initialize React + TypeScript project
   - Set up shadcn/ui
   - Configure Netlify deployment
   - Create basic project structure

2. **Tennis Scoring Logic** ✅
   - Implement game scoring (0, 15, 30, 40, deuce, advantage)
   - Handle ad vs no-ad scoring systems
   - Implement set scoring with 2-game advantage rule
   - Implement match scoring (best of 3/5)
   - Handle tie break scoring (7-point, 10-point, or none)
   - Implement pro-set scoring (8 games)
   - Add undo functionality for mistake correction

3. **Basic UI Components** ✅
   - Match creation form
   - Advanced scoring interface with grid layout
   - Score display components with tennis styling
   - Match completion announcement system

### Phase 2: Match Management & Real-time Features 🔄 CURRENT
1. **Netlify Functions**
   - Create/update/get match endpoints
   - Simple data persistence
   - Real-time update mechanism

2. **Match Management**
   - Create new matches with proper UI
   - Active match tracking
   - Match history

3. **Real-time Sharing**
   - Unique match URLs
   - Live score updates
   - Public match viewing interface

### Phase 3: Advanced Features & Polish
1. **Advanced Scoring**
   - Tie break implementation ✅
   - Different set durations ✅
   - Match format variations ✅

2. **UI/UX Improvements**
   - Mobile-responsive design ✅
   - Smooth animations
   - Better visual feedback

3. **Additional Features**
   - Match export/import
   - Statistics tracking
   - Player profiles

## Implementation Details

### Tennis Scoring Rules

#### Game Scoring (Points)
- **0** = "Love" (starting point)
- **15** = First point won
- **30** = Second point won
- **40** = Third point won
- **Game** = Fourth point won (if not deuce)

#### Deuce and Advantage (Ad Scoring)
- **Deuce** = Both players have 40 points
- **Advantage** = Player needs one more point to win the game
- **Game Win** = Player with advantage wins the next point
- **Back to Deuce** = If player without advantage wins the point

#### No-Ad Scoring
- **Deuce** = Next point wins the game (no advantage)
- **Simplified** = Common in college tennis and recreational leagues

#### Set Scoring (Games)
- **6 Games** = Win a set (must win by 2 games)
- **7-5** = Valid set score (2-game lead)
- **6-6** = Tie break (if enabled) or continue until 2-game lead
- **8-6** = Valid set score (2-game lead)

#### Match Scoring (Sets)
- **Best of 3** = First to win 2 sets
- **Best of 5** = First to win 3 sets
- **Single Set** = One set only

#### Tie Break Rules
- **7-Point Tie Break**: First to 7 points (win by 2)
- **10-Point Tie Break**: First to 10 points (win by 2)
- **No Tie Break**: Continue until 2-game lead
- **Tie Break Scoring**: 1, 2, 3, 4, 5, 6, 7 (not 15, 30, 40)

#### Set Duration Options
- **4 Games**: Short sets (recreational)
- **6 Games**: Standard tennis
- **8 Game Pro-Set**: Single set to 8 games (win by 2)

### Real-time Updates Strategy
- **Option 1**: Server-Sent Events (SSE) for simplicity
- **Option 2**: WebSocket for more complex real-time features
- **Fallback**: Polling for basic functionality

### Data Storage
- **Netlify Functions**: Use simple file-based storage or local storage
- **Future**: Consider FaunaDB or similar serverless database

## Success Metrics
- [ ] Create a new match in under 30 seconds
- [ ] Score updates appear in real-time (< 2 seconds)
- [ ] Mobile-friendly interface
- [ ] Handle all tennis scoring scenarios
- [ ] Shareable URLs work reliably

## Next Steps
1. Set up Netlify Functions for data persistence
2. Create proper match creation flow
3. Implement shareable URLs
4. Build read-only viewer interface
5. Add real-time updates

Ready to start with Phase 2! 