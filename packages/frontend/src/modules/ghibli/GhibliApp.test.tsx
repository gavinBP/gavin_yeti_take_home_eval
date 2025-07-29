import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { gql } from '@apollo/client';
import { vi } from 'vitest';
import GhibliApp from './GhibliApp';
import { FILM_IDS } from './constants/theme.constants';
import type { Film, UseGhibliFilmsReturn } from './types/ghibli.types';

// Mock the useGhibliFilms hook
vi.mock('./hooks/useGhibliFilms');

const mockUseGhibliFilms = vi.mocked(
  await import('./hooks/useGhibliFilms'),
).useGhibliFilms;

// Sample film data for testing
const mockFilms = [
  {
    id: FILM_IDS.porcoRosso,
    title: 'Porco Rosso',
    description:
      'A bounty hunting seaplane pilot fights air pirates in the Adriatic Sea.',
    director: 'Hayao Miyazaki',
    releaseDate: '1992',
    runtime: '94 min',
    image: 'https://example.com/porco-rosso.jpg',
    movieBanner: 'https://example.com/porco-rosso-banner.jpg',
    rottenTomatoesScore: '96',
  },
  {
    id: FILM_IDS.kikiDelivery,
    title: "Kiki's Delivery Service",
    description:
      'A young witch moves to a new town and starts a delivery service.',
    director: 'Hayao Miyazaki',
    releaseDate: '1989',
    runtime: '103 min',
    image: 'https://example.com/kiki.jpg',
    movieBanner: 'https://example.com/kiki-banner.jpg',
    rottenTomatoesScore: '98',
  },
  {
    id: FILM_IDS.howlsCastle,
    title: "Howl's Moving Castle",
    description:
      'A young woman is cursed by a witch and seeks help from a wizard.',
    director: 'Hayao Miyazaki',
    releaseDate: '2004',
    runtime: '119 min',
    image: 'https://example.com/howl.jpg',
    movieBanner: 'https://example.com/howl-banner.jpg',
    rottenTomatoesScore: '87',
  },
  {
    id: FILM_IDS.totoro,
    title: 'My Neighbor Totoro',
    description: 'Two sisters encounter a magical creature in the forest.',
    director: 'Hayao Miyazaki',
    releaseDate: '1988',
    runtime: '86 min',
    image: 'https://example.com/totoro.jpg',
    movieBanner: 'https://example.com/totoro-banner.jpg',
    rottenTomatoesScore: '93',
  },
];

// Mock Apollo Client queries
const GET_MAIN_FILMS = gql`
  query GetMainFilms {
    films {
      id
      title
      description
      director
      releaseDate
      runtime
      image
      movieBanner
      rottenTomatoesScore
    }
  }
`;

const mocks = [
  {
    request: {
      query: GET_MAIN_FILMS,
    },
    result: {
      data: {
        films: mockFilms,
      },
    },
  },
];

const renderGhibliApp = (mockReturnValue: UseGhibliFilmsReturn) => {
  mockUseGhibliFilms.mockReturnValue(mockReturnValue);

  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <GhibliApp />
    </MockedProvider>,
  );
};

