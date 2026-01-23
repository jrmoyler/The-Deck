import React from 'react';
import { Card } from '../types';
import { SUIT_CONFIG } from '../constants';

interface CardDisplayProps {
  card: Card;
  isFlipped?: boolean;
  className?: string;
  onClick?: () => void;
}

const CardDisplay: React.FC<CardDisplayProps> = ({ card, isFlipped = false, className = '', onClick }) => {
  const config = SUIT_CONFIG[card.suit];

  return (
    <div 
      className={`relative w-64 h-96 cursor-pointer perspective-1000 group ${className}`} 
      onClick={onClick}
    >
      <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* Card Back */}
        <div className="absolute w-full h-full bg-zinc-900 border-2 border-zinc-700 rounded-xl shadow-2xl backface-hidden flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
          <div className="text-zinc-600 font-bold text-2xl tracking-widest uppercase">The Deck</div>
          <div className="absolute w-56 h-88 border border-zinc-700 rounded-lg opacity-50"></div>
        </div>

        {/* Card Front */}
        <div className={`absolute w-full h-full bg-zinc-900 border-2 ${config.color.replace('text-', 'border-')} rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] backface-hidden rotate-y-180 flex flex-col items-center justify-between p-4 overflow-hidden`}>
           {/* Background Pattern */}
           <div className="absolute inset-0 opacity-5 pointer-events-none">
             <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
           </div>

           {/* Top Corner */}
           <div className={`self-start text-4xl font-mono font-bold ${config.color}`}>
              {card.rank}
              <div className="w-6 h-6 mt-1">{config.icon}</div>
           </div>

           {/* Center Content */}
           <div className="flex flex-col items-center z-10">
              <div className={`w-24 h-24 mb-4 ${config.color} drop-shadow-lg`}>
                {config.icon}
              </div>
              <h2 className="text-3xl font-black uppercase text-white tracking-tighter">{card.exercise}</h2>
              <div className={`text-6xl font-black ${config.color} mt-2`}>{card.value}</div>
              <span className="text-zinc-500 text-xs font-mono mt-1 tracking-widest">REPS</span>
           </div>

           {/* Bottom Corner */}
           <div className={`self-end text-4xl font-mono font-bold ${config.color} rotate-180`}>
              {card.rank}
              <div className="w-6 h-6 mt-1">{config.icon}</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CardDisplay;
