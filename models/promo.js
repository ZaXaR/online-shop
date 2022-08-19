const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const PromoSchema = new Schema({
  preHeading: {type: String},
  heading: {type: String, required: true},
  afterHeading: {type: String},
  imageUrl: {type: String, required: true},
  buttonText: {type: String},
  link: {type: String}
});

module.exports = mongoose.model('Promo', PromoSchema, 'promo');
