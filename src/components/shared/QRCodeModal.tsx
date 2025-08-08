import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const CloseIcon = ({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface QRCodeModalProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ url, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <CloseIcon size={32} color="#9CA3AF" />
        </button>
        
        <div className="flex items-center justify-center h-full">
          <div className="bg-white p-6 rounded-lg">
            <QRCodeSVG
              value={url}
              size={300}
              level="M"
              includeMargin={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;
