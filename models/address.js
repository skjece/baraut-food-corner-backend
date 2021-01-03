const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const addressSchema = mongoose.Schema({
  msisdn: { type: String, required: true},//unique is not validator, reuired is validator
  name: { type: String, required: true },
  address:{type: String, required: true},
  street:{type: String},
  alternate_number:{type: String},
  lastActivity:{type:Date,required:true}
});

addressSchema.plugin(uniqueValidator);

module.exports = mongoose.model('ADDRESS', addressSchema);
