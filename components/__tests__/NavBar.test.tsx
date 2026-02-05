import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NavBar from '../NavBar';

describe('NavBar', () => {
  it('renders navigation links', () => {
    render(
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
    );

    expect(screen.getByText('Dash')).toBeInTheDocument();
    expect(screen.getByText('Coach')).toBeInTheDocument();

    // The middle link has an icon but no text, checking by href attribute
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);

    expect(links[0]).toHaveAttribute('href', '/dashboard');
    expect(links[1]).toHaveAttribute('href', '/workout');
    expect(links[2]).toHaveAttribute('href', '/coach');
  });
});
