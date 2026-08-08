'use client';

import { useEffect, useRef, useState } from 'react';

interface BarcodeScannerProps {
  onDetected: (barcode: string) => void;
  onClose: () => void;
}

export function BarcodeScanner({ onDetected, onClose }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(true);
  const rafRef = useRef<number>(0);
  const detectorRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        const DetectorCtor = (window as any).BarcodeDetector;
        if (DetectorCtor) {
          try {
            detectorRef.current = new DetectorCtor({
              formats: [
                'ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128',
                'code_39', 'code_93', 'itf', 'codabar',
              ],
            });
          } catch {
            detectorRef.current = new DetectorCtor();
          }
          runDetectorLoop();
        } else {
          setError('Camera barcode scanning not supported in this browser. Use the manual input field.');
        }
      } catch {
        if (!cancelled) setError('Camera access denied or unavailable. Use the manual barcode input instead.');
      }
    }

    async function runDetectorLoop() {
      const tick = async () => {
        if (!scanning || cancelled) return;
        try {
          const video = videoRef.current;
          if (video && video.readyState === 4 && detectorRef.current) {
            const codes = await detectorRef.current.detect(video);
            if (codes && codes.length > 0) {
              const raw = codes[0].rawValue;
              if (raw) {
                setScanning(false);
                onDetected(raw);
                return;
              }
            }
          }
        } catch {
          // frame skipped
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }

    start();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [onDetected, scanning]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <p className="font-headline-md text-lg text-white font-bold">Scan Barcode</p>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined text-white">close</span>
          </button>
        </div>

        <div className="relative rounded-2xl overflow-hidden aspect-square bg-black">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted
            playsInline
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-3/4 h-2 border-l-2 border-r-2 border-gold text-[0] rounded-full shadow-[0_0_20px_rgba(212,175,55,0.6)]" />
          </div>
          {scanning && !error && (
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className="text-white/80 text-xs font-label-sm tracking-widest uppercase animate-pulse">
                Point camera at barcode...
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 glass-panel rounded-xl p-4">
            <p className="text-xs text-error text-center">{error}</p>
          </div>
        )}

        <button
          onClick={onClose}
          className="gold-gradient-btn w-full mt-4 py-3 rounded-full text-on-primary font-label-sm text-[11px] uppercase tracking-[0.15em]"
        >
          Done
        </button>
      </div>
    </div>
  );
}
