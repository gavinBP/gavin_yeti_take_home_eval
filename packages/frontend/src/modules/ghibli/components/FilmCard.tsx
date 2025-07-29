import React, { useState } from 'react';
import {
  FilmCardContainer,
  CardFront,
  CardBack,
  CardImage,
  CardTitle,
  CardDescription,
  CardDetails,
  RottenTomatoesScore,
  ImageFallback,
  FallbackText,
  HoverOverlay,
  ArrowIcon,
  BannerImage,
  InfoSubCard,
} from './styled/FilmCard.styled';
import { FALLBACK_TEXT } from '../constants/theme.constants';
import type { FilmCardProps } from '../types/ghibli.types';

const FilmCard: React.FC<FilmCardProps> = ({ film, isExpanded, onToggle }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const formatDetails = () => {
    const details = [];
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

  const handleClick = () => {
    if (!isExpanded) {
      onToggle();
    }
  };

  const handleMouseEnter = () => {
    if (!isExpanded) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Default state: Just the image (290.5px × 368px)
  if (!isExpanded && !isHovered) {
    return (
      <FilmCardContainer
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <CardFront>
          {film.image && !imageError ? (
            <CardImage
              src={film.image}
              alt={film.title}
              onError={handleImageError}
            />
          ) : (
            <ImageFallback>
              <FallbackText>{film.title}</FallbackText>
            </ImageFallback>
          )}
        </CardFront>
      </FilmCardContainer>
    );
  }

  // Hover state: Flat orange background with title and arrow
  if (!isExpanded && isHovered) {
    return (
      <FilmCardContainer
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <HoverOverlay>
          <CardTitle>{film.title}</CardTitle>
          <ArrowIcon>→</ArrowIcon>
        </HoverOverlay>
      </FilmCardContainer>
    );
  }

  // Clicked state: Banner image (top 30%) + white sub-card with details
  return (
    <FilmCardContainer>
      <CardBack>
        {film.image && !imageError ? (
          <BannerImage
            src={film.image}
            alt={film.title}
            onError={handleImageError}
          />
        ) : (
          <ImageFallback sx={{ height: '30%', borderRadius: '8px 8px 0 0' }}>
            <FallbackText>{film.title}</FallbackText>
          </ImageFallback>
        )}
        <InfoSubCard>
          <div>
            <CardTitle>{film.title}</CardTitle>
            <CardDescription>
              {film.description || FALLBACK_TEXT.description}
            </CardDescription>
            <CardDetails>{formatDetails()}</CardDetails>
          </div>
          <RottenTomatoesScore>
            {film.rottenTomatoesScore || FALLBACK_TEXT.rottenTomatoes}
          </RottenTomatoesScore>
        </InfoSubCard>
      </CardBack>
    </FilmCardContainer>
  );
};

export default FilmCard;
