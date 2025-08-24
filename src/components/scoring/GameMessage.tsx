import React from 'react';
import { TENNIS_COLORS } from '../../lib/colors';

interface GameMessageProps {
  message: string;
  type?: 'break-point' | 'set-point' | 'match-point' | 'info' | 'warning';
  isVisible: boolean;
}

const GameMessage: React.FC<GameMessageProps> = ({ message, type = 'info', isVisible }) => {
  if (!isVisible) {
    return null;
  }

  const getMessageStyle = () => {
    // Always use orange color for consistency
    return {
      backgroundColor: TENNIS_COLORS.ORANGE,
      color: TENNIS_COLORS.WHITE,
      borderColor: TENNIS_COLORS.ORANGE
    };
  };

  const style = getMessageStyle();

  return (
    <div 
      className="px-4 py-2 text-center font-bold text-sm uppercase tracking-wide"
      style={style}
    >
      {message}
    </div>
  );
};

export default GameMessage;
