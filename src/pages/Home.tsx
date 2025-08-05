import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { TENNIS_COLORS } from '../lib/colors';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleStartNewMatch = () => {
    navigate('/new-match');
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            MatchSync
          </h1>
          <p className="text-xl text-gray-300">
            Share your tennis matches in real-time
          </p>
        </div>

        {/* Main Action Card */}
        <Card className="mb-8 bg-gray-900 border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Start a New Match</CardTitle>
            <CardDescription className="text-gray-300">
              Create a new tennis match and share the live score with others
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={handleStartNewMatch}
              size="lg"
              className="text-white text-lg px-8 py-4"
              style={{
                backgroundColor: TENNIS_COLORS.GREEN,
                borderColor: TENNIS_COLORS.GREEN
              }}
            >
              Start New Match
            </Button>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <span className="text-2xl">🎾</span>
                Real-time Scoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Record points, games, and sets with our intuitive tennis scoring interface.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <span className="text-2xl">📱</span>
                Live Sharing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Share a unique URL with friends and family to follow the match live.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <span className="text-2xl">📊</span>
                Match History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                View detailed game-by-game breakdown and match statistics.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <span className="text-2xl">⚙️</span>
                Flexible Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Support for ad/no-ad scoring, different match formats, and tie break rules.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <span className="text-2xl">📱</span>
                Mobile Friendly
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Works perfectly on phones and tablets for easy scoring on the court.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <span className="text-2xl">🔒</span>
                No Registration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Start scoring immediately - no accounts or downloads required.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="mt-12">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2" style={{ backgroundColor: TENNIS_COLORS.BLUE }}>
                  1
                </div>
                  <h3 className="font-semibold mb-2 text-white">Create Match</h3>
                  <p className="text-sm text-gray-300">
                    Set up your match with player names and scoring rules
                  </p>
                </div>
                <div className="text-center">
                                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2" style={{ backgroundColor: TENNIS_COLORS.BLUE }}>
                  2
                </div>
                  <h3 className="font-semibold mb-2 text-white">Share URL</h3>
                  <p className="text-sm text-gray-300">
                    Get a unique link to share with friends and family
                  </p>
                </div>
                <div className="text-center">
                                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2" style={{ backgroundColor: TENNIS_COLORS.BLUE }}>
                  3
                </div>
                  <h3 className="font-semibold mb-2 text-white">Score & Share</h3>
                  <p className="text-sm text-gray-300">
                    Record points in real-time while others watch live
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home; 