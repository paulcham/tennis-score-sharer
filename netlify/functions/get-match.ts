import { Handler } from '@netlify/functions';
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

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
      } as Record<string, string>,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { matchId } = event.queryStringParameters || {};

    if (!matchId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Match ID is required' }),
      };
    }

    console.log('=== GET MATCH FUNCTION DEBUG ===');
    console.log('Looking for match:', matchId);
    const match = await MatchStorage.getMatch(matchId);
    console.log('Match found:', !!match);
    console.log('Match data:', match ? JSON.stringify(match, null, 2) : 'null');
    console.log('=== END GET MATCH FUNCTION ===');

    if (!match) {
          return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Match not found' }),
    };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        match,
        message: 'Match retrieved successfully'
      }),
    };
  } catch (error) {
    console.error('Error getting match:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
}; 