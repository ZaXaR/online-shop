const mongoose = require('mongoose'),
  Categories = require('./categorie')
  Schema = mongoose.Schema;

const OptionsSchema = new Schema({
  stick: {type: Boolean, required: true},
  categories: Categories.schema,
});

module.exports = mongoose.model('Options', OptionsSchema);
