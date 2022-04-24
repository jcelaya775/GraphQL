const { UserList, MovieList } = require('../FakeData');
const _ = require('lodash');
const { update } = require('lodash');

const resolvers = {
  Query: {
    users: (parent, args, context, info) => {
      if (UserList) return { users: UserList };
      // console.log(context.req.headers);
      // console.log(info);

      return { message: 'Yo, there was an error' }
    },
    user: (parent, args, context, info) => {
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

  Mutation: {
    createUser: (parent, args) => {
      const user = args.input;
      const lastId = UserList[UserList.length - 1].id;
      user.id = lastId + 1;

      UserList.push(user);

      return user;
    },
    updateUsername: (parent, args) => {
      const { id, username } = args.input;

      let updatedUser
      UserList.forEach(user => {
        if (user.id === Number(id)) {
          user.username = username;
          updatedUser = user;
        }
      })

      return updatedUser;
    },
    deleteUser: (parent, args) => {
      const id = args.id;
      _.remove(UserList, (user) => user.id === Number(id));
      return null;
    }
  },

  UsersResult: {
    __resolveType(obj) {
      if (obj.users) return 'UsersSuccessfulResult'; // success

      if (obj.message) return 'UsersErrorResult'; // querying error

      return null; // graphql error
    }
  }
};

module.exports = { resolvers };
