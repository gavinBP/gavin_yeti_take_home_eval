# Task List: Studio Ghibli Film Application

## Relevant Files

- `packages/backend/src/schemaModules/ghibli/index.ts` - GraphQL schema definitions for Studio Ghibli films
- `packages/backend/src/schemaModules/ghibli/queries.ghibliSchema.ts` - GraphQL queries for fetching film data
- `packages/backend/src/schemaModules/ghibli/objectTypes.ghibliSchema.ts` - GraphQL object types for film data
- `packages/backend/src/services/GhibliAPI/GhibliAPI.service.ts` - Service for integrating with Studio Ghibli API
- `packages/backend/src/services/GhibliAPI/GhibliAPI.service.test.ts` - Unit tests for GhibliAPI service
- `packages/frontend/src/modules/ghibli/GhibliApp.tsx` - Main application component
- `packages/frontend/src/modules/ghibli/GhibliApp.test.tsx` - Unit tests for main component
- `packages/frontend/src/modules/ghibli/components/FilmCard.tsx` - Interactive film card component
- `packages/frontend/src/modules/ghibli/components/FilmCard.test.tsx` - Unit tests for film card component
- `packages/frontend/src/modules/ghibli/components/FilmButton.tsx` - Film button component
- `packages/frontend/src/modules/ghibli/components/FilmButton.test.tsx` - Unit tests for film button component
- `packages/frontend/src/modules/ghibli/components/PaginationControls.tsx` - Pagination controls component
- `packages/frontend/src/modules/ghibli/components/PaginationControls.test.tsx` - Unit tests for pagination component
- `packages/frontend/src/modules/ghibli/hooks/useGhibliFilms.ts` - Custom hook for film data management
- `packages/frontend/src/modules/ghibli/hooks/useGhibliFilms.test.ts` - Unit tests for custom hook
- `packages/frontend/src/modules/ghibli/styles/GhibliApp.styles.ts` - Styled components for main app
- `packages/frontend/src/modules/ghibli/styles/FilmCard.styles.ts` - Styled components for film cards
- `packages/frontend/src/modules/ghibli/types/ghibli.types.ts` - TypeScript type definitions
- `packages/frontend/src/modules/ghibli/utils/imageUtils.ts` - Utility functions for image handling
- `packages/frontend/src/modules/ghibli/utils/imageUtils.test.ts` - Unit tests for image utilities
- `packages/frontend/src/modules/ghibli/utils/fallbackUtils.ts` - Utility functions for fallback content
- `packages/frontend/src/modules/ghibli/utils/fallbackUtils.test.ts` - Unit tests for fallback utilities

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `FilmCard.tsx` and `FilmCard.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [ ] 1.0 Backend GraphQL Schema and API Integration

  - [x] 1.1 Create GraphQL object types for Studio Ghibli film data (Film type with all required fields)
  - [x] 1.2 Implement GraphQL queries for fetching individual films by ID and all films
  - [x] 1.3 Create GhibliAPI service to integrate with Studio Ghibli API (https://ghibliapi.vercel.app/)
  - [x] 1.4 Implement caching mechanism for API responses using in-memory or Redis
  - [x] 1.5 Add error handling with retry mechanisms and throttling for failed requests
  - [x] 1.6 Create GraphQL resolvers that connect to the GhibliAPI service
  - [x] 1.7 Add the ghibli schema module to the main GraphQL schema
  - [x] 1.8 Write unit tests for GhibliAPI service and GraphQL resolvers

- [ ] 2.0 Frontend Core Application Structure and Styling

  - [x] 2.1 Create main GhibliApp component with cloud background theme
  - [x] 2.2 Implement header "Discover Studio Ghibli Films" with Montserrat font styling
  - [x] 2.3 Add subtitle "Select a film & hover to learn more" with proper typography
  - [x] 2.4 Set up responsive layout using CSS Grid/Flexbox for card arrangement
  - [x] 2.5 Create styled components for consistent theming (colors, typography, spacing)
  - [x] 2.6 Implement cloud background image integration
  - [x] 2.7 Set up Apollo Client configuration for GraphQL integration
  - [x] 2.8 Create TypeScript type definitions for film data
  - [x] 2.9 Write unit tests for main application component

- [x] 3.0 Interactive Film Card Components and States

  - [x] 3.1 Create FilmButton component for initial film selection (4 main films)
  - [x] 3.2 Implement FilmCard component with three states: default, hover, and clicked
  - [x] 3.3 Add smooth card flip animations using CSS transforms
  - [x] 3.4 Implement default state showing movie image from API 'image' field
  - [x] 3.5 Create hover state showing only title with arrow indicator
  - [x] 3.6 Build clicked state with detailed information layout:
    - [x] 3.6.1 Top 30% of movie image as banner
    - [x] 3.6.2 Movie title in bold Montserrat font
    - [x] 3.6.3 Film description with specified CSS styling
    - [x] 3.6.4 Runtime, director, release date list with italic styling
    - [x] 3.6.5 Rotten Tomatoes score with logo and green color (#004915)
  - [x] 3.7 Add navigation functionality to return from detailed view to button view
  - [x] 3.8 Implement loading states with MUI circular loading indicators
  - [x] 3.9 Create utility functions for image handling and fallback content
  - [x] 3.10 Write comprehensive unit tests for all card components and states

- [x] 4.0 Film Data Management and Caching

  - [x] 4.1 Create useGhibliFilms custom hook for data management
  - [x] 4.2 Implement data preloading for visible cards to ensure smooth interactions
  - [x] 4.3 Add fallback content handling for missing API data:
    - [x] 4.3.1 "Not Available" for missing Rotten Tomatoes scores
    - [x] 4.3.2 Black background with centered title for missing images
    - [x] 4.3.3 Appropriate defaults for other missing fields
  - [x] 4.4 Implement offline detection and user messaging
  - [x] 4.5 Add error boundaries for graceful error handling
  - [x] 4.6 Create utility functions for data validation and transformation
  - [x] 4.7 Write unit tests for custom hook and utility functions

- [x] 5.0 Mobile Responsiveness and Pagination Features
  - [x] 5.1 Implement responsive breakpoints for mobile devices (320px to desktop)
  - [x] 5.2 Create single column layout for cards on mobile devices
  - [x] 5.3 Add touch interaction support for card flipping on mobile
  - [x] 5.4 Implement "...rest" button to fetch additional Studio Ghibli films
  - [x] 5.5 Create PaginationControls component with left/right arrow navigation
  - [x] 5.6 Implement pagination logic to show films in sets of four
  - [x] 5.7 Add smooth transitions for pagination navigation
  - [x] 5.8 Ensure all interactive elements are touch-friendly on mobile
  - [x] 5.9 Test responsive design across different screen sizes
  - [x] 5.10 Write unit tests for pagination components and mobile interactions
