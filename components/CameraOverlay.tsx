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
  const [trackingStatus, setTrackingStatus] = useState<'INITIALIZING' | 'LOCKED' | 'ACTIVE'>('INITIALIZING');
  const [repFlash, setRepFlash] = useState(false);
  const [points, setPoints] = useState<{ x: number, y: number, id: number }[]>([]);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        // Reduced constraints for faster initialization
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 480 }
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setPermissionGranted(true);
          
          // Trigger HUD lock almost immediately upon play
          videoRef.current.onplay = () => {
            setTrackingStatus('LOCKED');
            setTimeout(() => {
              setTrackingStatus('ACTIVE');
              // Generate tactical tracking points instantly
              setPoints([
                { id: 1, x: 30, y: 35 }, { id: 2, x: 70, y: 35 }, // Shoulders
                { id: 3, x: 50, y: 20 }, // Head
                { id: 4, x: 40, y: 55 }, { id: 5, x: 60, y: 55 }, // Hips
                { id: 6, x: 35, y: 80 }, { id: 7, x: 65, y: 80 }  // Knees
              ]);
            }, 300); // Drastically reduced from 2000ms
          };
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

  // Smoother tracking point "jitter" to simulate live CV movement
  useEffect(() => {
    if (trackingStatus !== 'ACTIVE') return;
    
    let frameId: number;
    const updatePoints = () => {
      setPoints(prev => prev.map(p => ({
        ...p,
        x: p.x + (Math.random() - 0.5) * 0.4,
        y: p.y + (Math.random() - 0.5) * 0.4
      })));
      frameId = requestAnimationFrame(updatePoints);
    };
    
    frameId = requestAnimationFrame(updatePoints);
    return () => cancelAnimationFrame(frameId);
  }, [trackingStatus]);

  const handleSimulatedRep = () => {
    if (currentReps < targetReps) {
      setRepFlash(true);
      setTimeout(() => setRepFlash(false), 200);
      onRepComplete();
    }
  };

  if (!isActive) return null;

  return (
    <div className="relative w-full h-full overflow-hidden bg-black rounded-3xl border border-zinc-800 shadow-2xl transition-all duration-300">
      {/* Video Feed */}
      {permissionGranted ? (
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="absolute inset-0 w-full h-full object-cover opacity-80 scale-x-[-1]"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900">
           <div className="w-12 h-12 border-2 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
           <p className="text-green-500 font-mono text-xs tracking-widest animate-pulse">BOOTING_CV_CORE...</p>
        </div>
      )}

      {/* Visual Flash on Rep */}
      <div className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-150 bg-green-400/30 ${repFlash ? 'opacity-100' : 'opacity-0'}`}></div>

      {/* Tracking Skeleton Overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
        {points.map((p) => (
            <circle 
                key={p.id} 
                cx={`${p.x}%`} 
                cy={`${p.y}%`} 
                r="3" 
                fill="#4ade80" 
                className="opacity-80 transition-all duration-75"
            />
        ))}
        {/* Connection Lines */}
        {trackingStatus === 'ACTIVE' && points.length >= 5 && (
            <g stroke="#4ade80" strokeWidth="1.5" strokeOpacity="0.4">
                <line x1={`${points[0].x}%`} y1={`${points[0].y}%`} x2={`${points[1].x}%`} y2={`${points[1].y}%`} />
                <line x1={`${points[0].x}%`} y1={`${points[0].y}%`} x2={`${points[3].x}%`} y2={`${points[3].y}%`} />
                <line x1={`${points[1].x}%`} y1={`${points[1].y}%`} x2={`${points[4].x}%`} y2={`${points[4].y}%`} />
                <line x1={`${points[2].x}%`} y1={`${points[2].y}%`} x2={`${(points[0].x + points[1].x) / 2}%`} y2={`${(points[0].y + points[1].y) / 2}%`} />
            </g>
        )}
      </svg>

      {/* HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between z-30">
        
        {/* Header HUD */}
        <div className="flex justify-between items-start">
            <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-green-500/40">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${trackingStatus === 'ACTIVE' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                    <p className="text-[10px] text-white font-mono uppercase tracking-tighter">
                        CV_LOCKED: {trackingStatus}
                    </p>
                </div>
            </div>
            <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-700">
                <p className="text-[10px] text-zinc-300 font-mono">LATENCY: 12ms</p>
            </div>
        </div>

        {/* Interaction Zone (Clickable) */}
        <div 
            className="absolute inset-0 pointer-events-auto cursor-crosshair active:scale-95 transition-transform" 
            onClick={handleSimulatedRep}
        ></div>

        {/* Horizontal Scanning Line */}
        <div className="absolute left-0 right-0 h-[1px] bg-green-500/30 shadow-[0_0_10px_#22c55e] animate-[scan_3s_linear_infinite]"></div>

        {/* Footer HUD */}
        <div className="pointer-events-none mt-auto space-y-3">
            <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-6 border border-zinc-700/50 shadow-2xl">
                <div className="flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                             <div className="w-1.5 h-3 bg-green-500"></div>
                             <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em]">Kinetic Analysis</p>
                        </div>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">{currentExercise}</h3>
                    </div>
                    <div className="text-right">
                        <div className="flex items-baseline justify-end gap-1">
                            <span className="text-6xl font-black text-white font-mono leading-none">{currentReps}</span>
                            <span className="text-zinc-500 text-2xl font-mono">/{targetReps}</span>
                        </div>
                    </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-2 bg-zinc-800/80 rounded-full mt-5 overflow-hidden border border-zinc-700/20">
                    <div 
                        className={`h-full transition-all duration-300 ${currentReps >= targetReps ? 'bg-green-400' : 'bg-green-500 shadow-[0_0_15px_#22c55e]'}`} 
                        style={{ width: `${(currentReps / targetReps) * 100}%` }}
                    ></div>
                </div>
            </div>
            <div className="text-center">
                <p className="text-green-400/50 text-[9px] font-mono uppercase tracking-[0.4em] animate-pulse">
                    Confirm Repetition Trigger: Tap Center
                </p>
            </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}} />
    </div>
  );
};

export default CameraOverlay;