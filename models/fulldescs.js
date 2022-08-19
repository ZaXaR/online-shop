const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const FullDescSchema = new Schema({
  idProduct: mongoose.Schema.Types.ObjectId,
  fullDesc: {type: String, required: true, trim: true},
});

module.exports = mongoose.model('Full-desc', FullDescSchema, 'full-desc');
