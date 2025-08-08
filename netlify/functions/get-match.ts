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

    const match = await MatchStorage.getMatch(matchId);

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