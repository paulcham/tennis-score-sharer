# Tennis Score Sharer - Database Upgrade Plan

## Overview

This document outlines the comprehensive plan for upgrading the Tennis Score Sharer application from its current simple JSONB-based structure to a normalized, scalable database design that supports advanced features including point-level detail tracking, real-time statistics, player profiles, and user authentication.

## Current State Analysis

### Existing Architecture
- **Database**: Single `matches` table with JSONB fields for flexible data storage
- **API**: Netlify functions with basic CRUD operations
- **Frontend**: React app with real-time polling for updates
- **Authentication**: Simple admin token system
- **Data Structure**: Game-level scoring only, no point-level detail

### Current Limitations
- No point-level detail tracking
- Limited queryability due to JSONB structure
- No player profiles or statistics
- No user authentication
- No real-time event system
- Difficult to build analytics and statistics

## Target Architecture

### New Database Schema
```sql
-- Core tables for normalized data structure
matches (enhanced with player references)
match_sets (normalized set data)
match_games (normalized game data)
match_points (point-level detail)
scoring_events (real-time events)
players (player profiles)
player_stats (aggregated statistics)
users (authentication)
user_sessions (session management)
```

### Key Improvements
- **Normalized Structure**: Better queryability and performance
- **Point-Level Detail**: Complete match replay capability
- **Real-time Events**: Event-driven architecture
- **Player Profiles**: Track players across multiple matches
- **User Authentication**: Secure access and billing foundation
- **Statistics Engine**: Real-time aggregated stats
- **Freemium Model**: Free basic features, premium advanced features

## Implementation Phases

### Phase 1: Normalize Match Data Structure
**Duration**: 2-3 days
**Goal**: Create new database with normalized match structure while maintaining app functionality

#### 1.1 Create New Database Schema
- [ ] Create new Supabase project for development
- [ ] Implement normalized schema:
  ```sql
  -- Enhanced matches table
  CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player1_name TEXT NOT NULL,
    player2_name TEXT NOT NULL,
    config JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'in-progress',
    match_winner TEXT,
    final_scoreline TEXT,
    share_url TEXT UNIQUE NOT NULL,
    admin_token TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Sets table
  CREATE TABLE match_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    set_number INTEGER NOT NULL,
    player1_games INTEGER NOT NULL DEFAULT 0,
    player2_games INTEGER NOT NULL DEFAULT 0,
    is_complete BOOLEAN NOT NULL DEFAULT false,
    winner TEXT,
    tie_break_score JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(match_id, set_number)
  );

  -- Games table
  CREATE TABLE match_games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    set_id UUID REFERENCES match_sets(id) ON DELETE CASCADE,
    game_number INTEGER NOT NULL,
    player1_points INTEGER NOT NULL DEFAULT 0,
    player2_points INTEGER NOT NULL DEFAULT 0,
    server TEXT NOT NULL,
    is_complete BOOLEAN NOT NULL DEFAULT false,
    winner TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(match_id, set_id, game_number)
  );
  ```

#### 1.2 Update TypeScript Types
- [ ] Create new types in `src/types/Database.ts`:
  ```typescript
  export interface DatabaseMatch {
    id: string;
    player1_name: string;
    player2_name: string;
    config: MatchConfig;
    status: 'in-progress' | 'completed' | 'paused';
    match_winner?: string;
    final_scoreline?: string;
    share_url: string;
    admin_token: string;
    created_at: string;
    updated_at: string;
  }

  export interface DatabaseSet {
    id: string;
    match_id: string;
    set_number: number;
    player1_games: number;
    player2_games: number;
    is_complete: boolean;
    winner?: string;
    tie_break_score?: any;
    created_at: string;
    updated_at: string;
  }

  export interface DatabaseGame {
    id: string;
    match_id: string;
    set_id: string;
    game_number: number;
    player1_points: number;
    player2_points: number;
    server: string;
    is_complete: boolean;
    winner?: string;
    created_at: string;
    updated_at: string;
  }
  ```

#### 1.3 Update Storage Layer
- [ ] Replace `netlify/functions/shared/storage.ts` with new implementation:
  ```typescript
  export class MatchStorage {
    static async createMatch(match: Match): Promise<void>
    static async getMatch(matchId: string): Promise<Match | null>
    static async updateMatch(matchId: string, updates: Partial<Match>): Promise<Match | null>
    static async createSet(matchId: string, setData: any): Promise<string>
    static async updateSet(setId: string, updates: any): Promise<void>
    static async createGame(matchId: string, setId: string, gameData: any): Promise<string>
    static async updateGame(gameId: string, updates: any): Promise<void>
  }
  ```

