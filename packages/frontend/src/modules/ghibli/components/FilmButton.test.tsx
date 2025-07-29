import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import FilmButton from './FilmButton';
import type { Film } from '../types/ghibli.types';

// Mock the styled components
vi.mock('./styled/FilmButton.styled', () => ({
  FilmButtonContainer: ({ children, onClick, disabled, ...props }: any) => (
    <button
      data-testid="film-button-container"
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  ),
  LoadingSpinner: ({ size, ...props }: any) => (
    <div data-testid="loading-spinner" data-size={size} {...props} />
  ),
  ButtonContent: ({ children, ...props }: any) => (
    <div data-testid="button-content" {...props}>
      {children}
    </div>
  ),
  FilmImage: ({ src, alt, onError, ...props }: any) => (
    <img
      data-testid="film-image"
      src={src}
      alt={alt}
      onError={onError}
      {...props}
    />
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
}));

const mockFilm: Film = {
  id: 'test-id',
  title: 'Test Film',
  description: 'Test description',
  director: 'Test Director',
  releaseDate: '2023',
  runtime: '120 min',
  image: 'http://example.com/test-image.jpg',
  movieBanner: 'http://example.com/test-banner.jpg',
  rottenTomatoesScore: '85',
};

const defaultProps = {
  film: mockFilm,
  onClick: vi.fn(),
  isLoading: false,
};

const renderFilmButton = (props = {}) => {
  return render(<FilmButton {...defaultProps} {...props} />);
};

describe('FilmButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Default State', () => {
    it('should render the film image when not loading', () => {
      renderFilmButton();

      const image = screen.getByTestId('film-image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', mockFilm.image);
      expect(image).toHaveAttribute('alt', mockFilm.title);
    });

    it('should show fallback when image fails to load', async () => {
      renderFilmButton();

      const image = screen.getByTestId('film-image');
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
      renderFilmButton({ film: filmWithoutImage });

      expect(screen.getByTestId('image-fallback')).toBeInTheDocument();
      expect(screen.getByTestId('fallback-text')).toHaveTextContent(
        mockFilm.title,
      );
    });

    it('should not show loading spinner in default state', () => {
      renderFilmButton();

      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });

    it('should not show loading text in default state', () => {
      renderFilmButton();

      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner when isLoading is true', () => {
      renderFilmButton({ isLoading: true });

      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveAttribute('data-size', '32');
    });

    it('should show loading text when isLoading is true', () => {
      renderFilmButton({ isLoading: true });

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should not show film image when loading', () => {
      renderFilmButton({ isLoading: true });

      expect(screen.queryByTestId('film-image')).not.toBeInTheDocument();
    });

    it('should not show fallback when loading', () => {
      renderFilmButton({ isLoading: true });

      expect(screen.queryByTestId('image-fallback')).not.toBeInTheDocument();
    });

    it('should disable the button when loading', () => {
      renderFilmButton({ isLoading: true });

      const button = screen.getByTestId('film-button-container');
      expect(button).toBeDisabled();
    });
  });

  describe('Interactions', () => {
    it('should call onClick when button is clicked and not loading', () => {
      const onClick = vi.fn();
      renderFilmButton({ onClick });

      const button = screen.getByTestId('film-button-container');
      fireEvent.click(button);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when button is loading', () => {
      const onClick = vi.fn();
      renderFilmButton({ onClick, isLoading: true });

      const button = screen.getByTestId('film-button-container');
      fireEvent.click(button);

      expect(onClick).not.toHaveBeenCalled();
    });

    it('should handle multiple clicks correctly when not loading', () => {
      const onClick = vi.fn();
      renderFilmButton({ onClick });

      const button = screen.getByTestId('film-button-container');
      fireEvent.click(button);
      fireEvent.click(button);

      expect(onClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('Image Handling', () => {
    it('should handle image loading errors gracefully', async () => {
      renderFilmButton();

      const image = screen.getByTestId('film-image');
      fireEvent.error(image);

      await waitFor(() => {
        expect(screen.getByTestId('image-fallback')).toBeInTheDocument();
        expect(screen.getByTestId('fallback-text')).toHaveTextContent(
          mockFilm.title,
        );
      });
    });

    it('should display fallback for missing image', () => {
      const filmWithoutImage = { ...mockFilm, image: '' };
      renderFilmButton({ film: filmWithoutImage });

      expect(screen.getByTestId('image-fallback')).toBeInTheDocument();
      expect(screen.getByTestId('fallback-text')).toHaveTextContent(
        mockFilm.title,
      );
    });

    it('should display fallback for null image', () => {
      const filmWithNullImage = { ...mockFilm, image: null };
      renderFilmButton({ film: filmWithNullImage });

      expect(screen.getByTestId('image-fallback')).toBeInTheDocument();
      expect(screen.getByTestId('fallback-text')).toHaveTextContent(
        mockFilm.title,
      );
    });
  });

  describe('Accessibility', () => {
    it('should have proper alt text for images', () => {
      renderFilmButton();

      const image = screen.getByTestId('film-image');
      expect(image).toHaveAttribute('alt', mockFilm.title);
    });

    it('should be keyboard accessible when not loading', () => {
      renderFilmButton();

      const button = screen.getByTestId('film-button-container');
      expect(button).not.toBeDisabled();
    });

    it('should handle keyboard interactions when not loading', () => {
      const onClick = vi.fn();
      renderFilmButton({ onClick });

      const button = screen.getByTestId('film-button-container');
      fireEvent.keyDown(button, { key: 'Enter' });

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should not handle keyboard interactions when loading', () => {
      const onClick = vi.fn();
      renderFilmButton({ onClick, isLoading: true });

      const button = screen.getByTestId('film-button-container');
      fireEvent.keyDown(button, { key: 'Enter' });

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('Styling and Layout', () => {
    it('should have correct button styling', () => {
      renderFilmButton();

      const button = screen.getByTestId('film-button-container');
      expect(button).toHaveStyle({
        width: '290.5px',
        height: '368px',
      });
    });

    it('should have proper image styling', () => {
      renderFilmButton();

      const image = screen.getByTestId('film-image');
      expect(image).toHaveStyle({
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      });
    });

    it('should have proper loading layout', () => {
      renderFilmButton({ isLoading: true });

      const content = screen.getByTestId('button-content');
      const spinner = screen.getByTestId('loading-spinner');
      const loadingText = screen.getByText('Loading...');

      expect(content).toBeInTheDocument();
      expect(spinner).toBeInTheDocument();
      expect(loadingText).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle film with missing title', () => {
      const filmWithoutTitle = { ...mockFilm, title: '' };
      renderFilmButton({ film: filmWithoutTitle });

      // Should still render without crashing
      expect(screen.getByTestId('film-button-container')).toBeInTheDocument();
    });

    it('should handle film with all missing data', () => {
      const emptyFilm = {
        id: 'test-id',
        title: '',
        description: '',
        director: '',
        releaseDate: '',
        runtime: '',
        image: '',
        movieBanner: '',
        rottenTomatoesScore: '',
      };

      renderFilmButton({ film: emptyFilm });

      // Should still render without crashing
      expect(screen.getByTestId('film-button-container')).toBeInTheDocument();
      expect(screen.getByTestId('image-fallback')).toBeInTheDocument();
    });

    it('should handle rapid state changes', async () => {
      const { rerender } = renderFilmButton({ isLoading: false });

      // Switch to loading
      rerender(<FilmButton {...defaultProps} isLoading={true} />);
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

      // Switch back to not loading
      rerender(<FilmButton {...defaultProps} isLoading={false} />);
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      expect(screen.getByTestId('film-image')).toBeInTheDocument();
    });
  });
});
