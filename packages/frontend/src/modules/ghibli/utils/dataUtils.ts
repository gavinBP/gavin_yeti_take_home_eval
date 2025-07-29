import type { Film } from '../types/ghibli.types';
import { FALLBACK_TEXT } from '../constants/theme.constants';

/**
 * Utility functions for data validation and transformation
 */

export interface DataValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates a film object and returns validation results
 */
export const validateFilm = (film: Film): DataValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!film.id) {
    errors.push('Film ID is required');
  }

  if (!film.title) {
    errors.push('Film title is required');
  }

  // Optional fields with warnings
  if (!film.description) {
    warnings.push('Film description is missing');
  }

  if (!film.director) {
    warnings.push('Film director is missing');
  }

  if (!film.releaseDate) {
    warnings.push('Film release date is missing');
  }

  if (!film.runtime) {
    warnings.push('Film runtime is missing');
  }

  if (!film.image) {
    warnings.push('Film image is missing');
  }

  if (!film.rottenTomatoesScore) {
    warnings.push('Rotten Tomatoes score is missing');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Transforms and enhances film data with fallback values
 */
export const transformFilmData = (film: Film): Film => {
  return {
    ...film,
    title: film.title || 'Unknown Film',
    description: film.description || FALLBACK_TEXT.description,
    director: film.director || FALLBACK_TEXT.director,
    releaseDate: film.releaseDate || FALLBACK_TEXT.releaseDate,
    runtime: film.runtime || FALLBACK_TEXT.runtime,
    rottenTomatoesScore:
      film.rottenTomatoesScore || FALLBACK_TEXT.rottenTomatoes,
    image: film.image || '',
    movieBanner: film.movieBanner || '',
  };
};

/**
 * Validates and transforms an array of films
 */
export const validateAndTransformFilms = (
  films: Film[],
): {
  validFilms: Film[];
  invalidFilms: Film[];
  validationResults: DataValidationResult[];
} => {
  const validFilms: Film[] = [];
  const invalidFilms: Film[] = [];
  const validationResults: DataValidationResult[] = [];

  films.forEach((film) => {
    const validation = validateFilm(film);
    validationResults.push(validation);

    if (validation.isValid) {
      validFilms.push(transformFilmData(film));
    } else {
      invalidFilms.push(film);
    }
  });

  return {
    validFilms,
    invalidFilms,
    validationResults,
  };
};

/**
 * Formats film details for display
 */
export const formatFilmDetails = (film: Film): string => {
  const details: string[] = [];

  if (film.runtime) {
    details.push(`Runtime: ${film.runtime}`);
  }
  if (film.director) {
    details.push(`Director: ${film.director}`);
  }
  if (film.releaseDate) {
    details.push(`Release: ${film.releaseDate}`);
  }

  return details.join(' • ') || 'Details not available';
};

/**
 * Sorts films by a specified field
 */
export const sortFilms = (
  films: Film[],
  sortBy: keyof Film = 'title',
  sortOrder: 'asc' | 'desc' = 'asc',
): Film[] => {
  return [...films].sort((a, b) => {
    const aValue = a[sortBy] || '';
    const bValue = b[sortBy] || '';

    if (sortOrder === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });
};

/**
 * Filters films by search term
 */
export const filterFilms = (films: Film[], searchTerm: string): Film[] => {
  if (!searchTerm.trim()) {
    return films;
  }

  const term = searchTerm.toLowerCase();
  return films.filter(
    (film) =>
      film.title.toLowerCase().includes(term) ||
      film.description?.toLowerCase().includes(term) ||
      film.director?.toLowerCase().includes(term),
  );
};

/**
 * Groups films by director
 */
export const groupFilmsByDirector = (films: Film[]): Record<string, Film[]> => {
  return films.reduce(
    (groups, film) => {
      const director = film.director || 'Unknown Director';
      if (!groups[director]) {
        groups[director] = [];
      }
      groups[director].push(film);
      return groups;
    },
    {} as Record<string, Film[]>,
  );
};

/**
 * Calculates statistics for a collection of films
 */
export const calculateFilmStats = (films: Film[]) => {
  const totalFilms = films.length;
  const filmsWithImages = films.filter((film) => film.image).length;
  const filmsWithScores = films.filter(
    (film) => film.rottenTomatoesScore,
  ).length;
  const averageScore =
    films
      .filter((film) => film.rottenTomatoesScore)
      .reduce(
        (sum, film) => sum + parseInt(film.rottenTomatoesScore || '0'),
        0,
      ) / filmsWithScores || 0;

  return {
    totalFilms,
    filmsWithImages,
    filmsWithScores,
    averageScore: Math.round(averageScore),
    imageCoverage: Math.round((filmsWithImages / totalFilms) * 100),
    scoreCoverage: Math.round((filmsWithScores / totalFilms) * 100),
  };
};

/**
 * Checks if a film has complete data
 */
export const isFilmComplete = (film: Film): boolean => {
  return !!(
    film.id &&
    film.title &&
    film.description &&
    film.director &&
    film.releaseDate &&
    film.runtime &&
    film.image &&
    film.rottenTomatoesScore
  );
};

/**
 * Gets films with missing data
 */
export const getIncompleteFilms = (films: Film[]): Film[] => {
  return films.filter((film) => !isFilmComplete(film));
};

/**
 * Gets films with complete data
 */
export const getCompleteFilms = (films: Film[]): Film[] => {
  return films.filter((film) => isFilmComplete(film));
};
