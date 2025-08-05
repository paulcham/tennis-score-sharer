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
- **Serverless Architecture**: Scalable backend using Netlify Functions
- **Database Integration**: Persistent storage with Supabase PostgreSQL
- **Type Safety**: Full TypeScript implementation across the stack
- **Modern UI**: Beautiful interface built with shadcn/ui and Tailwind CSS

### 🔄 In Progress

- **Real-time Updates**: Currently using polling, planning to implement WebSocket or SSE
- **Match History Page**: List of past matches for admins
- **Advanced Statistics**: Player performance tracking
- **User Authentication**: User accounts and persistent match history
- **Mobile App**: Native mobile application development

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **UI Components**: shadcn/ui (built on Radix UI + Tailwind CSS)
- **Hosting**: Netlify (CDN, serverless functions, build system)
- **Backend**: Netlify Serverless Functions
- **Database**: Supabase (PostgreSQL with real-time capabilities)
- **Routing**: React Router for client-side navigation
- **Styling**: Tailwind CSS with custom design system

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

The application will be available at `http://localhost:3030`

### Development Ports

- **React App**: `http://localhost:3030` (changed from 3000)
- **Netlify Functions**: `http://localhost:8898` (changed from 8888)

These ports are configured to prevent conflicts with other local applications.

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

4. **Return to Match**
   - If you close the window or refresh, you can return to your match
   - Use the "Return to Match" option on the home page
   - Enter your match ID and admin token to continue scoring
   - The match ID is displayed in the scoring interface header

### For Match Viewers

1. **Follow a Match**
   - Click the shared URL from the match administrator
   - View the live scoreboard (read-only)
   - See real-time updates every 2 seconds

## Real-time Architecture

### Current Implementation
- **Polling Strategy**: 2-second intervals for real-time updates
- **Optimistic Updates**: UI updates immediately, syncs with server
- **Error Handling**: Graceful fallback when network issues occur
- **Caching**: Client-side caching to reduce API calls

### Future Enhancements
- **WebSocket Integration**: Real-time bidirectional communication
- **Server-Sent Events**: Alternative real-time solution
- **Push Notifications**: Mobile notifications for score updates
- **Offline Support**: Service workers for offline functionality

## Tennis Scoring Rules Supported

### Scoring Systems
- **Ad Scoring**: Players must win by 2 points after deuce
- **No-Ad Scoring**: At deuce, next point wins the game

### Match Formats
- **Single Set**: One set only
- **Best of 3**: First to win 2 sets
- **Best of 5**: First to win 3 sets

### Final Set Tiebreak
- **Optional**: For multi-set matches, the final set can be played as a tiebreak only
- **7-Point**: Final set decided by first to 7 points (win by 2)
- **10-Point**: Final set decided by first to 10 points (win by 2)
- **Common Use**: Used in recreational tennis and some tournament formats

### Set Duration
- **4 Games**: Short sets (recreational)
- **6 Games**: Standard tennis
- **8 Games**: Pro-set (single set to 8 games)

### Tie Break Rules
- **No Tie Break**: Continue until 2-game lead
- **7-Point Tie Break**: First to 7 points (win by 2)
- **10-Point Tie Break**: First to 10 points (win by 2)

## Project Structure

### Frontend Structure
```
src/
├── App.tsx                 # Main application router
├── pages/                  # Route-based components
│   ├── Home.tsx           # Landing page
│   ├── NewMatch.tsx       # Match creation interface
│   ├── ScoreMatch.tsx     # Admin scoring interface
│   └── ViewMatch.tsx      # Public match viewer
├── components/             # Reusable UI components
│   ├── ui/                # shadcn/ui components
│   ├── scoring/           # Scoring-specific components
│   └── shared/            # Common components
├── services/              # API integration layer
│   └── api.ts            # HTTP client for Netlify functions
├── utils/                 # Business logic
│   └── scoring.ts        # Tennis scoring algorithms
├── types/                 # TypeScript type definitions
│   └── Scoring.ts        # Tennis scoring types
└── hooks/                 # Custom React hooks
    └── useMatchUpdates.ts # Real-time updates
```

### Backend Structure
```
netlify/functions/
├── create-match.ts        # Match creation endpoint
├── get-match.ts          # Match retrieval endpoint
├── update-match.ts       # Match update endpoint
└── shared/
    └── storage.ts        # Database abstraction layer
```

## API Endpoints

### Core Match Operations
- `POST /.netlify/functions/create-match` - Create a new match with configuration
- `GET /.netlify/functions/get-match` - Retrieve match data by ID
- `PUT /.netlify/functions/update-match` - Update match score and state

### Data Flow
1. **Match Creation**: User configures match → API creates match → Returns match ID and admin token
2. **Real-time Scoring**: Admin updates score → API validates → Database updated → Viewers poll for updates
3. **Match Viewing**: Public URL accessed → API retrieves match → Real-time scoreboard displayed
4. **Match Return**: Admin returns to match → URL contains match ID → API loads match configuration

### Authentication
- **Admin Access**: Requires admin token for score updates
- **Public Access**: Read-only access for match viewers
- **Token Generation**: Unique admin tokens created per match
- **URL Persistence**: Match ID embedded in scoring URL for easy return

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

## System Architecture

For a detailed overview of the system architecture, including diagrams and technical specifications, see [ARCHITECTURE.md](./ARCHITECTURE.md).

### Key Architectural Features
- **Serverless Architecture**: Netlify Functions for API endpoints
- **Real-time Updates**: Polling-based updates with plans for WebSocket integration
- **Type Safety**: Full TypeScript implementation across frontend and backend
- **Database**: Supabase PostgreSQL with real-time capabilities
- **CDN**: Global content delivery via Netlify CDN

### Design Patterns
- **Component-Based**: React components with composition pattern
- **API-First**: RESTful API design with clear contracts
- **Separation of Concerns**: Business logic separated from UI components
- **Progressive Enhancement**: Works without JavaScript for basic functionality

## Deployment

The application is configured for deployment on Netlify with the following process:

1. **Build Process**: React application built and optimized
2. **Frontend Deployment**: Static assets deployed to Netlify CDN
3. **Function Deployment**: Serverless functions deployed to Netlify Functions
4. **Database**: Supabase database configured with proper indexes
5. **Environment Variables**: Production environment variables configured

## Performance & Scalability

### Performance Optimizations
- **Code Splitting**: React Router enables lazy loading of components
- **Bundle Optimization**: Tree shaking and minification for smaller bundles
- **CDN Delivery**: Global content delivery via Netlify CDN
- **Database Optimization**: Efficient queries with proper indexing
- **Caching Strategy**: Browser caching for static assets

### Scalability Features
- **Serverless Scaling**: Automatic scaling based on demand
- **Database Scaling**: Supabase handles database scaling automatically
- **Global CDN**: Content delivered from edge locations worldwide
- **Connection Pooling**: Efficient database connection management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
