import React from 'react';

interface NavigationProps {
  currentPage: 'scoring' | 'api-test';
  onPageChange: (page: 'scoring' | 'api-test') => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex gap-6">
          <button
            onClick={() => onPageChange('scoring')}
            className={`font-medium ${
              currentPage === 'scoring' 
                ? 'text-blue-800 border-b-2 border-blue-800' 
                : 'text-blue-600 hover:text-blue-800'
            }`}
          >
            Scoring Test
          </button>
          <button
            onClick={() => onPageChange('api-test')}
            className={`font-medium ${
              currentPage === 'api-test' 
                ? 'text-blue-800 border-b-2 border-blue-800' 
                : 'text-blue-600 hover:text-blue-800'
            }`}
          >
            API Test
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 