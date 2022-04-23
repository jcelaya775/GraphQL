const { UserList, MovieList } = require('../FakeData');
const _ = require('lodash');

const resolvers = {
  Query: {
    users: () => {
      return UserList;
    },
    user: (parent, args) => {
      const id = Number(args.id);
      const user = _.find(UserList, { id });
      return user;
    },
    movies: (parent, args) => {
      return MovieList;
    },
    movie: (parent, args) => {
      const name = args.name;
      return _.find(MovieList, { name });
    },
  },
  User: {
    favoriteMovies: (parent, args) => {
      const movieNames = parent.favoriteMovies;
      if (!movieNames) return null;

      res = [];
      movieNames.forEach((movieName) => {
        res.push(_.find(MovieList, { name: movieName }));
      });
      console.log(res);
      return res;
    },
  },
};

module.exports = { resolvers };
