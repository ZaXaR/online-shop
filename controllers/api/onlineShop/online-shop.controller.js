const onlineShopRepository = require('../../../library/onlineShopRepository'),
  util = require('util');

class getOnlineShopController {
  constructor(router) {
    router.post('/', this.insertOnlineOrder.bind(this));
  }

  insertOnlineOrder(req, res) {
    console.log('*** insertOnlineOrder');
    onlineShopRepository.insertOnlineOrder(req.body, (err, response) => {
      if (err) {
        console.log('*** onlineShopRepository.insertOnlineOrder error: ' + util.inspect(err));
        res.json(null);
      }
      console.log('*** insertOnlineOrder ok');
      res.json(response);
    });
  }
}

module.exports = getOnlineShopController;
