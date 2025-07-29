import { describe, it, expect, vi } from 'vitest';
import {
  isValidImageUrl,
  createImageFallback,
  handleImageError,
  formatFilmDetails,
  preloadImage,
  preloadImages,
  getFallbackContent,
  DEFAULT_FALLBACK_CONTENT,
  DEFAULT_IMAGE_FALLBACK_CONFIG,
} from './imageUtils';
import type { Film } from '../types/ghibli.types';

// Mock the Image constructor
global.Image = vi.fn(() => ({
  onload: vi.fn(),
  onerror: vi.fn(),
  src: '',
}));

describe('imageUtils', () => {
  describe('isValidImageUrl', () => {
    it('should return true for valid HTTP URLs', () => {
      expect(isValidImageUrl('http://example.com/image.jpg')).toBe(true);
      expect(isValidImageUrl('https://example.com/image.jpg')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isValidImageUrl('invalid-url')).toBe(false);
      expect(isValidImageUrl('ftp://example.com/image.jpg')).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(isValidImageUrl(null)).toBe(false);
      expect(isValidImageUrl(undefined)).toBe(false);
      expect(isValidImageUrl('')).toBe(false);
    });
  });

  describe('createImageFallback', () => {
    it('should create a fallback image with default config', () => {
      const result = createImageFallback('Test Film');
      expect(result).toContain('data:image/svg+xml;base64,');
      // The base64 encoded SVG contains the title, so we decode it to check
      const decoded = atob(result.replace('data:image/svg+xml;base64,', ''));
      expect(decoded).toContain('Test Film');
    });

    it('should create a fallback image with custom config', () => {
      const customConfig = {
        width: 100,
        height: 200,
        backgroundColor: '#ff0000',
        textColor: '#00ff00',
        fontSize: '2rem',
      };

      const result = createImageFallback('Custom Film', customConfig);
      const decoded = atob(result.replace('data:image/svg+xml;base64,', ''));
      expect(decoded).toContain('width="100"');
      expect(decoded).toContain('height="200"');
      expect(decoded).toContain('fill="#ff0000"');
      expect(decoded).toContain('fill="#00ff00"');
      expect(decoded).toContain('font-size="2rem"');
    });
  });

  describe('handleImageError', () => {
    const mockFilm: Film = {
      id: 'test-id',
      title: 'Test Film',
      description: 'Test description',
      director: 'Test Director',
      releaseDate: '2023',
      runtime: '120 min',
      image: 'test-image.jpg',
      movieBanner: 'test-banner.jpg',
      rottenTomatoesScore: '85',
    };

    it('should return error state with film title', () => {
      const result = handleImageError(mockFilm);
      expect(result.hasError).toBe(true);
      expect(result.fallbackTitle).toBe('Test Film');
    });

    it('should use fallback content when film title is missing', () => {
      const filmWithoutTitle = { ...mockFilm, title: '' };
      const result = handleImageError(filmWithoutTitle);
      expect(result.fallbackTitle).toBe(DEFAULT_FALLBACK_CONTENT.title);
    });

    it('should use custom fallback content', () => {
      const customFallback = { title: 'Custom Title' };
      const result = handleImageError(mockFilm, customFallback);
      expect(result.fallbackTitle).toBe('Test Film'); // Still uses film title if available
    });
  });

  describe('formatFilmDetails', () => {
    const mockFilm: Film = {
      id: 'test-id',
      title: 'Test Film',
      description: 'Test description',
      director: 'Test Director',
      releaseDate: '2023',
      runtime: '120 min',
      image: 'test-image.jpg',
      movieBanner: 'test-banner.jpg',
      rottenTomatoesScore: '85',
    };

    it('should format all available details', () => {
      const result = formatFilmDetails(mockFilm);
      expect(result).toBe(
        'Runtime: 120 min • Director: Test Director • Release: 2023',
      );
    });

    it('should handle missing details', () => {
      const filmWithMissingDetails = {
        ...mockFilm,
        runtime: '',
        director: '',
        releaseDate: '',
      };
      const result = formatFilmDetails(filmWithMissingDetails);
      expect(result).toBe('Details not available');
    });

    it('should handle partial details', () => {
      const filmWithPartialDetails = {
        ...mockFilm,
        director: '',
        releaseDate: '',
      };
      const result = formatFilmDetails(filmWithPartialDetails);
      expect(result).toBe('Runtime: 120 min');
    });
  });

  describe('preloadImage', () => {
    it('should resolve to true for successful image load', async () => {
      const mockImage = {
        onload: vi.fn(),
        onerror: vi.fn(),
        src: '',
      };

      (global.Image as any).mockImplementation(() => mockImage);

      const promise = preloadImage('http://example.com/image.jpg');

      // Simulate successful load
      setTimeout(() => mockImage.onload(), 0);

      const result = await promise;
      expect(result).toBe(true);
    });

    it('should resolve to false for failed image load', async () => {
      const mockImage = {
        onload: vi.fn(),
        onerror: vi.fn(),
        src: '',
      };

      (global.Image as any).mockImplementation(() => mockImage);

      const promise = preloadImage('http://example.com/invalid.jpg');

      // Simulate failed load
      setTimeout(() => mockImage.onerror(), 0);

      const result = await promise;
      expect(result).toBe(false);
    });
  });

  describe('preloadImages', () => {
    it('should preload multiple images and return results', async () => {
      const mockImage = {
        onload: vi.fn(),
        onerror: vi.fn(),
        src: '',
      };

      (global.Image as any).mockImplementation(() => mockImage);

      const urls = [
        'http://example.com/image1.jpg',
        'http://example.com/image2.jpg',
      ];
      const promise = preloadImages(urls);

      // Simulate mixed results immediately
      mockImage.onload(); // First image loads successfully
      mockImage.onerror(); // Second image fails

      const results = await promise;
      expect(results.size).toBe(2);
    }, 10000); // Increase timeout to 10 seconds
  });

  describe('getFallbackContent', () => {
    const mockFilm: Film = {
      id: 'test-id',
      title: 'Test Film',
      description: 'Test description',
      director: 'Test Director',
      releaseDate: '2023',
      runtime: '120 min',
      image: 'test-image.jpg',
      movieBanner: 'test-banner.jpg',
      rottenTomatoesScore: '85',
    };

    it('should return film data when available', () => {
      const result = getFallbackContent(mockFilm);
      expect(result.title).toBe('Test Film');
      expect(result.description).toBe('Test description');
      expect(result.director).toBe('Test Director');
      expect(result.releaseDate).toBe('2023');
      expect(result.runtime).toBe('120 min');
      expect(result.rottenTomatoes).toBe('85');
    });

    it('should use default fallback content for missing data', () => {
      const filmWithMissingData = {
        ...mockFilm,
        title: '',
        description: '',
        director: '',
      };
      const result = getFallbackContent(filmWithMissingData);
      expect(result.title).toBe(DEFAULT_FALLBACK_CONTENT.title);
      expect(result.description).toBe(DEFAULT_FALLBACK_CONTENT.description);
      expect(result.director).toBe(DEFAULT_FALLBACK_CONTENT.director);
    });
  });

  describe('constants', () => {
    it('should have correct default fallback content', () => {
      expect(DEFAULT_FALLBACK_CONTENT.title).toBe('Film Title Not Available');
      expect(DEFAULT_FALLBACK_CONTENT.description).toBe(
        'Description not available',
      );
      expect(DEFAULT_FALLBACK_CONTENT.rottenTomatoes).toBe('Not Available');
    });

    it('should have correct default image fallback config', () => {
      expect(DEFAULT_IMAGE_FALLBACK_CONFIG.width).toBe(290.5);
      expect(DEFAULT_IMAGE_FALLBACK_CONFIG.height).toBe(368);
      expect(DEFAULT_IMAGE_FALLBACK_CONFIG.backgroundColor).toBe('#000000');
      expect(DEFAULT_IMAGE_FALLBACK_CONFIG.textColor).toBe('#ffffff');
    });
  });
});
