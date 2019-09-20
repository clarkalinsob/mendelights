const { AuthenticationError } = require('apollo-server-express');

const checkAuth = require('../../util/checkAuth');
const Food = require('../../models/Food');

module.exports = {
  Query: {
    getFoods: async () => {
      try {
        const foods = await Food.find().sort({ createdAt: -1 });

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
      if (name.trim() === '') throw new Error('Name must not be empty');
      if (price.trim() === '') throw new Error('Price must not be empty');

      const newFood = new Food({
        name,
        price
      });

      const food = await newFood.save();

      return food;
    },

    editFood: async (_, { foodId, name, price }, context) => {
      const { role } = checkAuth(context);

      if (role !== 'Admin') throw new AuthenticationError('Action not allowed');
      if (name.trim() === '') throw new Error('Name must not be empty');
      if (price.trim() === '') throw new Error('Price must not be empty');

      const food = await Food.findById(foodId);

      if (!food) throw new Error('Food not found');

      food.name = name;
      food.price = price;

      const res = await food.save();

      return res;
    },

    deleteFood: async (_, { name }, context) => {
      const { role } = checkAuth(context);

      if (role !== 'Admin') throw new AuthenticationError('Action not allowed');
      if (name.trim() === '') throw new Error('Name must not be empty');

      try {
        const food = await Food.findOne({ name });

        if (!food) throw new Error('Food not found');

        await food.delete();

        return `${name} has successfully deleted`;
      } catch (error) {
        throw new Error(error);
      }
    }
  }
};
