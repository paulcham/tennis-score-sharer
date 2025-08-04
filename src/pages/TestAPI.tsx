import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { MatchAPI } from '../services/api';
import { MatchConfig } from '../types/Scoring';

const TestAPI: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const testCreateMatch = async () => {
    setLoading(true);
    setResult('');

    try {
      const testConfig: MatchConfig = {
        scoringSystem: 'ad',
        matchFormat: 'best-of-3',
        setDuration: 6,
        tieBreakRules: '7-point',
        player1Name: 'Player 1',
        player2Name: 'Player 2'
      };

      const response = await MatchAPI.createMatch(testConfig);
      setResult(`✅ Match created successfully!\n\nMatch ID: ${response.match.id}\nShare URL: ${response.match.shareUrl}\nAdmin Token: ${response.match.adminToken}`);
    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetMatch = async () => {
    setLoading(true);
    setResult('');

    try {
      // First create a match
      const testConfig: MatchConfig = {
        scoringSystem: 'ad',
        matchFormat: 'single',
        setDuration: 6,
        tieBreakRules: '7-point',
        player1Name: 'Player 1',
        player2Name: 'Player 2'
      };

      const createResponse = await MatchAPI.createMatch(testConfig);
      const matchId = createResponse.match.id;

      // Then try to get it
      const getResponse = await MatchAPI.getMatch(matchId);
      setResult(`✅ Match retrieved successfully!\n\nMatch ID: ${getResponse.match.id}\nPlayer 1: ${getResponse.match.config.player1Name}\nPlayer 2: ${getResponse.match.config.player2Name}`);
    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">API Test Page</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Netlify Functions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button 
                onClick={testCreateMatch} 
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Creating...' : 'Test Create Match'}
              </Button>
              
              <Button 
                onClick={testGetMatch} 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Testing...' : 'Test Get Match'}
              </Button>
            </div>

            {result && (
              <div className="mt-4 p-4 bg-gray-100 ">
                <h3 className="font-semibold mb-2">Result:</h3>
                <pre className="whitespace-pre-wrap text-sm">{result}</pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestAPI; 