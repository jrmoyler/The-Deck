import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, ExerciseType, WorkoutStats } from '../types';
import { createDeck } from '../services/deckService';
import { saveWorkout } from '../services/storageService';
import CardDisplay from '../components/CardDisplay';
import CameraOverlay from '../components/CameraOverlay';
import { SUIT_CONFIG } from '../constants';

const WorkoutSession: React.FC = () => {
  const navigate = useNavigate();
  const [deck, setDeck] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(-1);
  const [gameState, setGameState] = useState<'PREP' | 'DRAWING' | 'EXERCISING' | 'REST' | 'FINISHED'>('PREP');
  const [currentReps, setCurrentReps] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [completedCards, setCompletedCards] = useState<Card[]>([]);
  
  // Audio for announcements
  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    utterance.pitch = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // Init Deck
  useEffect(() => {
    const newDeck = createDeck();
    setDeck(newDeck);
  }, []);

  // Timer
  useEffect(() => {
    let interval: any;
    if (gameState !== 'FINISHED' && gameState !== 'PREP') {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  const startGame = () => {
    setGameState('DRAWING');
    drawNextCard();
  };

  const drawNextCard = () => {
    const nextIndex = currentCardIndex + 1;
    if (nextIndex >= deck.length) {
      finishWorkout();
      return;
    }

    setGameState('DRAWING');
    setCurrentCardIndex(nextIndex);
    setCurrentReps(0);

    const card = deck[nextIndex];
    setTimeout(() => {
        setGameState('EXERCISING');
        speak(`${card.value} ${card.exercise}`);
    }, 1000);
  };

  const handleRepComplete = () => {
    const card = deck[currentCardIndex];
    if (currentReps < card.value) {
        if (navigator.vibrate) navigator.vibrate(40);
        setCurrentReps(prev => prev + 1);
    } 
    
    if (currentReps + 1 >= card.value) {
        completeCard();
    }
  };

  const completeCard = () => {
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    setGameState('REST');
    setCompletedCards([...completedCards, deck[currentCardIndex]]);
  };

  const finishWorkout = () => {
    setGameState('FINISHED');
    const stats: WorkoutStats = {
        id: crypto.randomUUID(),
        date: Date.now(),
        totalReps: completedCards.reduce((acc, c) => acc + c.value, 0),
        duration: elapsedTime,
        repsByExercise: completedCards.reduce((acc, c) => {
            acc[c.exercise] = (acc[c.exercise] || 0) + c.value;
            return acc;
        }, {} as Record<ExerciseType, number>),
        cardsCompleted: completedCards.length,
        averageFormScore: 92
    };
    
    // Save to LocalStorage
    saveWorkout(stats);
    
    navigate('/dashboard', { state: { lastWorkout: stats } });
  };

  const currentCard = deck[currentCardIndex];

  return (
    <div className="min-h-screen bg-deck-dark flex flex-col p-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        <div className="relative z-10 flex justify-between items-center mb-4">
            <div className="flex flex-col">
                <span className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest">ELAPSED_TIME</span>
                <span className="text-white font-mono text-xl">
                    {Math.floor(elapsedTime / 60).toString().padStart(2, '0')}:{(elapsedTime % 60).toString().padStart(2, '0')}
                </span>
            </div>
            <div className="flex flex-col items-end">
                <span className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest">DECK_PROGRESS</span>
                <span className="text-white font-mono text-xl">{currentCardIndex + 1} / {deck.length || 52}</span>
            </div>
        </div>

        <div className="flex-1 relative flex flex-col items-center justify-center z-10 perspective-1000">
            {gameState === 'PREP' && (
                <div className="text-center animate-pulse">
                    <h1 className="text-5xl font-black text-white mb-2 tracking-tighter italic">ENGAGE MISSION</h1>
                    <p className="text-zinc-500 font-mono text-xs mb-10 tracking-[0.2em]">52 CARDS // TOTAL VOL: ~400 REPS</p>
                    <button 
                        onClick={startGame}
                        className="bg-white text-black font-black text-xl px-14 py-5 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] border-b-4 border-zinc-300"
                    >
                        START DECK
                    </button>
                </div>
            )}

            {gameState !== 'PREP' && gameState !== 'FINISHED' && currentCard && (
                <>
                    <div className={`transition-all duration-700 absolute top-0 ${gameState === 'EXERCISING' ? 'scale-75 opacity-0 translate-y-[-50px]' : 'scale-100 opacity-100 z-20'}`}>
                        <CardDisplay card={currentCard} isFlipped={gameState === 'DRAWING' || gameState === 'EXERCISING' || gameState === 'REST'} />
                    </div>

                    <div className={`w-full max-w-md aspect-[3/4] transition-all duration-700 ${gameState === 'EXERCISING' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10 pointer-events-none absolute'}`}>
                        <CameraOverlay 
                            isActive={gameState === 'EXERCISING'}
                            currentExercise={currentCard.exercise}
                            targetReps={currentCard.value}
                            currentReps={currentReps}
                            onRepComplete={handleRepComplete}
                        />
                    </div>

                    {gameState === 'REST' && (
                         <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border border-green-500/40">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-green-500">
                                    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h2 className="text-4xl font-black text-white mb-2 italic">SET CLEARED</h2>
                            <p className="text-zinc-500 font-mono text-sm mb-10 tracking-widest">RECOVERY IN PROGRESS...</p>
                            <button 
                                onClick={drawNextCard}
                                className="w-full max-w-xs bg-zinc-800 border border-zinc-600 text-white font-black py-5 rounded-2xl active:bg-zinc-700 shadow-xl transition-all"
                            >
                                DRAW NEXT CARD
                            </button>
                         </div>
                    )}
                </>
            )}
        </div>

        {gameState === 'EXERCISING' && (
            <div className="z-10 mt-6 text-center animate-fade-in">
                <p className="text-zinc-500 text-[10px] font-mono tracking-widest mb-1 uppercase">Next Target Acquired</p>
                <div className={`text-3xl font-black italic tracking-tighter ${SUIT_CONFIG[deck[currentCardIndex].suit].color}`}>
                    {deck[currentCardIndex].value} {deck[currentCardIndex].exercise}
                </div>
            </div>
        )}
    </div>
  );
};

export default WorkoutSession;
