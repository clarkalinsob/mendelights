const { AuthenticationError } = require('apollo-server-express');

const checkAuth = require('../../util/checkAuth');
const Order = require('../../models/Order');

module.exports = {
  Query: {
    getOrders: async () => {
      try {
        const orders = await Order.find().sort({ createdAt: -1 });

        return orders;
      } catch (error) {
        throw new Eror(error);
      }
    },

    getOrder: async (_, { orderId }) => {
      try {
        const order = Order.findById(orderId);

        if (!order) throw new Error('Order not found');

        return order;
      } catch (error) {
        throw new Error(error);
      }
    },

    getOrderHistory: async (_, __, context) => {
      const { email } = checkAuth(context);

      try {
        const orders = Order.find({ email }).sort({ createdAt: -1 });

        return orders;
      } catch (error) {
        throw new Error(error);
      }
    }
  },

  Mutation: {
    createOrder: async (_, { orderInput: { foods, totalCost } }, context) => {
      const { id, name, email } = checkAuth(context);

      if (foods.length < 1) throw new Error('Foods to order must not be empty');

      const newOrder = new Order({
        foods,
        totalCost,
        status: 'Pending',
        paid: false,
        name,
        email,
        _user: id
      });

      const order = await newOrder.save();

      return order;
    },

    deleteOrder: async (_, { orderId }, context) => {
      const { role } = checkAuth(context);

      if (role !== 'Admin') throw new AuthenticationError('Action not allowed');

      try {
        const order = await Order.findById(orderId);

        if (!order) throw new Error('Order not found');

        await order.delete();

        return 'Order has successfully deleted';
      } catch (error) {
        throw new Error(error);
      }
    },

    updateOrderStatus: async (_, { orderId, status }, context) => {
      const { role } = checkAuth(context);

      if (role !== 'Admin') throw new AuthenticationError('Action not allowed');

      const order = await Order.findById(orderId);

      if (!order) throw new Error('Order not found');

      order.status = status;

      const res = await order.save();
      return res;
    },

    togglePaymentStatus: async (_, { orderId }, context) => {
      const { role } = checkAuth(context);

      if (role !== 'Admin') throw new AuthenticationError('Action not allowed');

      const order = await Order.findById(orderId);

      if (!order) throw new Error('Order not found');

      order.paid = !order.paid;

      const res = await order.save();

      return res;
    }
  }
};
