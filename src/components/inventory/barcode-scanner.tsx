'use client';

import { useState, useRef, useCallback } from 'react';
import { Camera, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
}

export function BarcodeScanner({ onScan }: BarcodeScannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setIsOpen(true);
    } catch {
      toast.error('Camera access denied. Please enter barcode manually.');
      setIsOpen(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsOpen(false);
  }, []);

  const handleManualSearch = () => {
    if (manualBarcode.trim()) {
      onScan(manualBarcode.trim());
      setManualBarcode('');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        icon={<Search className="h-4 w-4" />}
        placeholder="Enter barcode manually..."
        value={manualBarcode}
        onChange={(e) => setManualBarcode(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
        className="w-64"
      />
      <Button variant="outline" onClick={handleManualSearch} size="icon">
        <Search className="h-4 w-4" />
      </Button>
      <Button
        variant={isOpen ? 'destructive' : 'outline'}
        onClick={isOpen ? stopCamera : startCamera}
        size="icon"
      >
        {isOpen ? <X className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="relative w-full max-w-md mx-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-xl"
            />
            <div className="absolute inset-0 border-2 border-primary/50 rounded-xl">
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-1 bg-primary/30" />
            </div>
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className="text-white text-sm mb-2">Point camera at barcode</p>
              <Button variant="secondary" onClick={stopCamera}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
