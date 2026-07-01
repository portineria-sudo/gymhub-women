import React, { useState, useEffect, useRef } from 'react';
import { Bluetooth, Battery, Heart, Activity, CheckCircle } from 'lucide-react';
import type { BandData } from '../types';

interface BandPairingProps {
  onConnect: (band: BandData) => void;
  onSkip: () => void;
}

type PairingState = 'scanning' | 'found' | 'connecting' | 'connected';

export const BandPairing: React.FC<BandPairingProps> = ({ onConnect, onSkip }) => {
  const [state, setState] = useState<PairingState>('scanning');
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const onConnectRef = useRef(onConnect);
  onConnectRef.current = onConnect;

  useEffect(() => {
    // Simulate scan → find
    const t1 = setTimeout(() => setState('found'), 2200);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (state === 'found') {
      const t = setTimeout(() => setState('connecting'), 900);
      return () => clearTimeout(t);
    }
  }, [state]);

  useEffect(() => {
    if (state === 'connecting') {
      let prog = 0;
      const iv = setInterval(() => {
        prog += 4;
        setProgress(prog);
        if (prog >= 100) {
          clearInterval(iv);
          setState('connected');
        }
      }, 60);
      return () => clearInterval(iv);
    }
  }, [state]);

  useEffect(() => {
    if (state === 'connected') {
      const iv = setInterval(() => {
        setCountdown((c) => Math.max(0, c - 1));
      }, 1000);
      return () => clearInterval(iv);
    }
  }, [state]);

  useEffect(() => {
    if (state === 'connected' && countdown === 0) {
      onConnectRef.current({ connected: true, battery: 87, heartRate: 68, repsThisSet: 0, motionActive: false });
    }
  }, [state, countdown]);

  return (
    <div className="relative min-h-screen bg-dark flex flex-col items-center justify-center px-6 overflow-hidden">
      <div className="orb orb-2" style={{ opacity: 0.5 }} />

      {/* Header */}
      <div className="text-center mb-12 slide-up">
        <div className="neon-badge mb-4">Smart Band Integration</div>
        <h2 className="text-3xl font-bold text-main mb-2">Connect Your <span className="gradient-text-2">GymHub Band</span></h2>
        <p className="text-muted text-sm max-w-xs leading-relaxed">
          Your band tracks real-time reps, heart rate, and alerts you when you stop moving.
        </p>
      </div>

      {/* Scanning area */}
      <div className="relative flex items-center justify-center mb-12" style={{ width: 240, height: 240 }}>
        {/* Scan rings */}
        {(state === 'scanning') && (
          <>
            <div className="scan-ring scan-ring-1" />
            <div className="scan-ring scan-ring-2" />
            <div className="scan-ring scan-ring-3" />
          </>
        )}

        {/* Center icon */}
        <div className={`relative z-10 glass-card-pink flex items-center justify-center transition-all duration-500`}
          style={{ width: 80, height: 80, borderRadius: '50%' }}>
          {state === 'connected'
            ? <CheckCircle size={36} style={{ color: '#22c55e' }} />
            : <Bluetooth size={36} className="text-pink" />
          }
        </div>
      </div>

      {/* State-specific content */}
      <div className="glass-card p-6 w-full max-w-sm text-center slide-up">
        {state === 'scanning' && (
          <>
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="loading loading-dots loading-sm" style={{ color: 'var(--pink)' }} />
              <span className="text-main font-semibold">Scanning for devices...</span>
            </div>
            <p className="text-muted text-sm">Make sure your GymHub Band is nearby and charged</p>
          </>
        )}

        {state === 'found' && (
          <div className="fade-in">
            <div className="text-pink text-sm font-bold mb-1 uppercase tracking-widest">Device Found!</div>
            <div className="text-main font-bold text-lg mb-1">GymHub Band Pro</div>
            <div className="text-muted text-xs">00:1A:7D:DA:71:13 · Signal ●●●● Strong</div>
          </div>
        )}

        {state === 'connecting' && (
          <div className="fade-in">
            <div className="text-main font-semibold mb-3">Pairing...</div>
            <div className="w-full rounded-full overflow-hidden" style={{ height: 6, background: 'var(--border-subtle)' }}>
              <div className="h-full rounded-full transition-all duration-150"
                style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #ff1a72, #9b00ff)' }} />
            </div>
            <div className="text-muted text-xs mt-2">{progress}%</div>
          </div>
        )}

        {state === 'connected' && (
          <div className="fade-in">
            <div className="text-sm font-bold mb-3 uppercase tracking-widest" style={{ color: '#22c55e' }}>
              ✓ GymHub Band Pro Connected
            </div>
            {/* Band stats */}
            <div className="flex justify-around mb-4">
              <div className="text-center">
                <Battery size={18} style={{ color: '#22c55e' }} className="mx-auto mb-1" />
                <div className="text-main font-bold">87%</div>
                <div className="text-muted text-xs">Battery</div>
              </div>
              <div className="text-center">
                <Heart size={18} className="text-pink mx-auto mb-1 hr-pulse" />
                <div className="text-main font-bold">68</div>
                <div className="text-muted text-xs">BPM</div>
              </div>
              <div className="text-center">
                <Activity size={18} style={{ color: '#9b00ff' }} className="mx-auto mb-1" />
                <div className="text-main font-bold">Active</div>
                <div className="text-muted text-xs">Motion</div>
              </div>
            </div>
            <div className="text-muted text-xs">
              Starting workout in <span className="text-pink font-bold">{countdown}s</span>...
            </div>
          </div>
        )}
      </div>

      {/* Skip button */}
      {state !== 'connected' && (
        <button className="btn-ghost-pink mt-8" onClick={onSkip}>
          Skip — Continue without band
        </button>
      )}

      <div className="glow-line w-full absolute bottom-0 left-0" />
    </div>
  );
};
