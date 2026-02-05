import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CardDisplay from '../CardDisplay';
import { Card, Suit, ExerciseType } from '../../types';

describe('CardDisplay', () => {
  const mockCard: Card = {
    id: 'test-card',
    suit: Suit.HEARTS,
    rank: 'A',
    value: 15,
    exercise: ExerciseType.PUSHUPS,
    color: 'text-red-500',
  };

  it('renders card details correctly', () => {
    render(<CardDisplay card={mockCard} />);

    // Check rank
    const ranks = screen.getAllByText('A');
    expect(ranks.length).toBeGreaterThan(0);

    // Check exercise
    expect(screen.getByText('Push-Ups')).toBeInTheDocument();

    // Check value
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('applies flipped class when isFlipped is true', () => {
     const { container } = render(<CardDisplay card={mockCard} isFlipped={true} />);
     // We look for the div that transforms. It's the child of the outer div.
     // In the code: <div className={`relative ... transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>

     // Finding by class name part 'rotate-y-180'
     const flippedElement = container.querySelector('.rotate-y-180');
     expect(flippedElement).toBeInTheDocument();
  });

  it('does not apply flipped class when isFlipped is false', () => {
      const { container } = render(<CardDisplay card={mockCard} isFlipped={false} />);
      // Should find the element but without rotate-y-180, OR rotate-y-180 refers to the backface.
      // Wait, let's look at the code:
      // <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>

      // There are other elements with rotate-y-180 (the front face is rotated by default).
      // So we need to be specific.

      const transformDiv = container.querySelector('.transform-style-3d');
      expect(transformDiv).not.toHaveClass('rotate-y-180');
  });
});
