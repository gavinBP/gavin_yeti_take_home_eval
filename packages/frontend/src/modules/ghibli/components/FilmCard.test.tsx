import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import FilmCard from './FilmCard';
import type { Film } from '../types/ghibli.types';

// Mock the styled components
vi.mock('./styled/FilmCard.styled', () => ({
  FilmCardContainer: ({
    children,
    onClick,
    onMouseEnter,
    onMouseLeave,
    ...props
  }: any) => (
    <div
      data-testid="film-card-container"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...props}
    >
      {children}
    </div>
  ),
  CardImage: ({ src, alt, onError, ...props }: any) => (
    <img
      data-testid="card-image"
      src={src}
      alt={alt}
      onError={onError}
      {...props}
    />
  ),
  CardTitle: ({ children, ...props }: any) => (
    <div data-testid="card-title" {...props}>
      {children}
    </div>
  ),
  ImageFallback: ({ children, ...props }: any) => (
    <div data-testid="image-fallback" {...props}>
      {children}
    </div>
  ),
  FallbackText: ({ children, ...props }: any) => (
    <div data-testid="fallback-text" {...props}>
      {children}
    </div>
  ),
  HoverOverlay: ({ children, ...props }: any) => (
    <div data-testid="hover-overlay" {...props}>
      {children}
    </div>
  ),
  ArrowIcon: ({ children, ...props }: any) => (
    <div data-testid="arrow-icon" {...props}>
      {children}
    </div>
  ),
  InfoPopup: ({ children, ...props }: any) => (
    <div data-testid="info-popup" {...props}>
      {children}
    </div>
  ),
}));

const mockFilm: Film = {
  id: 'test-id',
  title: 'Test Film',
  description:
    'This is a test film description that should be displayed when the card is expanded.',
  director: 'Test Director',
  releaseDate: '2023',
  runtime: '120 min',
  image: 'http://example.com/test-image.jpg',
  movieBanner: 'http://example.com/test-banner.jpg',
  rottenTomatoesScore: '85',
};

const defaultProps = {
  film: mockFilm,
  isExpanded: false,
  onToggle: vi.fn(),
  hoverColor: '#FF8C42',
};

const renderFilmCard = (props = {}) => {
  return render(<FilmCard {...defaultProps} {...props} />);
};

