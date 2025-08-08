# Tennis Score Sharer

A real-time tennis match scoring and sharing web application that allows parents to track and share their children's tennis matches in real-time.

## Features

### ✅ Completed Features

- **Real-time Tennis Scoring**: Complete tennis scoring system with ad/no-ad scoring, tie breaks, and multiple match formats
- **Match Configuration**: Set up matches with player names, scoring rules, and match formats
- **Interactive Scoring Interface**: Point-by-point scoring with undo functionality and server controls
- **Match Sharing**: Generate unique URLs to share matches with viewers
- **QR Code Sharing**: Generate QR codes for easy mobile sharing
- **Read-only Viewer**: Public interface for following matches in real-time
- **Match History**: Detailed game-by-game breakdown and match statistics
- **Mobile Responsive**: Works perfectly on phones and tablets
- **Serverless Architecture**: Scalable backend using Netlify Functions
- **Database Integration**: Persistent storage with Supabase PostgreSQL
- **Type Safety**: Full TypeScript implementation across the stack
- **Modern UI**: Beautiful interface built with shadcn/ui and Tailwind CSS
- **Clean Code**: Optimized codebase with removed debug logs and improved performance

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
- Netlify CLI (for local development)

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

3. Set up environment variables:
```bash
cp env-template.txt .env.local
```
Edit `.env.local` with your Supabase credentials (see Environment Setup below).

4. Start the development server:
```bash
npm start
# or use the new dev commands:
npm run dev
npm run dev:start
```

5. In another terminal, start the Netlify dev server for functions:
```bash
npx netlify dev
```

### Development Commands

The following npm scripts are available for development:

- `npm start` - Start the React development server (port 3030)
- `npm run dev` - Start the full development environment (Netlify dev server on port 8898)
- `npm run dev:start` - Start the full development environment
- `npm run dev:stop` - Stop the development server
- `npm run dev:restart` - Restart the development server (stop + start)
- `npm run dev:restart:cross` - Cross-platform restart (works on Windows/macOS/Linux)
- `npm run frontend` - Start only the React frontend (port 3030)
- `npm run backend` - Start only the Netlify dev server (port 8898)

The application will be available at `http://localhost:8898` when using the dev commands, but the browser will only open `http://localhost:3030` automatically.

### Development Ports

- **React App (standalone)**: `http://localhost:3030` (changed from 3000) - Browser opens here automatically
- **Full Dev Environment**: `http://localhost:8898` (Netlify dev server with React app + functions)
- **Netlify Functions**: Available via `http://localhost:8898/.netlify/functions/*`

### Environment Setup

The application requires Supabase configuration for database functionality. Create a `.env.local` file with the following variables:

```bash
# Supabase Configuration (Client-side)
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here

# Supabase Configuration (Server-side for Netlify Functions)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**To get these values:**
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Go to Settings → API in your Supabase dashboard
3. Copy the Project URL and anon/public key
4. For the service role key, use the `service_role` key (keep this secret!)

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
   - Click the QR code icon to generate a QR code for easy mobile sharing
   - Send the URL or QR code to friends and family to let them follow along

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
- **Clean Code**: Removed debug logs and optimized performance

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
│   ├── ViewMatch.tsx      # Public match viewer
│   ├── TestScoring.tsx    # Test scoring interface
│   └── TestAPI.tsx        # Test API endpoints
├── components/             # Reusable UI components
│   ├── ui/                # shadcn/ui components
│   │   ├── button.tsx     # Button component
│   │   └── card.tsx       # Card component
│   ├── scoring/           # Scoring-specific components
│   │   ├── GameScorer.tsx # Main scoring interface
│   │   └── Scoreboard.tsx # Scoreboard display
│   └── shared/            # Common components
│       ├── QRCodeModal.tsx # QR code generation
│       └── TennisBallIcon.tsx # Tennis ball icon
├── services/              # API integration layer
│   └── api.ts            # HTTP client for Netlify functions
├── utils/                 # Business logic
│   └── scoring.ts        # Tennis scoring algorithms
├── types/                 # TypeScript type definitions
│   └── Scoring.ts        # Tennis scoring types
├── hooks/                 # Custom React hooks
│   └── useMatchUpdates.ts # Real-time updates
├── lib/                   # Library configurations
│   ├── colors.ts         # Tennis color scheme
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # Utility functions
└── styles/                # Global styles
    └── index.css         # Global CSS
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

- `npm start` - Start React development server (port 3030)
- `npm run dev` - Start full development environment (Netlify dev server on port 8898)
- `npm run dev:start` - Start full development environment
- `npm run dev:stop` - Stop the development server
- `npm run dev:restart` - Restart the development server
- `npm run frontend` - Start only the React frontend (port 3030)
- `npm run backend` - Start only the Netlify dev server (port 8898)
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

### Development Tips

- **Hot Reload**: Both React and Netlify Functions support hot reloading
- **Environment Variables**: Use `.env.local` for local development (not committed to git)
- **Port Conflicts**: If you get port conflicts, the scripts are configured to use ports 3030 and 8898
- **Database**: Make sure your Supabase project is set up and environment variables are configured
- **Netlify CLI**: Install globally with `npm install -g netlify-cli` for better development experience

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
- **Clean Code**: Removed debug logs and optimized component performance
- **Type Safety**: Full TypeScript implementation prevents runtime errors

### Scalability Features
- **Serverless Scaling**: Automatic scaling based on demand
- **Database Scaling**: Supabase handles database scaling automatically
- **Global CDN**: Content delivered from edge locations worldwide
- **Connection Pooling**: Efficient database connection management

## Recent Updates

### Code Cleanup (Latest)
- **Removed Debug Logs**: Cleaned up all development console.log statements
- **Optimized Performance**: Improved component rendering and state management
- **Enhanced UI**: Updated tennis ball icon behavior and QR code modal
- **Better Error Handling**: Maintained important error logging while removing debug noise
- **Type Safety**: Full TypeScript implementation prevents runtime errors

### Key Improvements
- **QR Code Sharing**: Added QR code generation for easy mobile sharing
- **Tennis Ball Icon**: Improved serving indicator with single visible icon
- **Modal Design**: Clean, centered QR code modal with proper spacing
- **Development Experience**: Better npm scripts and port configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Use functional components with hooks
- Maintain clean code without debug logs
- Test API endpoints thoroughly
- Update documentation for new features

## License

This project is licensed under the MIT License.
