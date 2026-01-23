import React, { useEffect, useRef, useState } from 'react';

interface CameraOverlayProps {
  isActive: boolean;
  currentExercise: string;
  targetReps: number;
  currentReps: number;
  onRepComplete: () => void;
}

const CameraOverlay: React.FC<CameraOverlayProps> = ({ isActive, currentExercise, targetReps, currentReps, onRepComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [trackingStatus, setTrackingStatus] = useState<'SEARCHING' | 'LOCKED' | 'ACTIVE'>('SEARCHING');

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setPermissionGranted(true);
          
          // Simulate acquiring target
          setTimeout(() => setTrackingStatus('LOCKED'), 1500);
          setTimeout(() => setTrackingStatus('ACTIVE'), 2500);
        }
      } catch (err) {
        console.error("Camera access denied or error", err);
        setPermissionGranted(false);
      }
    };

    if (isActive) {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive]);

  // Simulate Rep Counting Interaction (since we can't do real ML here comfortably)
  const handleSimulatedRep = () => {
    if (currentReps < targetReps) {
      onRepComplete();
    }
  };

  if (!isActive) return null;

  return (
    <div className="relative w-full h-full overflow-hidden bg-black rounded-3xl border border-zinc-800 shadow-2xl">
      {/* Video Feed */}
      {permissionGranted ? (
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
           <p className="text-zinc-500">Camera Unavailable</p>
        </div>
      )}

      {/* HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
        
        {/* Header HUD */}
        <div className="flex justify-between items-start">
            <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded border border-green-500/30">
                <p className="text-xs text-green-400 font-mono animate-pulse">
                    AI VISION: {trackingStatus}
                </p>
            </div>
            <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded border border-zinc-700">
                <p className="text-xs text-zinc-300 font-mono">FPS: 30</p>
            </div>
        </div>

        {/* Center Skeleton Simulation */}
        {trackingStatus === 'ACTIVE' && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-64 border-2 border-dashed border-green-500/20 rounded-lg flex items-center justify-center">
                <div className="w-1 h-1 bg-green-500 rounded-full animate-ping"></div>
            </div>
        )}

        {/* Interaction Zone (Clickable) */}
        <div 
            className="absolute inset-0 pointer-events-auto z-10" 
            onClick={handleSimulatedRep}
        ></div>

        {/* Footer HUD */}
        <div className="pointer-events-none mt-auto">
            <div className="bg-black/70 backdrop-blur-lg rounded-2xl p-4 border border-zinc-700">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-zinc-400 text-xs uppercase tracking-wider mb-1">Current Exercise</p>
                        <h3 className="text-2xl font-black text-white uppercase">{currentExercise}</h3>
                    </div>
                    <div className="text-right">
                        <div className="text-5xl font-black text-white font-mono leading-none">
                            {currentReps}<span className="text-zinc-500 text-2xl">/{targetReps}</span>
                        </div>
                        <p className="text-green-400 text-xs font-mono mt-1">FORM: GOOD (92%)</p>
                    </div>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-2 bg-zinc-800 rounded-full mt-3 overflow-hidden">
                    <div 
                        className="h-full bg-green-500 transition-all duration-300" 
                        style={{ width: `${(currentReps / targetReps) * 100}%` }}
                    ></div>
                </div>
            </div>
            <p className="text-center text-zinc-500 text-xs mt-2 uppercase">Tap screen to log rep (Simulated Mode)</p>
        </div>
      </div>
    </div>
  );
};

export default CameraOverlay;
