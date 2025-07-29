import React from 'react';
import {
  FilmButtonContainer,
  LoadingSpinner,
  ButtonContent,
} from './styled/FilmButton.styled';
import { FILM_TITLES } from '../constants/theme.constants';
import type { FilmButtonProps } from '../types/ghibli.types';

const FilmButton: React.FC<FilmButtonProps> = ({
  film,
  onClick,
  isLoading = false,
}) => {
  return (
    <FilmButtonContainer
      onClick={onClick}
      disabled={isLoading}
      variant="text"
      fullWidth
    >
      <ButtonContent>
        {isLoading && <LoadingSpinner size={20} />}
        {FILM_TITLES[film.id as keyof typeof FILM_TITLES] || film.title}
      </ButtonContent>
    </FilmButtonContainer>
  );
};

export default FilmButton;