#### 1.4 Update API Functions
- [ ] Replace existing API functions with new implementations:
  - `create-match.ts` (updated)
  - `get-match.ts` (updated)
  - `update-match.ts` (updated)
- [ ] Implement new data structures directly
- [ ] Remove old JSONB-based logic

#### 1.5 Update Frontend
- [ ] Update existing API service class `MatchAPI`
- [ ] Update all components to use new data structures
- [ ] Remove old data conversion logic
- [ ] Test all functionality with new database

### Phase 2: Implement Point-Level Detail Tracking
**Duration**: 3-4 days
**Goal**: Add point-level detail tracking while maintaining real-time scoring

#### 2.1 Extend Database Schema
- [ ] Add points table:
  ```sql
  CREATE TABLE match_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    set_id UUID REFERENCES match_sets(id) ON DELETE CASCADE,
    game_id UUID REFERENCES match_games(id) ON DELETE CASCADE,
    point_number INTEGER NOT NULL,
    server TEXT NOT NULL,
    point_winner TEXT,
    point_type TEXT CHECK (point_type IN ('ace', 'winner', 'unforced_error', 'forced_error', 'double_fault', 'other')),
    is_first_serve BOOLEAN,
    is_second_serve BOOLEAN,
    rally_length INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(match_id, set_id, game_id, point_number)
  );
  ```

#### 2.2 Update Scoring Logic
- [ ] Modify `src/utils/scoring.ts` to track point-level detail
- [ ] Add point type detection logic
- [ ] Update game completion logic to record final point
- [ ] Add serve tracking (first vs second serve)

#### 2.3 Enhance Scoring Interface
- [ ] Add point type selection to scoring buttons
- [ ] Create point detail modal for advanced scoring
- [ ] Add serve indicator (1st/2nd serve)
- [ ] Implement point history display

#### 2.4 Update Storage Layer
- [ ] Add point creation methods to `NewMatchStorage`
- [ ] Implement point aggregation for game/set completion
- [ ] Add point history retrieval methods

#### 2.5 Update API Functions
- [ ] Add point creation endpoint
- [ ] Update match retrieval to include point history
- [ ] Add point statistics endpoints

### Phase 3: Implement Real-time Scoring Events
**Duration**: 2-3 days
**Goal**: Create event-driven architecture for real-time updates

#### 3.1 Add Events Table
- [ ] Create scoring events table:
  ```sql
  CREATE TABLE scoring_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  ```

#### 3.2 Create Event Types
- [ ] Define event types:
  ```typescript
  export type ScoringEventType = 
    | 'point_scored'
    | 'game_completed'
    | 'set_completed'
    | 'match_completed'
    | 'serve_changed'
    | 'tie_break_started'
    | 'tie_break_completed';
  ```

#### 3.3 Update Scoring Logic
- [ ] Modify scoring functions to emit events
- [ ] Create event emission system
- [ ] Add event logging to all scoring operations

#### 3.4 Create Real-time API
- [ ] Add `get-match-events.ts` function
- [ ] Implement event polling endpoint
- [ ] Add event filtering by timestamp

#### 3.5 Update Frontend
- [ ] Create `useMatchEvents` hook
- [ ] Implement event-based updates
- [ ] Add real-time event display
- [ ] Create event history component

### Phase 4: Add Real-time Match Statistics
**Duration**: 2-3 days
**Goal**: Display real-time statistics during matches

#### 4.1 Create Statistics Engine
- [ ] Create `src/utils/statistics.ts`:
  ```typescript
  export class MatchStatistics {
    static calculateServiceStats(points: MatchPoint[]): ServiceStats
    static calculatePointStats(points: MatchPoint[]): PointStats
    static calculateGameStats(games: DatabaseGame[]): GameStats
    static calculateSetStats(sets: DatabaseSet[]): SetStats
  }
  ```

#### 4.2 Add Statistics API
- [ ] Create `get-match-stats.ts` function
- [ ] Implement real-time statistics calculation
- [ ] Add statistics caching for performance

#### 4.3 Create Statistics Components
- [ ] Create `MatchStats.tsx` component
- [ ] Add service percentage display
- [ ] Add point type breakdown
- [ ] Add game/set statistics
- [ ] Create statistics dashboard

#### 4.4 Update Match Screens
- [ ] Add statistics panel to scoring interface
- [ ] Add statistics to match viewing screen
- [ ] Create statistics toggle controls
- [ ] Add real-time statistics updates

### Phase 5: Add Player Profiles
**Duration**: 3-4 days
**Goal**: Allow users to create and manage player profiles

