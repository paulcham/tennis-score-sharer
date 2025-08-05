import React from 'react';
import { TENNIS_COLORS } from '../lib/colors';

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
                ? 'border-b-2' 
                : 'hover:opacity-80'
            }`}
            style={{ 
              color: currentPage === 'scoring' ? TENNIS_COLORS.INFO_BLUE : TENNIS_COLORS.INFO_BLUE,
              borderColor: currentPage === 'scoring' ? TENNIS_COLORS.INFO_BLUE : 'transparent'
            }}
          >
            Scoring Test
          </button>
          <button
            onClick={() => onPageChange('api-test')}
            className={`font-medium ${
              currentPage === 'api-test' 
                ? 'border-b-2' 
                : 'hover:opacity-80'
            }`}
            style={{ 
              color: currentPage === 'api-test' ? TENNIS_COLORS.INFO_BLUE : TENNIS_COLORS.INFO_BLUE,
              borderColor: currentPage === 'api-test' ? TENNIS_COLORS.INFO_BLUE : 'transparent'
            }}
          >
            API Test
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 