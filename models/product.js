const mongoose = require('mongoose'),
  Options = require('./options'),
  Schema = mongoose.Schema;

const parentProductsSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  nameOfProduct: {type: String},
  barcode: {type: Number},
  count: {type: Number}
});

const spotsProductsSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  quantity: {type: Number},
  price: {type: Number},
  lastUpdateDate: {type: Date, default: Date.now}
})

const FilterProductBoolSchema = new Schema({
  type_coffee: {type: String, required: false},
  roast_degree: {type: String, required: false},
  coffee_variety: {type: String, required: false},
  packaging: {type: String, required: false},
  type_tea: {type: String, required: false},
  type_leaf: {type: String, required: false},
  type_taste: {type: String, required: false}
});

const ProductSchema = new Schema({
  nameOfProduct: {type: String, required: true, trim: true},
  description: {type: String},
  secontName: {type: String},
  barcode: {type: Number, required: true},
  stateId: {type: Number, required: true},
  internal_id: {type: Number},
  typeOfProduct: {type: String},
  quantity: {type: Number},
  price: {type: Number, required: true},
  purchasePrice: {type: Number},
  countSide: {type: Number},
  parentProducts: [parentProductsSchema],
  spots: [spotsProductsSchema],
  inShop: {type: Boolean},
  imageURLs: [{type: String}],
  options: Options.schema,
  filter: FilterProductBoolSchema,
  lastUpdateDate: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Product', ProductSchema, 'products');
