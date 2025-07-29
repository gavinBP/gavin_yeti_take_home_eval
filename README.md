# Studio Ghibli Film Application

> A responsive React application showcasing Studio Ghibli films with interactive cards, GraphQL backend integration, and mobile-first design.

## 🎬 Project Overview

This application provides an immersive experience for exploring Studio Ghibli films through an interactive, responsive interface. Users can browse films, view detailed information, and enjoy smooth animations across all devices.

### Key Features

- **Interactive Film Cards**: Hover, click, and expanded states with smooth animations
- **Responsive Design**: Mobile-first approach with adaptive grid layouts
- **GraphQL Backend**: Robust API integration with caching and error handling
- **Load More Functionality**: Progressive loading of all 22 Studio Ghibli films
- **Error Boundaries**: Graceful error handling and user feedback
- **Comprehensive Testing**: 42+ unit tests ensuring reliability

## 🚀 Setup Instructions

### Prerequisites

- **Node.js**: Version 20.11 (use `.nvmrc` file)
- **pnpm**: Package manager for dependency management
- **Git**: For cloning the repository
- **Docker**: For running PostgreSQL database

### Installation

1. **Clone the Repository**

   ```bash
   git clone <your-repo-url>
   cd gavin_yeti_take_home_eval
   ```

2. **Install Node.js**

   ```bash
   nvm install 20.11
   nvm use
   ```

3. **Install pnpm**

   ```bash
   npm install -g pnpm
   ```

4. **Install Dependencies**

   ```bash
   pnpm install
   ```

5. **Start PostgreSQL Database**

   ```bash
   docker-compose up -d
   ```

6. **Set Up Environment Variables**
   Create a `.env` file in the `packages/backend` directory:

   ```bash
   cd packages/backend
   echo "DATABASE_URL=postgresql://user:password@localhost:5432/db
   LOG_LEVEL=info
   NODE_ENV=development
   PORT=8080
   GRAPHQL_PATH=/api/graphql" > .env
   ```

7. **Generate Backend Prerequisites** (Required before first run)

   ```bash
   pnpm generate
   ```

8. **Run Database Migrations**

   ```bash
   pnpm migrate
   ```

   **Note**: If migration fails with permission errors, the application can still run without successful migration. The Studio Ghibli API integration works independently of the database.

### Running the Application

1. **Start Backend Server** (in a new terminal)

   ```bash
   cd packages/backend
   pnpm dev
   ```

   **Note**: The backend server will start on port 8080. You should see a message like "🚀 Server ready at http://localhost:8080/api/graphql" when it's ready.

2. **Start Frontend Development Server** (in another terminal)

   ```bash
   cd packages/frontend
   pnpm dev
   ```

   **Note**: The frontend server will start on port 3000. You should see a message like "Local: http://localhost:3000/" when it's ready.

3. **Access the Application**
   - Frontend: http://localhost:3000
   - GraphQL Playground: http://localhost:8080/api/graphql

**Important**: Both servers need to be running simultaneously for the application to work properly. The frontend depends on the backend GraphQL API.

### Troubleshooting

- **Port Conflicts**: Check if ports 3000 or 8080 are already in use
- **Node Version**: Ensure you're using Node.js 20.11 (check with `node --version`)
- **Database Connection Issues**: Ensure Docker is running and PostgreSQL container is up (`docker-compose ps`)
- **Environment Variables**: Make sure `.env` file exists in `packages/backend` directory
- **Migration Errors**: Run `pnpm migrate` in the backend directory if database schema is out of sync
- **Migration Permission Errors**: If `pnpm migrate` fails, the app can still run - the Studio Ghibli API works independently
- **Backend Not Starting**: Make sure you've run `pnpm generate` in the backend directory. Look for the message "🚀 Server ready at http://localhost:8080/api/graphql" to confirm it's running.
- **Frontend Not Loading**: Ensure the backend is running on port 8080 first. The frontend will show errors if it can't connect to the GraphQL API.
- **API Issues**: The app depends on the external Studio Ghibli API - ensure internet connection
- **Missing Dependencies**: If you see import errors, run `pnpm install` in both `packages/backend` and `packages/frontend`
- **GraphQL Schema Errors**: Run `pnpm generate` in the backend directory to regenerate the schema
- **Module Not Found Errors**: Ensure all dependencies are installed with `pnpm install` in the root directory

## 📋 Dev-Tasks Process

### Product Requirements Document (PRD)

We began with a comprehensive PRD that outlined:

- **Core Features**: Film display, interactive cards, responsive design
- **Technical Requirements**: GraphQL backend, React frontend, TypeScript
- **User Experience**: Smooth animations, mobile optimization, error handling

### Task Breakdown & Completion

The project was broken down into 5 major task categories:

#### ✅ Task 1.0 - Backend GraphQL Schema and API Integration (100% Complete)

- GraphQL schema definition with Nexus
- Studio Ghibli API integration
- Error handling and caching
- Comprehensive service architecture

#### ✅ Task 2.0 - Frontend Core Application Structure and Styling (100% Complete)

- React application setup with TypeScript
- Material-UI integration and theming
- Responsive layout and styling
- Core component architecture

#### ✅ Task 3.0 - Interactive Film Card Components and States (100% Complete)

- Interactive film cards with hover/click states
- Smooth animations and transitions
- Mobile-responsive interactions
- Comprehensive unit testing

#### ✅ Task 4.0 - Film Data Management and Caching (100% Complete)

- Apollo Client integration
- Data validation and fallback handling
- Image preloading and optimization
- Error boundaries and offline detection

