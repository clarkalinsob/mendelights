const { model, Schema } = require('mongoose');

const orderSchema = new Schema(
  {
    foods: [
      {
        name: String,
        quantity: Number,
        price: Number,
        cost: Number
      }
    ],
    totalCost: Number,
    deliveryDate: Date,
    status: String,
    paid: {
      type: Boolean,
      default: false
    },
    name: String,
    email: String,
    _user: {
      type: Schema.Types.ObjectId
    }
  },
  { timestamps: true }
);

module.exports = model('Order', orderSchema);
