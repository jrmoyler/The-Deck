import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, ExerciseType } from '../types';
import { createDeck } from '../services/deckService';
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
    utterance.pitch = 0.9; // Lower pitch for 'tactical' feel
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
    // Small delay for animation then start
    setTimeout(() => {
        setGameState('EXERCISING');
        speak(`${card.value} ${card.exercise}`);
    }, 1000);
  };

  const handleRepComplete = () => {
    const card = deck[currentCardIndex];
    if (currentReps < card.value) {
        // Haptic feedback if available
        if (navigator.vibrate) navigator.vibrate(50);
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
    
    // Auto advance after short delay or manual tap
    // For flow, we'll wait for user tap in Rest mode, but can auto-advance
  };

  const finishWorkout = () => {
    setGameState('FINISHED');
    // Calculate stats
    const stats = {
        totalReps: completedCards.reduce((acc, c) => acc + c.value, 0),
        duration: elapsedTime,
        repsByExercise: completedCards.reduce((acc, c) => {
            acc[c.exercise] = (acc[c.exercise] || 0) + c.value;
            return acc;
        }, {} as Record<ExerciseType, number>),
        cardsCompleted: completedCards.length,
        averageFormScore: 92 // Mocked
    };
    
    // Pass stats to dashboard via navigation state or context (simple prop passing here via local storage or nav state)
    // Using Nav state for simplicity
    navigate('/dashboard', { state: { lastWorkout: stats } });
  };

  const currentCard = deck[currentCardIndex];

  return (
    <div className="min-h-screen bg-deck-dark flex flex-col p-4 relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        {/* Header Status */}
        <div className="relative z-10 flex justify-between items-center mb-4">
            <div className="flex flex-col">
                <span className="text-zinc-500 text-xs font-mono uppercase">Time Elapsed</span>
                <span className="text-white font-mono text-xl">
                    {Math.floor(elapsedTime / 60).toString().padStart(2, '0')}:{(elapsedTime % 60).toString().padStart(2, '0')}
                </span>
            </div>
            <div className="flex flex-col items-end">
                <span className="text-zinc-500 text-xs font-mono uppercase">Progress</span>
                <span className="text-white font-mono text-xl">{currentCardIndex + 1} / {deck.length || 52}</span>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 relative flex flex-col items-center justify-center z-10 perspective-1000">
            
            {gameState === 'PREP' && (
                <div className="text-center animate-pulse">
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">READY OPERATOR?</h1>
                    <p className="text-zinc-400 mb-8">52 Cards. No Mercy.</p>
                    <button 
                        onClick={startGame}
                        className="bg-white text-black font-black text-xl px-12 py-4 rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    >
                        START MISSION
                    </button>
                </div>
            )}

            {gameState !== 'PREP' && gameState !== 'FINISHED' && currentCard && (
                <>
                    {/* The Card */}
                    <div className={`transition-all duration-700 absolute top-0 ${gameState === 'EXERCISING' ? 'scale-75 opacity-0' : 'scale-100 opacity-100 z-20'}`}>
                        <CardDisplay card={currentCard} isFlipped={gameState === 'DRAWING' || gameState === 'EXERCISING' || gameState === 'REST'} />
                    </div>

                    {/* Camera Mode */}
                    <div className={`w-full max-w-md aspect-[3/4] transition-all duration-500 ${gameState === 'EXERCISING' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none absolute'}`}>
                        <CameraOverlay 
                            isActive={gameState === 'EXERCISING'}
                            currentExercise={currentCard.exercise}
                            targetReps={currentCard.value}
                            currentReps={currentReps}
                            onRepComplete={handleRepComplete}
                        />
                    </div>

                    {/* Rest Interstitial */}
                    {gameState === 'REST' && (
                         <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                            <h2 className="text-5xl font-black text-green-500 mb-2 italic">COMPLETE</h2>
                            <p className="text-zinc-300 mb-8">Take a breath. Recover.</p>
                            <button 
                                onClick={drawNextCard}
                                className="w-full bg-zinc-800 border border-zinc-600 text-white font-bold py-4 rounded-xl active:bg-zinc-700 transition-colors"
                            >
                                NEXT CARD
                            </button>
                         </div>
                    )}
                </>
            )}
        </div>

        {/* Current Info Footer (When Card Hidden) */}
        {gameState === 'EXERCISING' && (
            <div className="z-10 mt-4 text-center">
                <p className="text-zinc-500 text-xs mb-1">CURRENT TARGET</p>
                <div className={`text-2xl font-bold ${SUIT_CONFIG[deck[currentCardIndex].suit].color}`}>
                    {deck[currentCardIndex].value} {deck[currentCardIndex].exercise}
                </div>
            </div>
        )}
    </div>
  );
};

export default WorkoutSession;
