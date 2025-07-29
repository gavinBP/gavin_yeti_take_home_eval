import React, { useState } from 'react';
import { Box, Typography, Container, Alert } from '@mui/material';
import FilmCard from './components/FilmCard';
import FilmButton from './components/FilmButton';
import GhibliErrorBoundary from './components/GhibliErrorBoundary';
import { useGhibliFilms } from './hooks/useGhibliFilms';
import type { Film } from './types/ghibli.types';

interface GhibliAppProps {
  // Props will be added as we implement more features
}

const GhibliApp: React.FC<GhibliAppProps> = () => {
  const { films, error, loading } = useGhibliFilms();
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const handleCardToggle = (filmId: string) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(filmId)) {
        newSet.delete(filmId);
      } else {
        newSet.add(filmId);
      }
      return newSet;
    });
  };

  const renderFilmComponent = (film: Film, index: number) => {
    const isExpanded = expandedCards.has(film.id);

    // Define unique hover colors for each card
    const hoverColors = ['#d79a68', '#c24646', '#279094', '#3e6cac'];
    const hoverColor = hoverColors[index % hoverColors.length];

    // If loading, show FilmButton with loading state
    if (loading) {
      return (
        <FilmButton
          key={film.id}
          film={film}
          onClick={() => handleCardToggle(film.id)}
          isLoading={true}
        />
      );
    }

    // If expanded, show FilmCard with expanded state
    if (isExpanded) {
      return (
        <FilmCard
          key={film.id}
          film={film}
          isExpanded={true}
          onToggle={() => handleCardToggle(film.id)}
          hoverColor={hoverColor}
        />
      );
    }

    // Default state: show FilmCard in default state
    return (
      <FilmCard
        key={film.id}
        film={film}
        isExpanded={false}
        onToggle={() => handleCardToggle(film.id)}
        hoverColor={hoverColor}
      />
    );
  };

  return (
    <GhibliErrorBoundary>
      <Box
        sx={{
          minHeight: '100vh',
          background:
            'linear-gradient(135deg, #87CEEB 0%, #B0E0E6 50%, #E0F6FF 100%)',
          backgroundImage: 'url("/cloud_background.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.05)',
            zIndex: 1,
          },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            position: 'relative',
            zIndex: 2,
            paddingTop: { xs: 2, sm: 3, md: 4 },
            paddingBottom: { xs: 2, sm: 3, md: 4 },
            paddingX: { xs: 1, sm: 2, md: 3 },
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              fontWeight: 700,
              color: '#000000',
              marginBottom: 2,
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            🎬 Discover Studio Ghibli Films 🎬
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.2rem' },
              fontWeight: 400,
              color: '#000000',
              marginBottom: 6,
              opacity: 0.8,
            }}
          >
            Select a film & hover to learn more
          </Typography>

          {error && (
            <Alert severity="error" sx={{ marginBottom: 3 }}>
              {error}
            </Alert>
          )}

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: { xs: 1.5, sm: 2, md: 3 },
              maxWidth: '1200px',
              margin: '0 auto',
              padding: { xs: 1, sm: 2 },
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {films.map((film, index) => renderFilmComponent(film, index))}
          </Box>

          {/* Test message to verify component is loading */}
          <Typography
            sx={{
              position: 'fixed',
              top: '10px',
              right: '10px',
              backgroundColor: 'rgba(0, 255, 0, 0.8)',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '5px',
              fontSize: '12px',
              zIndex: 1000,
            }}
          >
            ✅ GhibliApp Loaded!
          </Typography>
        </Container>
      </Box>
    </GhibliErrorBoundary>
  );
};

export default GhibliApp;
