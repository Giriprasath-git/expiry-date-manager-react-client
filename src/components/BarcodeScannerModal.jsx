import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, RefreshCw, AlertCircle, CheckCircle2, Volume2 } from 'lucide-react';

const BarcodeScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
  const [cameraError, setCameraError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' (back) or 'user' (front)
  const scannerRef = useRef(null);

  useEffect(() => {
    let html5QrCode = null;

    if (isOpen) {
      setCameraError('');
      setIsScanning(true);

      const elementId = 'barcode-scanner-viewfinder';

      // Small delay to ensure DOM element is rendered
      const timer = setTimeout(() => {
        const domElement = document.getElementById(elementId);
        if (!domElement) return;

        html5QrCode = new Html5Qrcode(elementId);
        scannerRef.current = html5QrCode;

        const config = {
          fps: 10,
          qrbox: { width: 260, height: 160 },
          aspectRatio: 1.0
        };

        html5QrCode
          .start(
            { facingMode: facingMode },
            config,
            (decodedText) => {
              // Successfully scanned barcode
              if (html5QrCode && html5QrCode.isScanning) {
                html5QrCode.stop().then(() => {
                  setIsScanning(false);
                  onScanSuccess(decodedText);
                  onClose();
                }).catch(() => {
                  onScanSuccess(decodedText);
                  onClose();
                });
              } else {
                onScanSuccess(decodedText);
                onClose();
              }
            },
            () => {
              // Ignore frame-by-frame decode failure logs
            }
          )
          .catch((err) => {
            console.error('Camera initialization error:', err);
            setIsScanning(false);
            setCameraError(
              'Unable to access device camera. Please grant camera permissions or enter the barcode manually.'
            );
          });
      }, 300);

      return () => {
        clearTimeout(timer);
        if (scannerRef.current && scannerRef.current.isScanning) {
          scannerRef.current.stop().catch((e) => console.log(e));
        }
      };
    }
  }, [isOpen, facingMode]);

  if (!isOpen) return null;

  const toggleCamera = () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop().then(() => {
        setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
      });
    } else {
      setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-gray-900 text-white rounded-3xl shadow-2xl border border-gray-800 max-w-md w-full overflow-hidden flex flex-col relative">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0984e3] text-white flex items-center justify-center shadow-lg shadow-[#0984e3]/30">
              <Camera className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Scan Barcode</h3>
              <p className="text-xs text-gray-400">Position barcode within the frame</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch(() => {});
              }
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Container */}
        <div className="p-6 flex flex-col items-center justify-center min-h-[300px]">
          {cameraError ? (
            <div className="p-5 bg-rose-950/60 border border-rose-800 rounded-2xl text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
              <p className="text-sm text-rose-200 font-medium">{cameraError}</p>
              <button
                onClick={() => setFacingMode((prev) => prev)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="w-full relative rounded-2xl overflow-hidden bg-black border border-gray-800">
              <div id="barcode-scanner-viewfinder" className="w-full h-[260px]"></div>

              {/* Scanning Laser Animation Overlay */}
              {isScanning && (
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
                  <div className="w-full border-t-2 border-l-2 border-[#0984e3] w-8 h-8 rounded-tl-lg"></div>
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse my-auto"></div>
                  <div className="w-full border-b-2 border-r-2 border-[#0984e3] w-8 h-8 rounded-br-lg ml-auto"></div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-900 border-t border-gray-800 flex items-center justify-between">
          <button
            onClick={toggleCamera}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-300 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Switch Camera</span>
          </button>

          <button
            onClick={() => {
              if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch(() => {});
              }
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScannerModal;
