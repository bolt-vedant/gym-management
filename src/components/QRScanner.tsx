import React, { useState } from 'react';
import { QrCode, Smartphone, Download } from 'lucide-react';

interface QRScannerProps {
  onScan: (memberId: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');

  const handleStartScan = () => {
    setIsScanning(true);
    // In a real implementation, this would start the camera
    // For demo purposes, we'll simulate a scan after 2 seconds
    setTimeout(() => {
      const mockMemberId = '1'; // Simulate scanning member ID 1
      onScan(mockMemberId);
      setIsScanning(false);
    }, 2000);
  };

  const handleManualEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.includes('GYM_MEMBER_')) {
      const memberId = manualCode.split('_')[2];
      onScan(memberId);
      setManualCode('');
    }
  };

  const generateSampleQR = () => {
    const qrData = `GYM_MEMBER_1_${Date.now()}`;
    const blob = new Blob([qrData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'member_qr_code.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">QR Code Scanner</h3>
      
      <div className="space-y-4">
        {/* Camera Scanner */}
        <div className="text-center">
          <div className={`w-64 h-64 mx-auto border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${
            isScanning ? 'bg-blue-50 border-blue-300' : 'bg-gray-50'
          }`}>
            {isScanning ? (
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Scanning...</p>
              </div>
            ) : (
              <div className="text-center">
                <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Position QR code here</p>
              </div>
            )}
          </div>
          
          <button
            onClick={handleStartScan}
            disabled={isScanning}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
          >
            <Smartphone className="w-4 h-4" />
            <span>{isScanning ? 'Scanning...' : 'Start Scanner'}</span>
          </button>
        </div>

        {/* Manual Entry */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Manual QR Code Entry</h4>
          <form onSubmit={handleManualEntry} className="flex space-x-2">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Enter QR code data..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Generate Sample QR */}
        <div className="border-t pt-4">
          <button
            onClick={generateSampleQR}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Sample QR Code</span>
          </button>
          <p className="text-xs text-gray-500 mt-1 text-center">
            For testing purposes - downloads a text file with QR data
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
