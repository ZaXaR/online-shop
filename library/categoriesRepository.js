const Categories = require('../models/categorie');

class CategoriesRepository {

  getCategories(callback) {
    console.log('*** CategoriesRepository.getCategories');
    Categories.find({}, {}, {sort: {name: 1}}, (err, categories) => {
      if (err) {
        console.log(`*** CategoriesRepository.getCategories err: ${err}`);
        return callback(err);
      }
      callback(null, categories);
    });
  }
}

module.exports = new CategoriesRepository();
