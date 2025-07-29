import { objectType } from 'nexus';

export const Film = objectType({
  name: 'Film',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('title');
    t.string('description');
    t.string('director');
    t.string('releaseDate');
    t.string('runtime');
    t.string('image');
    t.string('movieBanner');
    t.string('rottenTomatoesScore');
  },
});
