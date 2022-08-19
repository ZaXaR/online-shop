const Promo = require('../models/promo');

class PromosRepository {

  getPromos(callback) {
    console.log('*** PromosRepository.getPromos');
    Promo.find({}, (err, promos) => {
      if (err) {
        console.log(`*** PromosRepository.getPromos error: ${err}`);
        return callback(err);
      }
      callback(null, promos);
    });
  }
}

module.exports = new PromosRepository();
