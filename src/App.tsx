import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NewMatch from './pages/NewMatch';
import ScoreMatch from './pages/ScoreMatch';
import ViewMatch from './pages/ViewMatch';
import TestScoring from './pages/TestScoring';
import TestAPI from './pages/TestAPI';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new-match" element={<NewMatch />} />
          <Route path="/score-match" element={<ScoreMatch />} />
        <Route path="/score-match/:matchId" element={<ScoreMatch />} />
          <Route path="/view/:matchId" element={<ViewMatch />} />
          <Route path="/test-scoring" element={<TestScoring />} />
          <Route path="/test-api" element={<TestAPI />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
