const mongoose = require('mongoose');

const merchantSchema = mongoose.Schema({

  owner_name: { type: String, required: true },
  owner_msisdn: { type: String },
  images: {type: [String],required: true},
  address:{type: String, required: true },
  shop_name:{type: String, required: true },
  description:{type: String, required: true },
  overall_rating:{type: String, required: true },
  min_order:{type: String, required: true },
  time:{type: String, required: true },
  item_points:{type: String, required: true },
  net_order:{type:String},
  menu_category:{type: String, required: true },
  keywords:{type: [String], required: true },
  filter_keywords:{type: [String], required: true },
    // quantity:{type: Number, required: true }

});


module.exports = mongoose.model('MERCHANT', merchantSchema);
