const { Schema, model } = require('mongoose');

const foodSchema = new Schema(
  {
    name: String,
    price: Number,
    _user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

module.exports = model('Food', foodSchema);
