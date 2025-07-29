import { describe, it, expect } from 'vitest';
import {
  validateFilm,
  transformFilmData,
  validateAndTransformFilms,
  formatFilmDetails,
  sortFilms,
  filterFilms,
  groupFilmsByDirector,
  calculateFilmStats,
  isFilmComplete,
  getIncompleteFilms,
  getCompleteFilms,
} from './dataUtils';
import type { Film } from '../types/ghibli.types';

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

const mockIncompleteFilm: Film = {
  id: 'incomplete-id',
  title: 'Incomplete Film',
  description: '',
  director: '',
  releaseDate: '',
  runtime: '',
  image: '',
  movieBanner: '',
  rottenTomatoesScore: '',
};

describe('dataUtils', () => {
  describe('validateFilm', () => {
    it('should validate a complete film successfully', () => {
      const result = validateFilm(mockFilm);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });

    it('should detect missing required fields', () => {
      const incompleteFilm = { ...mockFilm, id: '', title: '' };
      const result = validateFilm(incompleteFilm);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Film ID is required');
      expect(result.errors).toContain('Film title is required');
    });

    it('should warn about missing optional fields', () => {
      const result = validateFilm(mockIncompleteFilm);
      expect(result.isValid).toBe(true); // Has required fields
      expect(result.warnings).toContain('Film description is missing');
      expect(result.warnings).toContain('Film director is missing');
      expect(result.warnings).toContain('Film release date is missing');
      expect(result.warnings).toContain('Film runtime is missing');
      expect(result.warnings).toContain('Film image is missing');
      expect(result.warnings).toContain('Rotten Tomatoes score is missing');
    });
  });

  describe('transformFilmData', () => {
    it('should transform film data with fallback values', () => {
      const transformed = transformFilmData(mockIncompleteFilm);
      expect(transformed.title).toBe('Incomplete Film');
      expect(transformed.description).toBe('Description not available');
      expect(transformed.director).toBe('Director not available');
      expect(transformed.releaseDate).toBe('Release date not available');
      expect(transformed.runtime).toBe('Runtime not available');
      expect(transformed.rottenTomatoesScore).toBe('Not Available');
    });

    it('should preserve existing data when available', () => {
      const transformed = transformFilmData(mockFilm);
      expect(transformed.title).toBe('Test Film');
      expect(transformed.description).toBe('Test description');
      expect(transformed.director).toBe('Test Director');
    });
  });

  describe('validateAndTransformFilms', () => {
    it('should process an array of films correctly', () => {
      const films = [mockFilm, mockIncompleteFilm];
      const result = validateAndTransformFilms(films);

      expect(result.validFilms).toHaveLength(2);
      expect(result.invalidFilms).toHaveLength(0);
      expect(result.validationResults).toHaveLength(2);
    });

    it('should separate valid and invalid films', () => {
      const invalidFilm = { ...mockFilm, id: '', title: '' };
      const films = [mockFilm, invalidFilm];
      const result = validateAndTransformFilms(films);

      expect(result.validFilms).toHaveLength(1);
      expect(result.invalidFilms).toHaveLength(1);
    });
  });

  describe('formatFilmDetails', () => {
    it('should format complete film details', () => {
      const result = formatFilmDetails(mockFilm);
      expect(result).toBe(
        'Runtime: 120 min • Director: Test Director • Release: 2023',
      );
    });

    it('should handle missing details gracefully', () => {
      const result = formatFilmDetails(mockIncompleteFilm);
      expect(result).toBe('Details not available');
    });

    it('should handle partial details', () => {
      const partialFilm = { ...mockFilm, director: '', releaseDate: '' };
      const result = formatFilmDetails(partialFilm);
      expect(result).toBe('Runtime: 120 min');
    });
  });

  describe('sortFilms', () => {
    const films = [
      { ...mockFilm, title: 'Zebra Film' },
      { ...mockFilm, title: 'Alpha Film' },
      { ...mockFilm, title: 'Beta Film' },
    ];

    it('should sort films by title in ascending order', () => {
      const result = sortFilms(films, 'title', 'asc');
      expect(result[0].title).toBe('Alpha Film');
      expect(result[1].title).toBe('Beta Film');
      expect(result[2].title).toBe('Zebra Film');
    });

    it('should sort films by title in descending order', () => {
      const result = sortFilms(films, 'title', 'desc');
      expect(result[0].title).toBe('Zebra Film');
      expect(result[1].title).toBe('Beta Film');
      expect(result[2].title).toBe('Alpha Film');
    });
  });

  describe('filterFilms', () => {
    const films = [
      { ...mockFilm, title: 'Action Movie', director: 'John Doe' },
      { ...mockFilm, title: 'Comedy Film', director: 'Jane Smith' },
      { ...mockFilm, title: 'Drama Movie', director: 'Bob Johnson' },
    ];

    it('should filter films by search term', () => {
      const result = filterFilms(films, 'movie');
      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Action Movie');
      expect(result[1].title).toBe('Drama Movie');
    });

    it('should return all films for empty search term', () => {
      const result = filterFilms(films, '');
      expect(result).toHaveLength(3);
    });

    it('should be case insensitive', () => {
      const result = filterFilms(films, 'MOVIE');
      expect(result).toHaveLength(2);
    });
  });

  describe('groupFilmsByDirector', () => {
    const films = [
      { ...mockFilm, director: 'Director A' },
      { ...mockFilm, director: 'Director B' },
      { ...mockFilm, director: 'Director A' },
    ];

    it('should group films by director', () => {
      const result = groupFilmsByDirector(films);
      expect(Object.keys(result)).toHaveLength(2);
      expect(result['Director A']).toHaveLength(2);
      expect(result['Director B']).toHaveLength(1);
    });

    it('should handle films with missing director', () => {
      const filmsWithMissing = [...films, { ...mockFilm, director: '' }];
      const result = groupFilmsByDirector(filmsWithMissing);
      expect(result['Unknown Director']).toHaveLength(1);
    });
  });

  describe('calculateFilmStats', () => {
    const films = [
      { ...mockFilm, rottenTomatoesScore: '90' },
      { ...mockFilm, rottenTomatoesScore: '80' },
      { ...mockFilm, rottenTomatoesScore: '70' },
      { ...mockFilm, rottenTomatoesScore: '' },
    ];

    it('should calculate correct statistics', () => {
      const result = calculateFilmStats(films);
      expect(result.totalFilms).toBe(4);
      expect(result.filmsWithImages).toBe(4);
      expect(result.filmsWithScores).toBe(3);
      expect(result.averageScore).toBe(80);
      expect(result.imageCoverage).toBe(100);
      expect(result.scoreCoverage).toBe(75);
    });
  });

  describe('isFilmComplete', () => {
    it('should return true for complete films', () => {
      expect(isFilmComplete(mockFilm)).toBe(true);
    });

    it('should return false for incomplete films', () => {
      expect(isFilmComplete(mockIncompleteFilm)).toBe(false);
    });
  });

  describe('getIncompleteFilms', () => {
    it('should return only incomplete films', () => {
      const films = [mockFilm, mockIncompleteFilm];
      const result = getIncompleteFilms(films);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('incomplete-id');
    });
  });

  describe('getCompleteFilms', () => {
    it('should return only complete films', () => {
      const films = [mockFilm, mockIncompleteFilm];
      const result = getCompleteFilms(films);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('test-id');
    });
  });
});
