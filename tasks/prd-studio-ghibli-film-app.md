# Product Requirements Document: Studio Ghibli Film Application

## Introduction/Overview

Create a responsive React application that displays Studio Ghibli film information using a GraphQL backend that integrates with the public Studio Ghibli API. The application will feature an interactive card-based interface where users can explore four main Studio Ghibli films (Porco Rosso, Kiki's Delivery Service, Howl's Moving Castle, and My Neighbor Totoro) with smooth animations and detailed film information.

The application solves the problem of providing an engaging, interactive way for users to discover and learn about Studio Ghibli films through a modern web interface that combines beautiful visuals with comprehensive film data.

## Goals

1. **Interactive Film Discovery**: Provide users with an engaging way to explore Studio Ghibli films through interactive cards
2. **Responsive Design**: Ensure the application works seamlessly across all device sizes (320px to desktop)
3. **Smooth User Experience**: Deliver fluid animations and preloaded data for seamless interactions
4. **Comprehensive Film Information**: Display detailed film data including images, descriptions, and ratings
5. **Efficient Data Management**: Implement caching and error handling for reliable API integration
6. **Extended Film Library**: Allow users to explore additional Studio Ghibli films beyond the main four

## User Stories

1. **As a film enthusiast**, I want to see a beautiful cloud-themed interface with Studio Ghibli film cards so that I can immediately understand what the application offers.

2. **As a user**, I want to see four main film buttons initially so that I can choose which Studio Ghibli film to explore first.

3. **As a user**, I want to hover over film cards to see a preview with the title and arrow indicator so that I know I can click for more information.

4. **As a user**, I want to click on a film card to see detailed information including the movie banner, description, director, release date, runtime, and Rotten Tomatoes score so that I can learn comprehensive details about the film.

5. **As a mobile user**, I want to tap anywhere on a card to flip it and see detailed information so that I can easily interact with the application on touch devices.

6. **As a user**, I want to click a "...rest" button to see additional Studio Ghibli films so that I can explore the broader Studio Ghibli library.

7. **As a user**, I want to navigate through additional films using pagination controls so that I can browse large numbers of films efficiently.

8. **As a user**, I want the application to handle missing data gracefully with fallback content so that I always see meaningful information even when API data is incomplete.

## Functional Requirements

### Frontend Requirements

1. **Initial Page Load**: The application must display a cloud-themed background with the header "Discover Studio Ghibli Films" and subtitle "Select a film & hover to learn more" in Montserrat font.

2. **Film Button Display**: The system must display four film buttons initially, each showing the name of one of the specified Studio Ghibli films (Porco Rosso, Kiki's Delivery Service, Howl's Moving Castle, My Neighbor Totoro).

3. **Loading States**: The system must show circular loading icons (preferably from MUI) when film buttons are clicked and data is being fetched.

4. **Default Card State**: When a film button is clicked, the system must replace it with a card showing the movie image from the API's 'image' field.

5. **Hover State**: The system must display only the movie title with an arrow indicator when users hover over cards on desktop.

6. **Click State**: The system must show detailed film information when cards are clicked, including:

   - Top 30% of the movie image as a banner
   - Movie title in bold
   - Film description
   - Runtime, director, and release date in a list format
   - Rotten Tomatoes score with logo

7. **Card Navigation**: The system must provide a way for users to return to the button view from the detailed card view.

8. **Smooth Animations**: The system must implement smooth card flip animations for all state transitions.

9. **Mobile Responsiveness**: The system must reorganize cards into a single column layout on mobile devices and support touch interactions for card flipping.

10. **"...rest" Button**: The system must include an additional button that fetches and displays all remaining Studio Ghibli films using the same card interface.

11. **Pagination Controls**: The system must provide left and right arrow buttons for navigating through additional films in sets of four.

12. **Preloading**: The system must preload all necessary data for visible cards to ensure seamless user interactions.

### Backend Requirements

13. **GraphQL Server**: The system must implement a GraphQL server with resolvers that fetch data from the Studio Ghibli API.

