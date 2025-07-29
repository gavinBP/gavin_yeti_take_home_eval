import { extendType, nonNull, stringArg, list } from 'nexus';
import { GhibliAPIService } from '../../services/GhibliAPI/GhibliAPI.service';

// Create a singleton instance of the GhibliAPI service
const ghibliService = new GhibliAPIService();

export const GhibliQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('film', {
      type: 'Film',
      args: { id: nonNull(stringArg()) },
      async resolve(_root, { id }) {
        try {
          const film = await ghibliService.getFilmById(id);

          if (!film) {
            return null;
          }

          // Transform API response to GraphQL schema
          return {
            id: film.id,
            title: film.title,
            description: film.description,
            director: film.director,
            releaseDate: film.release_date,
            runtime: film.running_time ? `${film.running_time} min` : null,
            image: film.image,
            movieBanner: film.movie_banner,
            rottenTomatoesScore: film.rt_score,
          };
        } catch (error) {
          console.error(`Error in film resolver for ID ${id}:`, error);
          return null;
        }
      },
    });

    t.field('films', {
      type: list('Film'),
      async resolve() {
        try {
          const films = await ghibliService.getMainFilms();

          // Transform API response to GraphQL schema
          return films.map((film) => ({
            id: film.id,
            title: film.title,
            description: film.description,
            director: film.director,
            releaseDate: film.release_date,
            runtime: film.running_time ? `${film.running_time} min` : null,
            image: film.image,
            movieBanner: film.movie_banner,
            rottenTomatoesScore: film.rt_score,
          }));
        } catch (error) {
          console.error('Error in films resolver:', error);
          return [];
        }
      },
    });

    t.field('allFilms', {
      type: list('Film'),
      async resolve() {
        try {
          const films = await ghibliService.getAllFilms();

          // Transform API response to GraphQL schema
          return films.map((film) => ({
            id: film.id,
            title: film.title,
            description: film.description,
            director: film.director,
            releaseDate: film.release_date,
            runtime: film.running_time ? `${film.running_time} min` : null,
            image: film.image,
            movieBanner: film.movie_banner,
            rottenTomatoesScore: film.rt_score,
          }));
        } catch (error) {
          console.error('Error in allFilms resolver:', error);
          return [];
        }
      },
    });
  },
});