describe('GhibliApp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the main header and subtitle', () => {
      renderGhibliApp({
        films: mockFilms,
        error: null,
      });

      expect(
        screen.getByText('🎬 Discover Studio Ghibli Films 🎬'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Select a film & hover to learn more'),
      ).toBeInTheDocument();
    });

    it('should render all four film cards', () => {
      renderGhibliApp({
        films: mockFilms,
        error: null,
      });

      expect(screen.getByAltText('Porco Rosso')).toBeInTheDocument();
      expect(
        screen.getByAltText("Kiki's Delivery Service"),
      ).toBeInTheDocument();
      expect(screen.getByAltText("Howl's Moving Castle")).toBeInTheDocument();
      expect(screen.getByAltText('My Neighbor Totoro')).toBeInTheDocument();
    });

    it('should render loading state when films are loading', () => {
      renderGhibliApp({
        films: [],
        error: null,
      });

      // Should show fallback titles when no films are loaded
      expect(screen.getByText('Porco Rosso')).toBeInTheDocument();
      expect(screen.getByText("Kiki's Delivery Service")).toBeInTheDocument();
      expect(screen.getByText("Howl's Moving Castle")).toBeInTheDocument();
      expect(screen.getByText('My Neighbor Totoro')).toBeInTheDocument();
    });

    it('should render error message when there is an error', () => {
      const errorMessage = 'Failed to load films';
      renderGhibliApp({
        films: [],
        error: errorMessage,
      });

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  describe('Card Interactions', () => {
    it('should expand card when clicked', async () => {
      renderGhibliApp({
        films: mockFilms,
        error: null,
      });

      const porcoRossoCard = screen
        .getByAltText('Porco Rosso')
        .closest('[role="button"]');
      expect(porcoRossoCard).toBeInTheDocument();

      fireEvent.click(porcoRossoCard!);

      // Should show expanded content
      await waitFor(() => {
        expect(screen.getByText('Porco Rosso')).toBeInTheDocument();
        expect(
          screen.getByText(
            'A bounty hunting seaplane pilot fights air pirates in the Adriatic Sea.',
          ),
        ).toBeInTheDocument();
        expect(screen.getByText('Runtime: 94 min')).toBeInTheDocument();
        expect(
          screen.getByText('Director: Hayao Miyazaki'),
        ).toBeInTheDocument();
        expect(screen.getByText('Release: 1992')).toBeInTheDocument();
        expect(screen.getByText('96')).toBeInTheDocument();
      });
    });

    it('should collapse card when clicked again', async () => {
      renderGhibliApp({
        films: mockFilms,
        error: null,
      });

      const porcoRossoCard = screen
        .getByAltText('Porco Rosso')
        .closest('[role="button"]');

      // First click to expand
      fireEvent.click(porcoRossoCard!);

      await waitFor(() => {
        expect(
          screen.getByText(
            'A bounty hunting seaplane pilot fights air pirates in the Adriatic Sea.',
          ),
        ).toBeInTheDocument();
      });

      // Second click to collapse
      fireEvent.click(porcoRossoCard!);

      await waitFor(() => {
        expect(
          screen.queryByText(
            'A bounty hunting seaplane pilot fights air pirates in the Adriatic Sea.',
          ),
        ).not.toBeInTheDocument();
      });
    });

    it('should handle multiple cards being expanded independently', async () => {
      renderGhibliApp({
        films: mockFilms,
        error: null,
      });

      const porcoRossoCard = screen
        .getByAltText('Porco Rosso')
        .closest('[role="button"]');
      const kikiCard = screen
        .getByAltText("Kiki's Delivery Service")
        .closest('[role="button"]');

      // Expand first card
      fireEvent.click(porcoRossoCard!);
      await waitFor(() => {
        expect(
          screen.getByText(
            'A bounty hunting seaplane pilot fights air pirates in the Adriatic Sea.',
          ),
        ).toBeInTheDocument();
      });

      // Expand second card
      fireEvent.click(kikiCard!);
      await waitFor(() => {
        expect(
          screen.getByText(
            'A young witch moves to a new town and starts a delivery service.',
          ),
        ).toBeInTheDocument();
      });

      // Both cards should be expanded
      expect(
        screen.getByText(
          'A bounty hunting seaplane pilot fights air pirates in the Adriatic Sea.',
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'A young witch moves to a new town and starts a delivery service.',
        ),
      ).toBeInTheDocument();
    });
  });

  describe('Hover States', () => {
    it('should show hover overlay when mouse enters card', () => {
      renderGhibliApp({
        films: mockFilms,
        error: null,
      });

      const porcoRossoCard = screen
        .getByAltText('Porco Rosso')
        .closest('[role="button"]');

      fireEvent.mouseEnter(porcoRossoCard!);

      // Should show hover overlay with title and arrow
      expect(screen.getByText('Porco Rosso')).toBeInTheDocument();
      expect(screen.getByText('→')).toBeInTheDocument();
    });

    it('should hide hover overlay when mouse leaves card', () => {
      renderGhibliApp({
        films: mockFilms,
        error: null,
      });

      const porcoRossoCard = screen
        .getByAltText('Porco Rosso')
        .closest('[role="button"]');

      fireEvent.mouseEnter(porcoRossoCard!);
      fireEvent.mouseLeave(porcoRossoCard!);

      // Hover overlay should be hidden
      expect(screen.queryByText('→')).not.toBeInTheDocument();
    });

    it('should not show hover effects when card is expanded', async () => {
      renderGhibliApp({
        films: mockFilms,
        error: null,
      });

      const porcoRossoCard = screen
        .getByAltText('Porco Rosso')
        .closest('[role="button"]');

      // Expand the card
      fireEvent.click(porcoRossoCard!);
      await waitFor(() => {
        expect(
          screen.getByText(
            'A bounty hunting seaplane pilot fights air pirates in the Adriatic Sea.',
          ),
        ).toBeInTheDocument();
      });

      // Try to hover - should not show hover overlay
      fireEvent.mouseEnter(porcoRossoCard!);
      expect(screen.queryByText('→')).not.toBeInTheDocument();
    });
  });

  describe('Image Handling', () => {
    it('should show fallback when image fails to load', () => {
      renderGhibliApp({
        films: [
          {
            ...mockFilms[0],
            image: 'invalid-url',
          },
        ],
        error: null,
      });

      const fallbackText = screen.getByText('Porco Rosso');
      expect(fallbackText).toBeInTheDocument();
    });

    it('should display movie images when available', () => {
      renderGhibliApp({
        films: mockFilms,
        error: null,
      });

      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(4); // 4 film images

      images.forEach((img) => {
        expect(img).toHaveAttribute('src');
      });
    });
  });

  describe('Layout and Styling', () => {
    it('should render cards in a grid layout', () => {
      renderGhibliApp({
        films: mockFilms,
        error: null,
      });

      const gridContainer =
        screen.getByRole('main') ||
        document.querySelector('[style*="display: grid"]');
      expect(gridContainer).toBeInTheDocument();
    });

    it('should have proper card dimensions', () => {
      renderGhibliApp({
        films: mockFilms,
        error: null,
      });

      const cards = document.querySelectorAll('[style*="width: 290.5px"]');
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('should have proper alt text for images', () => {
      renderGhibliApp({
        films: mockFilms,
        error: null,
      });

      expect(screen.getByAltText('Porco Rosso')).toBeInTheDocument();
      expect(
        screen.getByAltText("Kiki's Delivery Service"),
      ).toBeInTheDocument();
      expect(screen.getByAltText("Howl's Moving Castle")).toBeInTheDocument();
      expect(screen.getByAltText('My Neighbor Totoro')).toBeInTheDocument();
    });

    it('should be keyboard accessible', () => {
      renderGhibliApp({
        films: mockFilms,
        error: null,
      });

      const cards = screen.getAllByRole('button');
      cards.forEach((card) => {
        expect(card).toHaveAttribute('tabIndex');
      });
    });
  });
});
