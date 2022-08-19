 const OnlineShop = require('../models/online-shop');

class OnlineShopRepository {

  // insert a  order
  insertOnlineOrder(orderWithMetaData, callback) {
    console.log('*** OnlineShopRepository.insertOnlineOrder');
    console.log(orderWithMetaData)
    let onlineShop = new OnlineShop();
    onlineShop.customer = orderWithMetaData.customer;
    onlineShop.items = orderWithMetaData.items;
    onlineShop.total = orderWithMetaData.total;
    onlineShop.status = orderWithMetaData.status;
    onlineShop.number = orderWithMetaData.number;
    onlineShop.date = orderWithMetaData.date;
    onlineShop.shippingMethod = orderWithMetaData.shippingMethod;
    onlineShop.paymentMethod = orderWithMetaData.paymentMethod;

    onlineShop.save((err, order) => {
      if (err) {
        console.log(`*** OnlineShopRepository insertOnlineOrder error: ${err}`);
        return callback(err, null);
      }

      callback(null, order);
    });
  }
}

module.exports = new OnlineShopRepository();
