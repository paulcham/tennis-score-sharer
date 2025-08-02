import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Tennis Score Sharer
          </h1>
          <p className="text-xl text-muted-foreground">
            Track and share tennis matches in real-time
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Create New Match</CardTitle>
              <CardDescription>
                Start tracking a new tennis match
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                New Match
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Matches</CardTitle>
              <CardDescription>
                Continue scoring ongoing matches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Matches
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Match History</CardTitle>
              <CardDescription>
                View completed matches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View History
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 text-sm">
            <div className="p-4 bg-card rounded-lg border">
              <h3 className="font-semibold mb-2">Real-time Scoring</h3>
              <p className="text-muted-foreground">Track points, games, and sets in real-time</p>
            </div>
            <div className="p-4 bg-card rounded-lg border">
              <h3 className="font-semibold mb-2">Live Sharing</h3>
              <p className="text-muted-foreground">Share match URLs for live updates</p>
            </div>
            <div className="p-4 bg-card rounded-lg border">
              <h3 className="font-semibold mb-2">Flexible Rules</h3>
              <p className="text-muted-foreground">Support for ad/no-ad scoring and tie breaks</p>
            </div>
            <div className="p-4 bg-card rounded-lg border">
              <h3 className="font-semibold mb-2">Mobile Friendly</h3>
              <p className="text-muted-foreground">Perfect for courtside scoring</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 