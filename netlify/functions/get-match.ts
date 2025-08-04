import { Handler } from '@netlify/functions';
import { MatchStorage } from './shared/storage';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
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
        body: JSON.stringify({ error: 'Match not found' }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
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
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
}; 