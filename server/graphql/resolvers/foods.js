const { AuthenticationError } = require('apollo-server-express');

const checkAuth = require('../../util/checkAuth');
const Food = require('../../models/Food');

module.exports = {
  Query: {
    getFoods: async () => {
      try {
        const foods = await Food.find();

        return foods;
      } catch (error) {
        throw new Error(error);
      }
    }
  },

  Mutation: {
    createFood: async (_, { name, price }, context) => {
      const { role } = checkAuth(context);

      if (role !== 'Admin') throw new AuthenticationError('Action not allowed');

      if (name.trim() === '' || price.trim() === '') throw new Error('Missing fields');

      const newFood = new Food({
        name,
        price
      });

      const food = await newFood.save();

      return food;
    }
  }
};
