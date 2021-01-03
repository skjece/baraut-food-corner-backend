const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({

  name: { type: String, required: true },
  description: { type: String },
  images: {type: [String],required: true},
  default_discount:{type: String, required: true },
  seller_id:{type: mongoose.Schema.Types.ObjectId, required: true },
  availablity_status:{type: String, required: true },
  search_keywords:{type: [String], required: true },
  cuisine_keywords:{type: [String], required: true },
  menu_category:{type: String, required: true },
  item_points:{type: String, required: true },
  variants:{type:{}}
    // quantity:{type: Number, required: true }

});

module.exports = mongoose.model('ITEM', itemSchema);
