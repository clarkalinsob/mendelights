const { AuthenticationError } = require('apollo-server-express');

const checkAuth = require('../../util/checkAuth');
const DeliveryDate = require('../../models/DeliveryDate');
const Order = require('../../models/Order');

module.exports = {
  Query: {
    getDeliveryDates: async () => {
      try {
        const deliveryDates = DeliveryDate.find().sort({ date: -1 });

        return deliveryDates;
      } catch (error) {
        throw new Error(error);
      }
    }
  },

  Mutation: {
    createDeliveryDate: async (_, { deliveryDateInput: { date, orderIds } }, context) => {
      const { role } = checkAuth(context);

      if (role !== 'Admin') throw new AuthenticationError('Action not allowed');

      if (date.trim() === '') throw new Error('Date must not be empty');

      if (orderIds.length < 1) throw new Error('Orders must not be empty');

      const deliveryDate = await DeliveryDate.findOne({ date });

      if (deliveryDate) throw new Error('Delivery date already exist');

      const newDeliveryDate = new DeliveryDate({
        date,
        orderIds
      });

      await Order.updateMany(
        { _id: { $in: orderIds } },
        { $set: { deliveryDate: date } },
        { upsert: true }
      );

      const res = await newDeliveryDate.save();
      const orders = await Order.find({ _id: { $in: orderIds } });

      return {
        id: res._id,
        date,
        orders
      };
    }
  }
};
