const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    role: String
  },
  { timestamps: true }
);

module.exports = model('User', userSchema);
