const { AuthenticationError } = require("apollo-server-express")
const { User } = require("../models")
const { signToken } = require("../utils/auth")

const resolvers = {
    Query: {
      me: async (parent, args, context) => {
        if (context.user) {
        const user = await User.findOne({ _id: context.user._id }).select("-__v -password");
        return user;
        } throw new AuthenticationError("You need to be logged in!")
      },
    },
    Mutation: {
      login: async (parent, {email, password}) => {
        const user = await User.findOne({email});
            const userPass = await user.isCorrectPassword(password);
            if (!userPass) {
              throw new AuthenticationError("Incorrect credentials");
            }
            if (!user) {
              throw new AuthenticationError("Incorrect credentials");
            }
            const token = signToken(user)
            return { token, user };
    },

    addUser: async (parent, args) => {
      console.log("adding user")
        const user = await User.create(args);
        const token = signToken(user);
        console.log(token)
        console.log(user)
        return { token, user };
    },

      saveBook: async (parent, { bookData }, context) => {
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: bookData} },
          { new: true }
        )
        return user;
      },

        removeBook: async (parent, { bookId }, context) => {
            const user = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId } } },
                { new: true }
            )
            return user;
        }
    },
  };

module.exports = resolvers;