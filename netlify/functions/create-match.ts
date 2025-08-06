import { Handler } from '@netlify/functions';
import { Match, MatchConfig } from '../../src/types/Scoring';
import { MatchStorage } from './shared/storage';

export const handler: Handler = async (event) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      } as Record<string, string>,
    };
  }

      if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: {
          'Access-Control-Allow-Origin': '*',
        } as Record<string, string>,
        body: JSON.stringify({ error: 'Method not allowed' }),
      };
    }

  try {
    const body = JSON.parse(event.body || '{}');
    const { config }: { config: MatchConfig } = body;

    if (!config) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Match configuration is required' }),
      };
    }

    // Generate unique match ID
    const matchId = generateMatchId();
    
    // Generate admin token for match creator
    const adminToken = generateAdminToken();
    
    // Generate shareable URL
    // For local development, use port 3030 (React app), for production use the Netlify URL
    const baseUrl = process.env.URL?.includes('localhost:8898') 
      ? 'http://localhost:3030' 
      : (process.env.URL || 'http://localhost:3030');
    const shareUrl = `${baseUrl}/view/${matchId}`;

    // Create new match
    const newMatch: Match = {
      id: matchId,
      config,
      status: 'in-progress',
      currentSet: 1,
      currentGame: 1,
      gameNumber: 1,
      sets: [{ player1Games: 0, player2Games: 0, isComplete: false }],
      currentGameScore: {
        player1Points: 0,
        player2Points: 0,
        server: 'player1'
      },
      isTieBreak: false,
      tieBreakScore: undefined,
      gameHistory: [],
      matchWinner: undefined,
      finalScoreline: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      shareUrl,
      adminToken
    };

    // Store match using shared storage
    console.log('=== CREATE MATCH FUNCTION DEBUG ===');
    console.log('About to store match:', matchId);
    console.log('Match data:', JSON.stringify(newMatch, null, 2));
    await MatchStorage.createMatch(newMatch);
    console.log('Match stored successfully');
    console.log('=== END CREATE MATCH FUNCTION ===');

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        match: newMatch,
        message: 'Match created successfully'
      }),
    };
  } catch (error) {
    console.error('Error creating match:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

function generateMatchId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function generateAdminToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
} 