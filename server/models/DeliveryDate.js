const { model, Schema } = require('mongoose');

const deliveryDateSchema = new Schema({
  date: Date,
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Order'
    }
  ]
});

module.exports = model('DeliveryDate', deliveryDateSchema);
