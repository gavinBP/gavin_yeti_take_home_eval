import type { Film } from '../types/ghibli.types';

/**
 * Utility functions for image handling and fallback content
 */

export interface ImageFallbackConfig {
  width: number;
  height: number;
  backgroundColor: string;
  textColor: string;
  fontSize: string;
  borderRadius?: string;
}

export interface FallbackContent {
  title: string;
  description: string;
  rottenTomatoes: string;
  director: string;
  releaseDate: string;
  runtime: string;
}

/**
 * Default fallback content for missing data
 */
export const DEFAULT_FALLBACK_CONTENT: FallbackContent = {
  title: 'Film Title Not Available',
  description: 'Description not available',
  rottenTomatoes: 'Not Available',
  director: 'Director not available',
  releaseDate: 'Release date not available',
  runtime: 'Runtime not available',
};

/**
 * Default image fallback configuration
 */
export const DEFAULT_IMAGE_FALLBACK_CONFIG: ImageFallbackConfig = {
  width: 290.5,
  height: 368,
  backgroundColor: '#000000',
  textColor: '#ffffff',
  fontSize: '1rem',
  borderRadius: '8px',
};

/**
 * Validates if an image URL is valid and accessible
 */
export const isValidImageUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;

  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Creates a fallback image element with the film title
 */
export const createImageFallback = (
  title: string,
  config: Partial<ImageFallbackConfig> = {},
): string => {
  const finalConfig = { ...DEFAULT_IMAGE_FALLBACK_CONFIG, ...config };

  // Create a simple SVG fallback
  const svg = `
    <svg width="${finalConfig.width}" height="${
      finalConfig.height
    }" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${
        finalConfig.backgroundColor
      }" rx="${finalConfig.borderRadius || 0}"/>
      <text x="50%" y="50%" text-anchor="middle" dy="0.35em" 
            fill="${
              finalConfig.textColor
            }" font-family="Montserrat, sans-serif" 
            font-size="${finalConfig.fontSize}" font-weight="500">
        ${title}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Handles image loading errors and returns fallback content
 */
export const handleImageError = (
  film: Film,
  fallbackContent?: Partial<FallbackContent>,
): { hasError: boolean; fallbackTitle: string } => {
  const content = { ...DEFAULT_FALLBACK_CONTENT, ...fallbackContent };

  return {
    hasError: true,
    fallbackTitle: film.title || content.title,
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
 * Preloads an image to check if it's accessible
 */
export const preloadImage = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
};

/**
 * Batch preloads multiple images
 */
export const preloadImages = async (
  urls: string[],
): Promise<Map<string, boolean>> => {
  const results = new Map<string, boolean>();

  const promises = urls.map(async (url) => {
    const isValid = await preloadImage(url);
    results.set(url, isValid);
  });

  await Promise.all(promises);
  return results;
};

/**
 * Gets the appropriate fallback content for a film
 */
export const getFallbackContent = (film: Film): FallbackContent => {
  return {
    title: film.title || DEFAULT_FALLBACK_CONTENT.title,
    description: film.description || DEFAULT_FALLBACK_CONTENT.description,
    rottenTomatoes:
      film.rottenTomatoesScore || DEFAULT_FALLBACK_CONTENT.rottenTomatoes,
    director: film.director || DEFAULT_FALLBACK_CONTENT.director,
    releaseDate: film.releaseDate || DEFAULT_FALLBACK_CONTENT.releaseDate,
    runtime: film.runtime || DEFAULT_FALLBACK_CONTENT.runtime,
  };
};
