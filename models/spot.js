const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const SpotSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  cashbox: Number
});

module.exports = mongoose.model('Spot', SpotSchema, 'spots');
