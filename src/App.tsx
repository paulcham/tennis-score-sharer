import React, { useState } from 'react';
import TestScoring from './pages/TestScoring';
import TestAPI from './pages/TestAPI';
import Navigation from './components/Navigation';

function App() {
  const [currentPage, setCurrentPage] = useState<'scoring' | 'api-test'>('scoring');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      
      {currentPage === 'scoring' && <TestScoring />}
      {currentPage === 'api-test' && <TestAPI />}
    </div>
  );
}

export default App;