#### ✅ Task 5.0 - Mobile Responsiveness and Pagination Features (100% Complete)

- Responsive grid layouts (1→2→3→4 columns)
- Pagination system with "Load More" functionality
- Touch-optimized interactions
- Comprehensive mobile testing

## ⏱️ Time Spent

**Total Development Time**: 4 solid hours

### Breakdown:

- **Planning & PRD**: 15 minutes
- **Backend Development**: 1 hour
- **Frontend Core**: 1.5 hours
- **Interactive Components**: 45 minutes
- **Data Management**: 30 minutes
- **Mobile Responsiveness**: 30 minutes
- **Testing & Debugging**: 15 minutes

## 🏗️ Rationale - Technology Choices & Architecture

### Frontend Technologies

- **React 18**: Modern component-based architecture with hooks
- **TypeScript**: Type safety and better developer experience
- **Material-UI (MUI)**: Consistent design system and responsive components
- **Apollo Client**: Robust GraphQL client with caching and error handling
- **Vite**: Fast development server and build tooling

### Backend Technologies

- **Node.js/Express**: Reliable server runtime and web framework
- **GraphQL (Apollo Server)**: Flexible API with strong typing
- **Nexus**: Schema-first GraphQL development
- **TypeScript**: Type safety across the full stack

### Architectural Decisions

- **Monorepo Structure**: Shared dependencies and consistent tooling
- **Service Layer Pattern**: Clean separation of concerns
- **Error Boundaries**: Graceful error handling at component level
- **Responsive Design**: Mobile-first approach with progressive enhancement
- **Caching Strategy**: In-memory caching with TTL for API responses

## 🚧 Challenges Encountered

### 1. Apollo Client State Management

**Challenge**: The `onCompleted` callback wasn't triggering when using `skip: true` with `refetch()`
**Solution**: Implemented manual result processing in the `loadMoreFilms` function

### 2. Mobile Layout Optimization

**Challenge**: Film card content was getting cut off on mobile devices
**Solution**: Added responsive breakpoints and adjusted component dimensions for mobile

### 3. Package Dependencies

**Challenge**: Missing `@mui/icons-material` package causing import errors
**Solution**: Installed the package and updated Material-UI to compatible versions

### 4. GraphQL Query Execution

**Challenge**: Ensuring proper data flow from backend to frontend
**Solution**: Added comprehensive debugging and manual state management

## ⚠️ Limitations

### Current Limitations

- **No Authentication**: User accounts and personalization features not implemented
- **Limited Caching**: No persistent caching across browser sessions
- **No Search/Filter**: Basic browsing only, no search or filtering capabilities
- **No Favorites**: Users cannot save or favorite films
- **No Offline Support**: Application requires internet connection

### Technical Limitations

- **API Rate Limiting**: Dependent on external Studio Ghibli API
- **Image Loading**: No fallback for broken image links beyond basic placeholders
- **Browser Support**: Modern browsers only, no IE11 support

## 🔮 Future Improvements

### Short-term Enhancements (1-2 weeks)

- **Search & Filtering**: Add search functionality and filter by director/year
- **Favorites System**: Allow users to save and organize favorite films
- **Enhanced Animations**: Add more sophisticated micro-interactions
- **Performance Optimization**: Implement virtual scrolling for large film lists

### Medium-term Features (1-2 months)

- **User Authentication**: User accounts with personalized experiences
- **Advanced Caching**: Persistent caching with service workers
- **Offline Support**: Progressive Web App capabilities
- **Social Features**: Share films and create watchlists

### Long-term Vision (3+ months)

- **Film Reviews & Ratings**: Community-driven film reviews
- **Recommendation Engine**: AI-powered film recommendations
- **Multi-language Support**: Internationalization for global users
- **Advanced Analytics**: User behavior tracking and insights

## Assumptions/Trade-Offs

- would've actually preferred to spend more time breaking apart the subtasks even more.
- wouldve liked to create my own standard way of creating PRD/task list formats that had differential formatting for frontend/backend
- would've liked to extend the back and forth conversation and clarification questions with LLM in the beginning of the process. "measure twice == cut once"

## 🧪 Testing

### Test Coverage

- **42+ Unit Tests**: Covering components, hooks, and utilities
- **Component Testing**: FilmCard, FilmButton, ErrorBoundary components
- **Hook Testing**: useGhibliFilms, useFilmPagination
- **Utility Testing**: Data validation, image handling functions

### Running Tests

```bash
# Frontend tests
cd packages/frontend
pnpm test

# Backend tests
cd packages/backend
pnpm test
```

## 📁 Project Structure

```
gavin_yeti_take_home_eval/
├── packages/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── schemaModules/ghibli/    # GraphQL schema
│   │   │   ├── services/                # API services
│   │   │   └── server.ts               # Express server
│   │   └── tests/                      # Backend tests
│   └── frontend/
│       ├── src/
│       │   ├── modules/ghibli/         # Main application
│       │   │   ├── components/         # React components
│       │   │   ├── hooks/              # Custom hooks
│       │   │   ├── utils/              # Utility functions
│       │   │   └── types/              # TypeScript types
│       │   └── apollo/                 # GraphQL client
│       └── tests/                      # Frontend tests
└── tasks/                              # Project documentation
```

## 🤝 Contributing

This project was developed as a take-home evaluation. For future development:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is for evaluation purposes. All Studio Ghibli content and trademarks belong to their respective owners.

---

**Built with ❤️ using React, GraphQL, and the magic of Studio Ghibli films**
