const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");
const { stringify } = require('querystring');

const orderSchema = mongoose.Schema({
  delivery_details: { type: {}, required: true},//unique is not validator, reuired is validator
  items: { type: [], required: true },
  orderFlow:{type: {}, required: true},
  msisdn:{type:String,required:true},
  lastActivity:{type:Date,required:true},
  merchant_id:{type:mongoose.Schema.Types.ObjectId,required:true},
  payable_amount:{type:String,required:true},
  merchant_name:{type:String,required:true},
  delivered_in:{type:String,required:true},
  seller_msisdn:{type:String,required:true},
  discountOnOrder:{type:{}}

});

//orderSchema.plugin(uniqueValidator);

module.exports = mongoose.model('ORDER', orderSchema);
