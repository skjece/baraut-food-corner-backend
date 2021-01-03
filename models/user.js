const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  msisdn: { type: String, required: true, unique: true },//unique is not validator, reuired is validator
  name: { type: String, required: true },
  merchant_id: { type: String }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
