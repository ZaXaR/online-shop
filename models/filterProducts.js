const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const FilterProductsSchema = new Schema({
  categories_id: mongoose.Schema.Types.ObjectId,
  type_coffee: [{type: String}],
  roast_degree: [{type: String}],
  coffee_variety: [{type: String}],
  packaging: [{type: String}],
  type_tea: [{type: String}],
  type_leaf: [{type: String}],
  type_taste: [{type: String}]
});

module.exports = mongoose.model('FilterProducts', FilterProductsSchema, 'filter-products');
