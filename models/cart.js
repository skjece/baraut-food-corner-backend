const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");


const cartSchema = mongoose.Schema({
  msisdn: { type: String, required: true, unique: true },
  cart:{type:[]}
});

cartSchema.plugin(uniqueValidator);

module.exports = mongoose.model('CART', cartSchema);
