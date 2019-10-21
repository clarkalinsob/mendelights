const { AuthenticationError } = require('apollo-server-express')

const checkAuth = require('../../util/checkAuth')
const DeliveryDate = require('../../models/DeliveryDate')
const Order = require('../../models/Order')

module.exports = {
  Query: {
    getDeliveryDates: async () => {
      try {
        const deliveryDates = await DeliveryDate.find()
          .populate('orders')
          .sort({ date: -1 })

        return deliveryDates
      } catch (error) {
        throw new Error(error)
      }
    }
  },

  Mutation: {
    createDeliveryDate: async (_, { deliveryDateInput: { date, orderIds } }, context) => {
      const { role } = checkAuth(context)

      if (role !== 'Admin') throw new AuthenticationError('Action not allowed')
      if (date.trim() === '') throw new Error('Date must not be empty')

      const parsedOrderIds = JSON.parse(orderIds)
      if (parsedOrderIds.length < 1) throw new Error('Orders must not be empty')

      const deliveryDate = await DeliveryDate.findOne({ date })

      if (deliveryDate) throw new Error('Delivery date already exist')

      let newOrderIds = []
      parsedOrderIds.forEach(order => {
        newOrderIds.push(order.id)
      })
      const newDeliveryDate = new DeliveryDate({
        date,
        orders: newOrderIds
      })

      await Order.updateMany(
        { _id: { $in: newOrderIds } },
        { $set: { deliveryDate: date } },
        { upsert: true }
      )

      const res = await newDeliveryDate.save()
      const orders = await Order.find({ _id: { $in: newOrderIds } })

      return {
        id: res._id,
        date: res.date,
        orders
      }
    },

    editDeliveryDate: async (_, { deliveryDateId, date }, context) => {
      const { role } = checkAuth(context)

      if (role !== 'Admin') throw new AuthenticationError('Action not allowed')
      if (date.trim() === '') throw new Error('Date must not be empty')

      const deliveryDate = await DeliveryDate.findById(deliveryDateId)

      if (!deliveryDate) throw new Error('Delivery date not found')

      deliveryDate.date = date

      // TODO: pull selected order within delivery date

      const res = await deliveryDate.save()

      return res
    },

    deleteDeliveryDate: async (_, { deliveryId }, context) => {
      const { role } = checkAuth(context)

      if (role !== 'Admin') throw new AuthenticationError('Action not allowed')

      try {
        const deliveryDate = await DeliveryDate.findById(deliveryId)

        if (!deliveryDate) throw new Error('Delivery date not found')

        await deliveryDate.delete()

        // TODO: delete all delivery date assign to each orders

        //

        return 'Delivery date has successfully deleted'
      } catch (error) {
        throw new Error(error)
      }
    }
  }
}
