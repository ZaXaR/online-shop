const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  address1: {type: String, required: true, trim: true},
  address2: {type: String, trim: true},
  email: {type: String, required: true},
  firstname: {type: String, required: true},
  lastname: {type: String, required: true},
  phone: {type: Number, required: true}
});

const ProductSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  nameOfProduct: {type: String, required: true, trim: true},
  barcode: {type: Number},
  price: {type: Number},
  quantity: {type: Number},
});

const ItemSchema = new Schema({
  amount: {type: Number, required: true},
  product: [ProductSchema]
});

const OnlineOrderSchema = new Schema({
  customer: [CustomerSchema],
  items: [ItemSchema],
  date: {type: Date, default: Date.now},
  number: {type: Number, required: true},
  paymentMethod: {type: String, required: true},
  shippingMethod: {type: String, required: true},
  status: {type: String, required: true},
  total: {type: Number, required: true}
});


module.exports = mongoose.model('Online-Shop', OnlineOrderSchema, 'online-shop');
