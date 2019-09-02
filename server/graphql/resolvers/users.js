const { UserInputError } = require('apollo-server-express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');
const { SECRET_KEY } = require('../../config');
const { validateSignupInput, validateSigninInput } = require('../../util/validators');

const generateToken = user => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    SECRET_KEY,
    { expiresIn: '24h' }
  );
};

module.exports = {
  Query: {
    getUsers: async () => {
      try {
        const users = User.find();

        return users;
      } catch (error) {
        throw new Error(error);
      }
    }
  },

  Mutation: {
    createUser: async (_, { signupInput: { name, email, password, confirmPassword } }) => {
      const { errors, valid } = validateSignupInput(name, email, password, confirmPassword);

      if (!valid) throw new UserInputError('Validation failed', { errors });

      const user = await User.findOne({ email });

      if (user) {
        throw new UserInputError('Email is taken', {
          errors: { email: 'Email is taken' }
        });
      }

      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        name,
        email,
        password,
        role: 'Admin'
      });

      const res = await newUser.save();
      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token
      };
    },

    signinUser: async (_, { email, password }) => {
      const { errors, valid } = validateSigninInput(email, password);

      if (!valid) {
        throw new UserInputError('Validation failed', { errors });
      }

      const user = await User.findOne({ email });

      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        errors.general = 'Wrong password';
        throw new UserInputError('Wrong password', { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user.id,
        token
      };
    }
  }
};
