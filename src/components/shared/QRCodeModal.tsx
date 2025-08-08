import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { TENNIS_COLORS } from '../../lib/colors';

interface QRCodeModalProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ url, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Scan QR Code</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        
        <div className="flex justify-center mb-4">
          <div className="bg-white p-4 rounded-lg border">
            <QRCodeSVG
              value={url}
              size={200}
              level="M"
              includeMargin={true}
            />
          </div>
        </div>
        
        <p className="text-sm text-gray-600 text-center mb-4">
          Scan this QR code with your phone's camera to open the match
        </p>
        
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white rounded"
            style={{ backgroundColor: TENNIS_COLORS.INFO_BLUE }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;
