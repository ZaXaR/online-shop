import {environment} from '../../../environments/environment';

export class ProductsUrl {
  static localhost = environment.apiUrl;
  // static productsUrl = '/products';
  static baseProductsUrl = this.localhost + '/api/products';
  static baseOnlineShopUrl = this.localhost + '/api/onlineShop';
  static baseCategoriesUrl = this.localhost + '/api/categories';
  static basePromosUrl = this.localhost + '/api/promos';
  static baseFiltersUrl = this.localhost + '/api/filters';
}
