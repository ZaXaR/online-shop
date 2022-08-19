const productsRepo = require('../../../library/productsRepository'),
  util = require('util');

class getProductsController {

  constructor(router) {
    router.get('/pageStore/:type', this.getProductsPageStore.bind(this));
    router.get('/top-sellers', this.getTopProducts.bind(this));
    router.get('/new/:count', this.getNewProductShop.bind(this));
    router.get('/additional-information/:id', this.getAdditInform.bind(this));
    router.get('/:id', this.getProduct.bind(this));
  }

  getTopProducts(req, res) {
    console.log('*** getTopProducts');
    this.accessAllow(res);
    productsRepo.getTopProducts((err, products) => {
      if (err) {
        console.log('*** getTopProducts error: ' + util.inspect(err));
        res.json(null);
      } else {
        console.log('*** getTopProducts ok');
        res.json(products);
      }
    })
  }

  getProductsPageStore(req, res) {
    this.accessAllow(res)
    console.log('*** getProductsPageStore');
    let filter = {}
    this.checkFilter(req, (checkFilter) => {
      filter = checkFilter;
    });

    const pageVal = req.params.page,
      pageSize = req.params.pageSize,
      page = (isNaN(pageVal)) ? 0 : +pageVal,
      SpotVal = '61058409b01abf195409fdeb',
      filtered = req.params.type === 'undefined'
        ? {inShop: true}
        : {...filter, inShop: true, "options.categories.name": new RegExp('^' + req.params.type + '$', 'i')};
    productsRepo.getPagedProducts(page, pageSize, SpotVal, filtered, (err, data) => {
      res.setHeader('X-InlineCount', data.count);
      if (err) {
        console.log('*** getProductsPage error: ' + util.inspect(err));
        res.json(null);
      } else {
        console.log('*** getProductsPage ok');
        res.json(data.products);
      }
    });
  }

  getProduct(req, res) {
    this.accessAllow(res);
    const id = req.params.id;
    productsRepo.getProduct(id, (err, product) => {
      if (err) {
        console.log('*** getProduct error: ' + util.inspect(err));
        res.json(null);
      } else {
        console.log('*** getProduct ok');
        res.json(product);
      }
    });
  }

  getAdditInform(req, res) {
    console.log('*** getAdditInform');
    this.accessAllow(res);
    if (req.params.id !== '0') {
      const id = req.params.id;
      productsRepo.getProductFilter(id, (errFilter, product) => {
        let dataFilter = null;
        if (product.filter) {
          dataFilter = product.filter;
        }
        productsRepo.getDescription(id, (errDesc, description) => {
          if (errDesc) {
            console.log('*** getAdditInform error: ' + util.inspect(errDesc));
            res.json({dataDescription: null, filter: dataFilter});
          } else {
            console.log('*** getAdditInform ok');
            res.json({dataDescription: description, filter: dataFilter});
          }
        });
      });
    } else {
      console.log('*** getAdditInform empty');
      res.json({dataDescription: null, filter: null});
    }
  }

  getNewProductShop(req, res) {
    this.accessAllow(res);
    const count = 5;
    console.log('*** getNewProductShop');
    productsRepo.getNewProductShop(count, (err, products) => {
      if (err) {
        console.log('*** getNewProductShop error: ' + util.inspect(err));
        res.json(null);
      } else {
        console.log('*** getNewProductShop ok');
        res.json(products);
      }
    })
  }

  checkFilter(req, callback) {
    let filter = {}
    if (req.query.packaging) {
      filter = {
        ...filter,
        "filter.packaging": req.query.packaging
      }
    }
    if (req.query.type_tea) {
      filter = {
        ...filter,
        "filter.type_tea": req.query.type_tea
      }
    }
    if (req.query.type_leaf) {
      filter = {
        ...filter,
        "filter.type_leaf": req.query.type_leaf
      }
    }
    if (req.query.type_taste) {
      filter = {
        ...filter,
        "filter.type_taste": req.query.type_taste
      }
    }
    if (req.query.type_coffee) {
      filter = {
        ...filter,
        "filter.type_coffee": req.query.type_coffee
      }
    }
    if (req.query.roast_degree) {
      filter = {
        ...filter,
        "filter.roast_degree": req.query.roast_degree
      }
    }
    if (req.query.coffee_variety) {
      filter = {
        ...filter,
        "filter.coffee_variety": req.query.coffee_variety
      }
    }
    callback(filter);
  }

  accessAllow(res) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
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

module.exports = getProductsController;
