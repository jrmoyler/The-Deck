import React from 'react';
import { Suit, ExerciseType } from './types';

export const SUIT_CONFIG: Record<Suit, { color: string; icon: React.ReactNode; exercise: ExerciseType }> = {
  [Suit.HEARTS]: {
    color: 'text-red-500',
    exercise: ExerciseType.PUSHUPS,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
      </svg>
    ),
  },
  [Suit.DIAMONDS]: {
    color: 'text-blue-500',
    exercise: ExerciseType.DIPS,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12 2.25a.75.75 0 01.53.22l8.25 8.25a.75.75 0 010 1.06l-8.25 8.25a.75.75 0 01-1.06 0l-8.25-8.25a.75.75 0 010-1.06l8.25-8.25A.75.75 0 0112 2.25z" />
      </svg>
    ),
  },
  [Suit.SPADES]: {
    color: 'text-purple-500',
    exercise: ExerciseType.CRUNCHES,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12 1.5a.75.75 0 01.75.75V7.5h-1.5V2.25A.75.75 0 0112 1.5zM11.25 7.5v5.69l-1.72-1.72a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72V7.5h3.75a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9a3 3 0 013-3h3.75z" />
         <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.396.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.396-.634-.936-.634zm4.314.634c.108-.215.396-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.396.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866z" clipRule="evenodd" />
          <path d="M12 1.5a.75.75 0 01.75.75V2.25h-1.5V2.25A.75.75 0 0112 1.5z" /> 
           <path d="M8.25 7.5a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM12 11.5a.75.75 0 00-.75.75v3a.75.75 0 001.5 0v-3a.75.75 0 00-.75-.75z" />
          <path fillRule="evenodd" d="M12 2.25c2.75 0 5.25 2.5 7.5 7.5 0 4-3 9.75-7.5 9.75S4.5 13.75 4.5 9.75C6.75 4.75 9.25 2.25 12 2.25zM12 12a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
      </svg>
    ),
  },
  [Suit.CLUBS]: {
    color: 'text-lime-400',
    exercise: ExerciseType.BURPEES,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
         <path fillRule="evenodd" d="M12 2.25a3.75 3.75 0 013.75 3.75 3.75 3.75 0 01-3.75 3.75 3.75 3.75 0 01-3.75-3.75A3.75 3.75 0 0112 2.25zM7.5 10.5a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zm9 0a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zM12 12.75a.75.75 0 00-.75.75v5.034l-2.025.506a.75.75 0 00.375 1.455l3.75-.937a.75.75 0 00.563-.728V13.5a.75.75 0 00-.75-.75z" clipRule="evenodd" />
      </svg>
    ),
  },
};
