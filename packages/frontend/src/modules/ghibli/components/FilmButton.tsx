import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import {
  FilmButtonContainer,
  LoadingSpinner,
  ButtonContent,
  FilmImage,
  ImageFallback,
  FallbackText,
} from './styled/FilmButton.styled';

import type { FilmButtonProps } from '../types/ghibli.types';

const FilmButton: React.FC<FilmButtonProps> = ({
  film,
  onClick,
  isLoading = false,
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <FilmButtonContainer
      onClick={onClick}
      disabled={isLoading}
      variant="text"
      fullWidth
    >
      <ButtonContent>
        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <LoadingSpinner size={32} />
            <Typography
              variant="body2"
              sx={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '0.9rem' }}
            >
              Loading...
            </Typography>
          </Box>
        ) : (
          <>
            {film.image && !imageError ? (
              <FilmImage
                src={film.image}
                alt={film.title}
                onError={handleImageError}
              />
            ) : (
              <ImageFallback>
                <FallbackText>{film.title}</FallbackText>
              </ImageFallback>
            )}
          </>
        )}
      </ButtonContent>
    </FilmButtonContainer>
  );
};

export default FilmButton;
