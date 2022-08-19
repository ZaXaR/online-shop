const filtersRepo = require('../../../library/FiltersRepository');
const util = require("util");

class getFilterProductsController {

  constructor(router) {
    router.get('/', this.getFilters.bind(this));
  }

  getFilters(req, res) {
    console.log('*** getFilters');
    this.accessAllow(res);
    filtersRepo.getFilters((err, filters) => {
      if (err) {
        console.log('*** getFilters error: ' + util.inspect(err));
        res.json(null);
      } else {
        console.log('*** getFilters ok');
        res.json(filters);
      }
    })
  }

  accessAllow(res) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    // res.setHeader('Access-Control-Allow-Origin', 'https://mine.in.ua');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
  }
}

module.exports = getFilterProductsController;
