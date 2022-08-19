const Product = require('../models/product'),
  PopularProduct = require('../models/popularProduct'),
  FullDesc = require('../models/fulldescs'),
  ObjectID = require('mongodb').ObjectID;

class ProductsRepository {

  // get all the products
  getProducts(callback) {
    console.log('*** ProductsRepository.getProducts');
    Product.count((err, custsCount) => {
      let count = custsCount;
      console.log(`Products count: ${count}`);

      Product.find({}, (err, products) => {
        if (err) {
          console.log(`*** ProductsRepository.getProducts error: ${err}`);
          return callback(err);
        }
        callback(null, {
          count: count,
          products: products
        });
      });
    });
  }

  getTopProducts(callback) {
    PopularProduct.find().exec((err, productsId) => {
      if (err) {
        console.log(`*** ProductsRepository.getTopProducts error: ${err}`);
        return callback(err);
      }
      let ids = productsId.map(id => id.idProduct)
      Product.find({_id: {$in: ids}}, (err, products) => {
        if (err) {
          console.log(`*** ProductFind ProductsRepository.getTopProducts error: ${err}`);
          return callback(err);
        }
        // console.log(products)
        callback(null, products);
      })
    })
  }


  getPagedProducts(page, pageSize, SpotVal, filtered, callback) {
    console.log('*** ProductsRepository.getPagedProducts');
    Product.find(filtered)
      .sort({internal_id: 1})
      .skip(page)
      .limit(pageSize)
      .exec((err, products) => {
        if (err) {
          console.log(`*** ProductsRepository.getPagedProducts error: ${err}`);
          return callback(err);
        }
        let refineProducts = products.map(product => {
          let dataProd = null;
          product.spots.map(spotProd => {
            if (spotProd._id.toString() === SpotVal) {
              dataProd = spotProd;
            }
          });
          return {
            _id: product._id,
            nameOfProduct: product.nameOfProduct,
            description: product.description,
            // secontName: product.secontName,
            barcode: product.barcode,
            // parentProducts: product.parentProducts,
            // countSide: product.countSide,
            quantity: dataProd.quantity,
            price: dataProd.price,
            // purchasePrice: product.purchasePrice,
            state: product.state,
            stateId: product.stateId,
            // internal_id: product.internal_id,
            // typeOfProduct: product.typeOfProduct,
            inShop: product.inShop,
            imageURLs: product.imageURLs,
            options: product.options
          }
        })
        let count = refineProducts.length;
        callback(null, {
          count: count,
          products: refineProducts
        });
      });
  }

  // get a  product
  getProduct(id, callback) {
    console.log('*** ProductsRepository.getProduct');
    Product.findById(id, (err, product) => {
      if (err) {
        console.log(`*** ProductsRepository.getProduct error: ${err}`);
        return callback(err);
      }
      // console.log(product);
      callback(null, product);
    });
  }

  getProductFilter(id, callback) {
    console.info('+*** ProductsRepository.getProductFilter');
    Product.findOne({"_id": ObjectID(id)}, (err, product) => {
      if (err) {
        console.log(`*** ProductsRepository.getProductFilter error: ${err}`);
        return callback(err);
      }
      callback(null, product);
    });
  }

  getDescription(id, callback) {
    console.log('*** ProductsRepository.getAdditInform');
    FullDesc.findOne({"idProduct": ObjectID(id)}, (err, fullDesc) => {
      if (err) {
        console.log(`*** ProductsRepository.getAdditInform error: ${err}`);
        return callback(err);
      }
      callback(null, fullDesc);
    });
  }

  insertFullDesc(id, body, callback) {
    console.log('*** ProductsRepository.insertFullDesc');
    let description = new FullDesc();
    description.idProduct = id;
    description.fullDesc = body.fullDesc;
    description.save((err) => {
      if (err) {
        console.log(`*** ProductsRepository.insertFullDesc error: ${err}`);
        return callback(err, null);
      }
      callback(null);
    });
  }

  // online shop api
  getNewProductShop(count, callback) {
    console.log('*** ProductsRepository.getNewProductShop');
    Product.find({inShop: true})
      .sort({$natural: -1})
      .limit(count)
      .exec((err, products) => {
        if (err) {
          console.log(`*** ProductsRepository.getNewProductShop error: ${err}`);
          return callback(err, null);
        }
        callback(null, products);
      });
  }

}

module.exports = new ProductsRepository();
