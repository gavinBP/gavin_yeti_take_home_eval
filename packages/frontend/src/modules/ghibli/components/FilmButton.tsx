import React, { useState } from 'react';
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
        {isLoading && <LoadingSpinner size={20} />}
        {!isLoading && (
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
