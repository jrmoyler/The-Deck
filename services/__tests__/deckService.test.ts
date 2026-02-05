import { describe, it, expect } from 'vitest';
import { createDeck } from '../deckService';
import { Suit, ExerciseType } from '../../types';

describe('deckService', () => {
  describe('createDeck', () => {
    it('should create a deck of 52 cards', () => {
      const deck = createDeck();
      expect(deck).toHaveLength(52);
    });

    it('should contain unique cards', () => {
      const deck = createDeck();
      const uniqueIds = new Set(deck.map((card) => card.id));
      expect(uniqueIds.size).toBe(52);
    });

    it('should have correct exercises for suits', () => {
      const deck = createDeck();
      const hearts = deck.find((c) => c.suit === Suit.HEARTS);
      const diamonds = deck.find((c) => c.suit === Suit.DIAMONDS);
      const spades = deck.find((c) => c.suit === Suit.SPADES);
      const clubs = deck.find((c) => c.suit === Suit.CLUBS);

      expect(hearts?.exercise).toBe(ExerciseType.PUSHUPS);
      expect(diamonds?.exercise).toBe(ExerciseType.DIPS);
      expect(spades?.exercise).toBe(ExerciseType.CRUNCHES);
      expect(clubs?.exercise).toBe(ExerciseType.BURPEES);
    });

    it('should assign correct values', () => {
      const deck = createDeck();
      const ace = deck.find(c => c.rank === 'A');
      const king = deck.find(c => c.rank === 'K');
      const queen = deck.find(c => c.rank === 'Q');
      const jack = deck.find(c => c.rank === 'J');
      const ten = deck.find(c => c.rank === '10');
      const two = deck.find(c => c.rank === '2');

      expect(ace?.value).toBe(15);
      expect(king?.value).toBe(13);
      expect(queen?.value).toBe(12);
      expect(jack?.value).toBe(11);
      expect(ten?.value).toBe(10);
      expect(two?.value).toBe(2);
    });

    it('should be shuffled', () => {
        // This test is probabilistic, but the chance of it failing for a sorted deck is 100%,
        // and failing for a shuffled deck is extremely low (1/52!).
        // We just check that it's not strictly sorted by ID, as the creation order is sorted.
        const deck = createDeck();
        let isSorted = true;
        for (let i = 0; i < deck.length - 1; i++) {
            const currentId = parseInt(deck[i].id.split('-')[1]);
            const nextId = parseInt(deck[i+1].id.split('-')[1]);
            if (currentId > nextId) {
                isSorted = false;
                break;
            }
        }
        expect(isSorted).toBe(false);
    });
  });
});
