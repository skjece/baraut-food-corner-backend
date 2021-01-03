const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const otpSchema = mongoose.Schema({
  msisdn: { type: String, required: true, unique: true },//unique is not validator, reuired is validator
  otp_value: { type: String, required: true },
  isBlocked:{  type: Boolean, required: true },
  blockedTime:{  type: String},
  wrongCount:{type: Number, required: true },
  otpSentCount:{type: Number, required: true }
});

otpSchema.plugin(uniqueValidator);

module.exports = mongoose.model('OTP', otpSchema);
