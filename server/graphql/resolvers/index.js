const usersResolvers = require('./users');
const foodsResolvers = require('./foods');
const ordersResolvers = require('./orders');
const deliveryDateResolvers = require('./deliveryDates');

module.exports = {
  Query: {
    ...usersResolvers.Query,
    ...foodsResolvers.Query,
    ...ordersResolvers.Query,
    ...deliveryDateResolvers.Query
  },

  Mutation: {
    ...usersResolvers.Mutation,
    ...foodsResolvers.Mutation,
    ...ordersResolvers.Mutation,
    ...deliveryDateResolvers.Mutation
  }
};
