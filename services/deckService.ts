import { Card, Suit, ExerciseType } from '../types';
import { SUIT_CONFIG } from '../constants';

const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  let idCounter = 0;

  const suits = [Suit.HEARTS, Suit.DIAMONDS, Suit.SPADES, Suit.CLUBS];

  suits.forEach((suit) => {
    RANKS.forEach((rank) => {
      let value = parseInt(rank);
      if (isNaN(value)) {
        if (rank === 'J') value = 11;
        if (rank === 'Q') value = 12;
        if (rank === 'K') value = 13;
        if (rank === 'A') value = 15; // Hardcore Ace
      }

      deck.push({
        id: `card-${idCounter++}`,
        suit,
        rank,
        value,
        exercise: SUIT_CONFIG[suit].exercise,
        color: SUIT_CONFIG[suit].color,
      });
    });
  });

  return shuffleDeck(deck);
};

// Fisher-Yates Shuffle
const shuffleDeck = (deck: Card[]): Card[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};
