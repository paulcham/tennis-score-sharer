import { Handler } from '@netlify/functions';
import { Match } from '../../src/types/Scoring';
import { MatchStorage } from './shared/storage';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'PUT') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { matchId, adminToken, updates }: { 
      matchId: string; 
      adminToken: string; 
      updates: Partial<Match> 
    } = body;

    if (!matchId || !adminToken) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Match ID and admin token are required' }),
      };
    }

    // Verify admin token
    const isAuthorized = await MatchStorage.verifyAdminToken(matchId, adminToken);
    if (!isAuthorized) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Unauthorized access' }),
      };
    }

    // Update match with new data
    const updatedMatch = await MatchStorage.updateMatch(matchId, updates);

    if (!updatedMatch) {
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
        match: updatedMatch,
        message: 'Match updated successfully'
      }),
    };
  } catch (error) {
    console.error('Error updating match:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
}; 