#### 5.1 Extend Database Schema
- [ ] Add players table:
  ```sql
  CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  CREATE TABLE player_stats (
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    total_matches INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    total_sets_won INTEGER DEFAULT 0,
    total_sets_lost INTEGER DEFAULT 0,
    total_games_won INTEGER DEFAULT 0,
    total_games_lost INTEGER DEFAULT 0,
    total_points_won INTEGER DEFAULT 0,
    total_points_lost INTEGER DEFAULT 0,
    service_percentage DECIMAL(5,2) DEFAULT 0,
    aces INTEGER DEFAULT 0,
    double_faults INTEGER DEFAULT 0,
    winners INTEGER DEFAULT 0,
    unforced_errors INTEGER DEFAULT 0,
    forced_errors INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (player_id)
  );
  ```

#### 5.2 Update Match Schema
- [ ] Add player references to matches table:
  ```sql
  ALTER TABLE matches 
  ADD COLUMN player1_id UUID REFERENCES players(id),
  ADD COLUMN player2_id UUID REFERENCES players(id);
  ```

#### 5.3 Create Player Management
- [ ] Create player creation/editing interface
- [ ] Add player selection to match creation
- [ ] Implement player search and autocomplete
- [ ] Add player profile pages

#### 5.4 Update Statistics Engine
- [ ] Extend statistics to work with player IDs
- [ ] Create player-specific statistics
- [ ] Add player comparison features
- [ ] Implement player ranking system

#### 5.5 Create Player API
- [ ] Add `create-player.ts` function
- [ ] Add `get-player.ts` function
- [ ] Add `update-player.ts` function
- [ ] Add `get-player-stats.ts` function

### Phase 6: Add User Authentication
**Duration**: 5-6 days
**Goal**: Implement user authentication and authorization with Google SSO support

