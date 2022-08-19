const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const CategoriesSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {type: String, required: true, trim: true},
  abbreviation: {type: String, required: true, trim: true}
})

module.exports = mongoose.model('Categories', CategoriesSchema, 'categories');
