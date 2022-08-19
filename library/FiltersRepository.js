const Filters = require('../models/filterProducts');


class FiltersRepository {
  getFilters(callback) {
    Filters.find((err, filters) => {
      if (err) {
        console.log(`*** FiltersRepository.getFilters error: ${err}`);
        return callback(err);
      }
      callback(null, filters);
    });
  }
}

module.exports = new FiltersRepository();