14. **API Integration**: The system must connect to the Studio Ghibli API (https://ghibliapi.vercel.app/) to retrieve film information.

15. **Caching**: The system must cache Studio Ghibli API responses for efficiency.

16. **Error Handling**: The system must implement retry mechanisms with throttling for failed requests and provide fallback content.

17. **Offline Support**: The system must display appropriate messages when users are offline, explaining that internet connection is required.

### Data Requirements

18. **Film Data Fields**: The system must handle and display the following film data fields:

    - Movie image (from 'image' field)
    - Movie title
    - Description
    - Director
    - Release date
    - Runtime
    - Rotten Tomatoes score

19. **Fallback Content**: The system must provide appropriate fallback content for missing data:
    - "Not Available" for missing Rotten Tomatoes scores
    - Black background with centered movie title for missing images
    - Appropriate defaults for other missing fields

## Non-Goals (Out of Scope)

1. **User Authentication**: The application will not require user login or account creation.
2. **Film Reviews**: The application will not include user-generated reviews or ratings.
3. **Video Playback**: The application will not include film trailers or video content.
4. **Social Features**: The application will not include sharing or social media integration.
5. **Advanced Search**: The application will not include search or filtering functionality beyond the main four films and "...rest" button.
6. **Film Purchase/Rental**: The application will not include links to purchase or rent films.
7. **Multi-language Support**: The application will not include internationalization features.

## Design Considerations

### Visual Design

- **Background**: Cloud-themed background using the provided cloud background image
- **Typography**: Montserrat font family for all text elements
- **Color Scheme**: Black text (#000) for primary content, green (#004915) for Rotten Tomatoes scores
- **Card Design**: White cards with rounded borders, specific dimensions (290.5px width, 114px height)

### Layout Specifications

- **Header**: "Discover Studio Ghibli Films" - Width: auto 882px, Height: 20px (adjustable to screen size)
- **Cards**: Width: 290.5px, Height: 114px with rounded borders
- **Mobile Layout**: Single column arrangement for cards on mobile devices
- **Responsive Breakpoint**: Application must work down to 320px width

### CSS Specifications

- **Image Banner**: `width: 290.5px; height: 114px; margin: 0 0 22px; object-fit: contain;`
- **Description Text**: Montserrat, 14px, normal weight, 1.43 line-height, left-aligned
- **Film Details List**: Montserrat, 11px, bold, italic, left-aligned
- **Rotten Tomatoes Score**: Montserrat, 42.5px, 500 weight, green color (#004915)

## Technical Considerations

### Frontend Architecture

- **Framework**: React with TypeScript
- **State Management**: Apollo Client for GraphQL integration
- **UI Components**: Material-UI (MUI) for loading indicators and base components
- **Styling**: CSS modules or styled-components for custom styling
- **Responsive Design**: CSS Grid/Flexbox for responsive layouts

### Backend Architecture

- **GraphQL Server**: Apollo Server or similar GraphQL implementation
- **API Integration**: HTTP client for Studio Ghibli API calls
- **Caching**: In-memory or Redis caching for API responses
- **Error Handling**: Exponential backoff retry mechanism with throttling

### Performance Considerations

- **Image Optimization**: Responsive images and lazy loading for non-visible cards
- **Data Preloading**: Preload data for visible cards to ensure smooth interactions
- **Animation Performance**: Use CSS transforms for smooth card flip animations
- **Bundle Optimization**: Code splitting for efficient loading

## Success Metrics

1. **User Engagement**: Users successfully interact with film cards (hover, click, flip)
2. **Performance**: Page load time under 3 seconds on average connection
3. **Responsiveness**: Application functions smoothly across all target device sizes
4. **Error Handling**: Graceful degradation when API data is missing or unavailable
5. **Animation Smoothness**: Card flip animations run at 60fps without stuttering
6. **Mobile Usability**: Touch interactions work reliably on mobile devices

## Open Questions

1. **Image Optimization**: Should we implement image compression or use specific image formats for optimal loading?
2. **Caching Strategy**: What should be the cache duration for Studio Ghibli API responses?
3. **Error Retry Limits**: How many retry attempts should be made for failed API calls?
4. **Pagination Size**: Should the pagination always show exactly 4 films, or should it be configurable?
5. **Accessibility**: Are there specific accessibility requirements beyond basic ARIA labels?
6. **Analytics**: Should we implement any user interaction tracking for future improvements?
