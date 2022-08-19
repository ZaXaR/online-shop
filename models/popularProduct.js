const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const popularProductSchema = new Schema({
  idProduct: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model('Popular-Products', popularProductSchema, 'popular-products');