#### 6.1 Extend Database Schema
- [ ] Add users table:
  ```sql
  CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT, -- NULL for SSO users
    display_name TEXT,
    auth_provider TEXT CHECK (auth_provider IN ('local', 'google')),
    google_id TEXT UNIQUE, -- For Google SSO users
    avatar_url TEXT, -- Profile picture URL
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium')),
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    trial_ends_at TIMESTAMP WITH TIME ZONE
  );

  CREATE TABLE subscription_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    feature_name TEXT NOT NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT false,
    enabled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, feature_name)
  );
  ```

  CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  ```

#### 6.2 Update Match Schema
- [ ] Add user reference to matches:
  ```sql
  ALTER TABLE matches 
  ADD COLUMN created_by UUID REFERENCES users(id);
  ```

#### 6.3 Implement Authentication & Subscription Management
- [ ] Create authentication API functions:
  - `register.ts` (local auth)
  - `login.ts` (local auth)
  - `google-auth.ts` (Google SSO)
  - `logout.ts`
  - `verify-session.ts`
- [ ] Implement password hashing and JWT tokens for local auth
- [ ] Implement Google OAuth 2.0 flow
- [ ] Add session management for both auth types
- [ ] Create user account linking (merge local and Google accounts)
- [ ] Create subscription management:
  - `check-subscription.ts`
  - `upgrade-subscription.ts`
  - `downgrade-subscription.ts`
- [ ] Implement feature access control system

#### 6.4 Create Authentication & Subscription UI
- [ ] Create login/register forms for local auth
- [ ] Add Google SSO button and flow
- [ ] Create account linking interface
- [ ] Add authentication state management
- [ ] Implement protected routes
- [ ] Add user profile management with avatar support
- [ ] Create subscription management interface:
  - Subscription status display
  - Upgrade/downgrade buttons
  - Feature comparison table
  - Payment integration (Stripe)
- [ ] Add feature access controls to UI components

#### 6.5 Update Authorization & Feature Access
- [ ] Add user ownership to matches
- [ ] Implement match access control
- [ ] Add admin-only features
- [ ] Create user dashboard
- [ ] Implement feature access control:
  - Free tier: Basic scoring and sharing only
  - Premium tier: All advanced features
  - Feature gating in UI components
  - Upgrade prompts for premium features

## Freemium Model Design

### Feature Tiers

#### Free Tier (Current Features)
- **Basic Match Scoring**: Simple game/set scoring
- **Real-time Sharing**: Live score updates for viewers
- **Match History**: View completed matches
- **QR Code Sharing**: Easy match sharing
- **Anonymous Usage**: No account required

#### Premium Tier (New Features)
- **Point-Level Detail**: Track every point with attributes
- **Advanced Statistics**: Real-time service %, winners, errors
- **Player Profiles**: Create and manage player profiles
- **Player Statistics**: Aggregate stats across matches
- **Match Replay**: Point-by-point match replay
- **Advanced Scoring**: First/second serve tracking, point types
- **User Accounts**: Save matches, manage players
- **Export Features**: Download match data and statistics

### Subscription Management
- **Free Trial**: 7-day trial of premium features
- **Monthly/Annual Plans**: Flexible billing options
- **Feature Gating**: UI components check subscription status
- **Upgrade Prompts**: Seamless upgrade flow
- **Downgrade Handling**: Graceful feature removal

## Technical Implementation Details

### Development Strategy
1. **Feature Branch**: Develop all changes on a dedicated feature branch
2. **New Database**: Create fresh Supabase project for new schema
3. **Clean Implementation**: No backward compatibility needed
4. **Direct Replacement**: Replace old APIs with new ones when ready
5. **Feature Flags**: Implement subscription-based feature access

### Frontend Architecture Updates
1. **Service Layer**: Update existing API service classes
2. **State Management**: Update hooks for new data structures
3. **Component Updates**: Modify components to handle new data
4. **Error Handling**: Add comprehensive error handling
5. **Feature Access**: Implement subscription-based feature gating

### Performance Considerations
1. **Database Indexes**: Add indexes for frequently queried fields
2. **Caching Strategy**: Implement caching for statistics and player data
3. **Pagination**: Add pagination for large datasets
4. **Optimization**: Optimize queries and data fetching

## Testing Strategy

### Unit Testing
- [ ] Test all new database functions
- [ ] Test scoring logic with point-level detail
- [ ] Test statistics calculations
- [ ] Test authentication flows

### Integration Testing
- [ ] Test API endpoints with new data structures
- [ ] Test real-time updates
- [ ] Test player profile functionality
- [ ] Test user authentication
- [ ] Test subscription management and billing
- [ ] Test feature access controls

### End-to-End Testing
- [ ] Test complete match scoring flow
- [ ] Test player profile creation and management
- [ ] Test user registration and login
- [ ] Test statistics display and updates
- [ ] Test subscription upgrade/downgrade flow
- [ ] Test feature access across subscription tiers

## Deployment Strategy

### Development Environment
1. **Feature Branch**: Develop all changes on dedicated branch
2. **New Database**: Use fresh Supabase project for new schema
3. **Testing**: Comprehensive testing before merging
4. **Documentation**: Update documentation for each phase

### Staging Environment
1. **Staging Database**: Deploy to staging Supabase project
2. **Feature Testing**: Test all features in staging
3. **Performance Testing**: Load test new features
4. **User Acceptance**: Internal testing with stakeholders

### Production Deployment
1. **Direct Deployment**: Deploy complete feature when ready
2. **Database Switch**: Point app to new database
3. **Monitoring**: Monitor performance and errors
4. **Clean Deployment**: No rollback complexity needed

## Success Metrics

### Technical Metrics
- [ ] Database query performance improvements
- [ ] Real-time update latency
- [ ] API response times
- [ ] Error rates and stability

### User Experience Metrics
- [ ] Scoring interface usability
- [ ] Statistics display clarity
- [ ] Player profile management ease
- [ ] Authentication flow completion

### Business Metrics
- [ ] User engagement with new features
- [ ] Player profile creation rate
- [ ] User registration rate
- [ ] Feature adoption rates
- [ ] Free-to-premium conversion rate
- [ ] Subscription retention rates
- [ ] Average revenue per user (ARPU)
- [ ] Customer lifetime value (CLV)

## Risk Mitigation

### Technical Risks
1. **Database Performance**: Monitor and optimize queries
2. **Data Integrity**: Implement comprehensive validation
3. **Development Complexity**: Manage scope and complexity
4. **Real-time Performance**: Optimize event system

### User Experience Risks
1. **Feature Complexity**: Provide clear documentation
2. **Development Time**: Manage expectations for completion
3. **Performance Impact**: Monitor and optimize performance
4. **Testing Coverage**: Ensure comprehensive testing

## Timeline Summary

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| Phase 1 | 2-3 days | Normalized database, updated APIs |
| Phase 2 | 3-4 days | Point-level tracking, enhanced scoring |
| Phase 3 | 2-3 days | Real-time events, event-driven updates |
| Phase 4 | 2-3 days | Statistics engine, real-time stats |
| Phase 5 | 3-4 days | Player profiles, player management |
| Phase 6 | 5-6 days | User authentication, authorization, Google SSO |

**Total Estimated Duration**: 17-23 days

## Next Steps

1. **Review and Approve**: Review this plan with stakeholders
2. **Environment Setup**: Set up new Supabase project and feature branch
3. **Development Start**: Begin Phase 1 implementation
4. **Regular Reviews**: Weekly progress reviews and adjustments
5. **Deployment**: Deploy when all phases are complete

This plan provides a comprehensive roadmap for upgrading the Tennis Score Sharer application to support advanced features with a clean, direct implementation approach.
