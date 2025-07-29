import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { FILM_IDS, FALLBACK_TEXT } from '../constants/theme.constants';
import type { Film, UseGhibliFilmsReturn } from '../types/ghibli.types';

const GET_FILM_BY_ID = gql`
  query GetFilmById($id: String!) {
    film(id: $id) {
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

const GET_ALL_FILMS = gql`
  query GetAllFilms {
    allFilms {
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

export const useGhibliFilms = (): UseGhibliFilmsReturn => {
  const [films, setFilms] = useState<Film[]>([]);
  const [allFilms, setAllFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [hasLoadedAllFilms, setHasLoadedAllFilms] = useState(false);

  // Utility functions for data validation and fallback handling
  const validateAndEnhanceFilm = useCallback((film: Film): Film => {
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
  }, []);

  const preloadFilmImages = useCallback(async (films: Film[]) => {
    const imageUrls = films
      .map((film) => film.image)
      .filter(Boolean) as string[];

    if (imageUrls.length === 0) {
      return;
    }

    // Preload images in the background
    const preloadPromises = imageUrls.map((url) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Don't fail on image load errors
        img.src = url;
      });
    });

    // Don't await - let it happen in background
    Promise.all(preloadPromises).catch(() => {
      // Silently handle any preload errors
    });
  }, []);

  // Create film objects for the main four films with fallback data
  const mainFilms: Film[] = useMemo(
    () => [
      {
        id: FILM_IDS.porcoRosso,
        title: 'Porco Rosso',
        description:
          'A bounty hunting seaplane pilot fights air pirates in the Adriatic Sea.',
        director: 'Hayao Miyazaki',
        releaseDate: '1992',
        runtime: '94 min',
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
        rottenTomatoesScore: '98',
      },
      {
        id: FILM_IDS.howlsCastle,
        title: "Howl's Moving Castle",
        description:
          'A young woman is cursed by a witch and seeks refuge in a magical castle.',
        director: 'Hayao Miyazaki',
        releaseDate: '2004',
        runtime: '119 min',
        rottenTomatoesScore: '87',
      },
      {
        id: FILM_IDS.totoro,
        title: 'My Neighbor Totoro',
        description:
          'Two sisters discover a magical forest spirit while their mother is in the hospital.',
        director: 'Hayao Miyazaki',
        releaseDate: '1988',
        runtime: '86 min',
        rottenTomatoesScore: '93',
      },
    ],
    [],
  );

  const {
    data: filmsData,
    loading: filmsLoading,
    error: filmsError,
    refetch,
  } = useQuery(GET_MAIN_FILMS, {
    onCompleted: (data) => {
      if (data?.films && data.films.length > 0) {
        // Validate and enhance the films with fallback data
        const enhancedFilms = data.films.map(validateAndEnhanceFilm);
        setFilms(enhancedFilms);
        setError(null);

        // Preload images for smooth interactions
        preloadFilmImages(enhancedFilms);
      } else {
        // If no films returned, use the main films as fallback
        setFilms(mainFilms);
        preloadFilmImages(mainFilms);
      }
    },
    onError: (error) => {
      console.error('GraphQL error:', error);
      // On error, use the main films as fallback
      setFilms(mainFilms);
      setError(error.message);
      preloadFilmImages(mainFilms);
    },
  });

  const {
    data: allFilmsData,
    loading: allFilmsLoading,
    error: allFilmsError,
    refetch: refetchAllFilms,
  } = useQuery(GET_ALL_FILMS, {
    skip: true, // Don't load all films initially
    onCompleted: (data) => {
      if (data?.allFilms && data.allFilms.length > 0) {
        const enhancedAllFilms = data.allFilms.map(validateAndEnhanceFilm);
        setAllFilms(enhancedAllFilms);
        setHasLoadedAllFilms(true);
        preloadFilmImages(enhancedAllFilms);
      }
    },
    onError: (error) => {
      console.error('GraphQL error loading all films:', error);
      setError(error.message);
    },
  });

  useEffect(() => {
    setLoading(filmsLoading);
  }, [filmsLoading]);

  // Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial state
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (filmsError) {
      setError(filmsError.message);
    }
  }, [filmsError]);

  const refetchFilms = useCallback(() => {
    refetch();
  }, [refetch]);

  const loadMoreFilms = useCallback(async () => {
    setLoadingMore(true);
    try {
      const result = await refetchAllFilms();

      // Manually process the result since onCompleted might not be called with skip: true
      if (result.data?.allFilms && result.data.allFilms.length > 0) {
        const enhancedAllFilms = result.data.allFilms.map(
          validateAndEnhanceFilm,
        );
        setAllFilms(enhancedAllFilms);
        setHasLoadedAllFilms(true);
        preloadFilmImages(enhancedAllFilms);
      }
    } catch (error) {
      console.error('Error loading more films:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [refetchAllFilms]);

  // Return validated films with fallback data
  const validatedFilms = useMemo(() => {
    return films.length > 0 ? films : mainFilms;
  }, [films, mainFilms]);

  const allAvailableFilms = useMemo(() => {
    return allFilms.length > 0 ? allFilms : validatedFilms;
  }, [allFilms, validatedFilms]);

  return {
    films: validatedFilms,
    allFilms: allAvailableFilms,
    loading,
    loadingMore,
    error,
    refetch: refetchFilms,
    loadMoreFilms,
    hasLoadedAllFilms,
    isOffline,
  };
};