describe('FilmCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Default State', () => {
    it('should render the film image by default', () => {
      renderFilmCard();

      const image = screen.getByTestId('card-image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', mockFilm.image);
      expect(image).toHaveAttribute('alt', mockFilm.title);
    });

    it('should show fallback when image fails to load', async () => {
      renderFilmCard();

      const image = screen.getByTestId('card-image');
      fireEvent.error(image);

      await waitFor(() => {
        expect(screen.getByTestId('image-fallback')).toBeInTheDocument();
        expect(screen.getByTestId('fallback-text')).toHaveTextContent(
          mockFilm.title,
        );
      });
    });

    it('should show fallback when no image is provided', () => {
      const filmWithoutImage = { ...mockFilm, image: '' };
      renderFilmCard({ film: filmWithoutImage });

      expect(screen.getByTestId('image-fallback')).toBeInTheDocument();
      expect(screen.getByTestId('fallback-text')).toHaveTextContent(
        mockFilm.title,
      );
    });

    it('should not show hover overlay in default state', () => {
      renderFilmCard();

      expect(screen.queryByTestId('hover-overlay')).not.toBeInTheDocument();
    });

    it('should not show info popup in default state', () => {
      renderFilmCard();

      expect(screen.queryByTestId('info-popup')).not.toBeInTheDocument();
    });
  });

  describe('Hover State', () => {
    it('should show hover overlay when mouse enters and card is not expanded', () => {
      renderFilmCard();

      const container = screen.getByTestId('film-card-container');
      fireEvent.mouseEnter(container);

      expect(screen.getByTestId('hover-overlay')).toBeInTheDocument();
      expect(screen.getByTestId('card-title')).toHaveTextContent(
        mockFilm.title,
      );
      expect(screen.getByTestId('arrow-icon')).toHaveTextContent('→');
    });

    it('should hide hover overlay when mouse leaves', () => {
      renderFilmCard();

      const container = screen.getByTestId('film-card-container');
      fireEvent.mouseEnter(container);
      fireEvent.mouseLeave(container);

      expect(screen.queryByTestId('hover-overlay')).not.toBeInTheDocument();
    });

    it('should not show hover overlay when card is expanded', () => {
      renderFilmCard({ isExpanded: true });

      const container = screen.getByTestId('film-card-container');
      fireEvent.mouseEnter(container);

      expect(screen.queryByTestId('hover-overlay')).not.toBeInTheDocument();
    });

    it('should use the provided hover color', () => {
      const customHoverColor = '#FF0000';
      renderFilmCard({ hoverColor: customHoverColor });

      const container = screen.getByTestId('film-card-container');
      fireEvent.mouseEnter(container);

      const hoverOverlay = screen.getByTestId('hover-overlay');
      expect(hoverOverlay).toHaveStyle(`background-color: ${customHoverColor}`);
    });
  });

  describe('Expanded State', () => {
    it('should show info popup when expanded', () => {
      renderFilmCard({ isExpanded: true });

      expect(screen.getByTestId('info-popup')).toBeInTheDocument();
    });

    it('should display film title in bold in the description section', () => {
      renderFilmCard({ isExpanded: true });

      const descriptionContent = screen.getByText(mockFilm.title);
      expect(descriptionContent).toBeInTheDocument();
    });

    it('should display film description', () => {
      renderFilmCard({ isExpanded: true });

      expect(screen.getByText(mockFilm.description)).toBeInTheDocument();
    });

    it('should display runtime information', () => {
      renderFilmCard({ isExpanded: true });

      expect(screen.getByText(/Runtime:/)).toBeInTheDocument();
      expect(screen.getByText(mockFilm.runtime)).toBeInTheDocument();
    });

    it('should display director information', () => {
      renderFilmCard({ isExpanded: true });

      expect(screen.getByText(/Director:/)).toBeInTheDocument();
      expect(screen.getByText(mockFilm.director)).toBeInTheDocument();
    });

    it('should display release date information', () => {
      renderFilmCard({ isExpanded: true });

      expect(screen.getByText(/Release:/)).toBeInTheDocument();
      expect(screen.getByText(mockFilm.releaseDate)).toBeInTheDocument();
    });

    it('should display Rotten Tomatoes score', () => {
      renderFilmCard({ isExpanded: true });

      expect(
        screen.getByText(mockFilm.rottenTomatoesScore),
      ).toBeInTheDocument();
    });

    it('should display Rotten Tomatoes logo', () => {
      renderFilmCard({ isExpanded: true });

      const logo = screen.getByAltText('Rotten Tomatoes');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', '/tomato@2x.png');
    });

    it('should handle missing film data gracefully', () => {
      const filmWithMissingData = {
        ...mockFilm,
        description: '',
        director: '',
        releaseDate: '',
        runtime: '',
        rottenTomatoesScore: '',
      };

      renderFilmCard({ film: filmWithMissingData, isExpanded: true });

      // Should still display the title
      expect(screen.getByText(mockFilm.title)).toBeInTheDocument();

      // Should show fallback text for missing description
      expect(screen.getByText('Description not available')).toBeInTheDocument();

      // Should show fallback text for missing score
      expect(screen.getByText('Not Available')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onToggle when card is clicked', () => {
      const onToggle = vi.fn();
      renderFilmCard({ onToggle });

      const container = screen.getByTestId('film-card-container');
      fireEvent.click(container);

      expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple clicks correctly', () => {
      const onToggle = vi.fn();
      renderFilmCard({ onToggle });

      const container = screen.getByTestId('film-card-container');
      fireEvent.click(container);
      fireEvent.click(container);

      expect(onToggle).toHaveBeenCalledTimes(2);
    });

    it('should maintain state correctly when toggling', async () => {
      const onToggle = vi.fn();
      const { rerender } = renderFilmCard({ onToggle });

      // Start in default state
      expect(screen.queryByTestId('info-popup')).not.toBeInTheDocument();

      // Click to expand
      const container = screen.getByTestId('film-card-container');
      fireEvent.click(container);

      // Rerender with expanded state
      rerender(
        <FilmCard {...defaultProps} onToggle={onToggle} isExpanded={true} />,
      );

      expect(screen.getByTestId('info-popup')).toBeInTheDocument();

      // Click to collapse
      fireEvent.click(container);

      // Rerender with collapsed state
      rerender(
        <FilmCard {...defaultProps} onToggle={onToggle} isExpanded={false} />,
      );

      expect(screen.queryByTestId('info-popup')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper alt text for images', () => {
      renderFilmCard();

      const image = screen.getByTestId('card-image');
      expect(image).toHaveAttribute('alt', mockFilm.title);
    });

    it('should be keyboard accessible', () => {
      renderFilmCard();

      const container = screen.getByTestId('film-card-container');
      expect(container).toHaveAttribute('role', 'button');
      expect(container).toHaveAttribute('tabIndex');
    });

    it('should handle keyboard interactions', () => {
      const onToggle = vi.fn();
      renderFilmCard({ onToggle });

      const container = screen.getByTestId('film-card-container');
      fireEvent.keyDown(container, { key: 'Enter' });

      expect(onToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe('Styling and Layout', () => {
    it('should have correct container styling', () => {
      renderFilmCard();

      const container = screen.getByTestId('film-card-container');
      expect(container).toHaveStyle({
        width: '290.5px',
        height: '368px',
        cursor: 'pointer',
      });
    });

    it('should have proper image styling', () => {
      renderFilmCard();

      const image = screen.getByTestId('card-image');
      expect(image).toHaveStyle({
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      });
    });
  });
});
