# Tennis Score Sharer

A real-time tennis match scoring and sharing web application that allows parents to track and share their children's tennis matches in real-time.

## Features

### ✅ Completed Features

- **Real-time Tennis Scoring**: Complete tennis scoring system with ad/no-ad scoring, tie breaks, and multiple match formats
- **Match Configuration**: Set up matches with player names, scoring rules, and match formats
- **Interactive Scoring Interface**: Point-by-point scoring with undo functionality and server controls
- **Match Sharing**: Generate unique URLs to share matches with viewers
- **Read-only Viewer**: Public interface for following matches in real-time
- **Match History**: Detailed game-by-game breakdown and match statistics
- **Mobile Responsive**: Works perfectly on phones and tablets

### 🔄 In Progress

- **Real-time Updates**: Currently using polling, planning to implement WebSocket or SSE
- **Match History Page**: List of past matches for admins
- **Advanced Statistics**: Player performance tracking

## Tech Stack

- **Frontend**: React with TypeScript
- **UI Components**: shadcn/ui (built on Radix UI + Tailwind CSS)
- **Hosting**: Netlify
- **Backend**: Netlify Serverless Functions
- **Database**: In-memory storage (will be upgraded to persistent storage)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tennis-score-sharer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. In another terminal, start the Netlify dev server for functions:
```bash
npx netlify dev
```

The application will be available at `http://localhost:3000`

## How to Use

### For Match Administrators (Score Recorders)

1. **Start a New Match**
   - Go to the home page and click "Start New Match"
   - Configure match settings (player names, scoring system, format)
   - Click "Start Match" to begin scoring

2. **Score the Match**
   - Use the + and - buttons to add/remove points
   - Use "Make Server" to change who's serving
   - The system automatically handles deuce, advantage, and game/set progression

3. **Share the Match**
   - Copy the shareable URL that appears at the top
   - Send it to friends and family to let them follow along

### For Match Viewers

1. **Follow a Match**
   - Click the shared URL from the match administrator
   - View the live scoreboard (read-only)
   - See real-time updates every 2 seconds

## Tennis Scoring Rules Supported

### Game Scoring
- **0** = "Love" (starting point)
- **15** = First point won
- **30** = Second point won  
- **40** = Third point won
- **Game** = Fourth point won (if not deuce)

### Scoring Systems
- **Ad Scoring**: Players must win by 2 points after deuce
- **No-Ad Scoring**: At deuce, next point wins the game

### Match Formats
- **Single Set**: One set only
- **Best of 3**: First to win 2 sets
- **Best of 5**: First to win 3 sets

### Set Duration
- **4 Games**: Short sets (recreational)
- **6 Games**: Standard tennis
- **8 Games**: Pro-set (single set to 8 games)

### Tie Break Rules
- **No Tie Break**: Continue until 2-game lead
- **7-Point Tie Break**: First to 7 points (win by 2)
- **10-Point Tie Break**: First to 10 points (win by 2)

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── scoring/      # Scoring interface components
│   └── shared/       # Common components
├── pages/
│   ├── Home.tsx      # Landing page
│   ├── NewMatch.tsx  # Match creation
│   ├── ScoreMatch.tsx # Admin scoring interface
│   └── ViewMatch.tsx # Public match viewing
├── types/
│   └── Scoring.ts    # Tennis scoring types
├── utils/
│   └── scoring.ts    # Tennis scoring logic
└── services/
    └── api.ts        # API calls to Netlify functions
```

## API Endpoints

- `POST /.netlify/functions/create-match` - Create a new match
- `GET /.netlify/functions/get-match` - Get match data
- `PUT /.netlify/functions/update-match` - Update match score

## Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npx tsc --noEmit` - Type check

### Testing Routes

- `/` - Home page
- `/new-match` - Create new match
- `/score-match` - Admin scoring interface
- `/view/:matchId` - Public match viewing
- `/test-scoring` - Test scoring interface
- `/test-api` - Test API endpoints

## Deployment

The application is configured for deployment on Netlify. The build process will:

1. Build the React application
2. Deploy the frontend to Netlify
3. Deploy the serverless functions to Netlify Functions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
