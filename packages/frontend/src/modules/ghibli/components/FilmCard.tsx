import React, { useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import {
  FilmCardContainer,
  CardImage,
  CardTitle,
  ImageFallback,
  FallbackText,
  HoverOverlay,
  ArrowIcon,
  InfoPopup,
} from './styled/FilmCard.styled';
import { FALLBACK_TEXT } from '../constants/theme.constants';
import type { FilmCardProps } from '../types/ghibli.types';

const FilmCard: React.FC<FilmCardProps> = ({
  film,
  isExpanded,
  onToggle,
  hoverColor = '#FF8C42',
  isLoading = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleClick = () => {
    if (!isLoading) {
      onToggle();
    }
  };

  const handleMouseEnter = () => {
    if (!isExpanded && !isLoading) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isLoading) {
      setIsHovered(false);
    }
  };

  return (
    <FilmCardContainer
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Loading state */}
      {isLoading ? (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '8px',
          }}
        >
          <CircularProgress
            size={40}
            sx={{ color: '#000000', marginBottom: 2 }}
          />
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(0, 0, 0, 0.6)',
              fontSize: '0.9rem',
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            Loading...
          </Typography>
        </Box>
      ) : (
        <>
          {/* Background image - always visible */}
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
        </>
      )}

      {/* Hover overlay - only when not expanded and hovered */}
      {!isExpanded && isHovered && (
        <HoverOverlay sx={{ backgroundColor: hoverColor }}>
          <CardTitle>{film.title}</CardTitle>
          <ArrowIcon>→</ArrowIcon>
        </HoverOverlay>
      )}

      {/* Info popup - only when expanded */}
      {isExpanded && (
        <InfoPopup>
          {/* Description Content */}
          <Box className="description-content">
            <Typography
              sx={{
                width: 'calc(100% - 43.5px)', // Fill available space minus left + right margins
                height: '80px',
                margin: '22px 22.5px 13px 21px',
                fontFamily: 'Montserrat',
                fontSize: '14px',
                fontWeight: 'normal',
                fontStretch: 'normal',
                fontStyle: 'normal',
                lineHeight: 1.43,
                letterSpacing: 'normal',
                textAlign: 'left',
                color: '#000',
                overflow: 'auto',
                overflowY: 'scroll',
                // Mobile responsive adjustments
                '@media (max-width: 768px)': {
                  width: 'calc(100% - 32px)', // Fill available space minus left + right margins
                  margin: '16px 16px 10px 16px',
                },
                '@media (max-width: 480px)': {
                  width: 'calc(100% - 24px)', // Fill available space minus left + right margins
                  margin: '12px 12px 8px 12px',
                },
              }}
            >
              <Box component="span" sx={{ fontWeight: 'bold' }}>
                {film.title}
              </Box>
              <br />
              {film.description || FALLBACK_TEXT.description}
            </Typography>
          </Box>

          {/* List Content */}
          <Box className="list-content">
            <Typography
              sx={{
                width: '247px',
                height: '39px',
                margin: '13px 22.5px 28px 21px',
                fontFamily: 'Montserrat',
                fontSize: '11px',
                fontWeight: 'bold',
                fontStretch: 'normal',
                fontStyle: 'italic',
                lineHeight: 'normal',
                letterSpacing: 'normal',
                textAlign: 'left',
                color: '#000',
                // Mobile responsive adjustments
                '@media (max-width: 768px)': {
                  width: '220px',
                  margin: '10px 16px 20px 16px',
                },
                '@media (max-width: 480px)': {
                  width: '200px',
                  margin: '8px 12px 16px 12px',
                },
              }}
            >
              {film.runtime && (
                <>
                  Runtime:{' '}
                  <Box component="span" sx={{ fontWeight: 'normal' }}>
                    {film.runtime}
                  </Box>
                  <br />
                </>
              )}
              {film.director && (
                <>
                  Director:{' '}
                  <Box component="span" sx={{ fontWeight: 'normal' }}>
                    {film.director}
                  </Box>
                  <br />
                </>
              )}
              {film.releaseDate && (
                <>
                  Release:{' '}
                  <Box component="span" sx={{ fontWeight: 'normal' }}>
                    {film.releaseDate}
                  </Box>
                </>
              )}
            </Typography>
          </Box>

          {/* Score Content */}
          <Box
            className="score-content"
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: '21px',
              // Mobile responsive adjustments - reduce bottom margin
              '@media (max-width: 768px)': {
                marginLeft: '16px',
                marginBottom: '8px',
              },
              '@media (max-width: 480px)': {
                marginLeft: '12px',
                marginBottom: '6px',
              },
            }}
          >
            <img
              src="/tomato@2x.png"
              alt="Rotten Tomatoes"
              style={{ width: '24px', height: '24px' }}
            />
            <Typography
              sx={{
                width: '90px',
                height: '61px',
                flexGrow: 0,
                margin: '0 0 0 12px',
                fontFamily: 'Montserrat',
                fontSize: '42.5px',
                fontWeight: 500,
                fontStretch: 'normal',
                fontStyle: 'normal',
                lineHeight: 1.43,
                letterSpacing: 'normal',
                textAlign: 'left',
                color: '#004915',
              }}
            >
              {film.rottenTomatoesScore || FALLBACK_TEXT.rottenTomatoes}
            </Typography>
          </Box>
        </InfoPopup>
      )}
    </FilmCardContainer>
  );
};

export default FilmCard;
