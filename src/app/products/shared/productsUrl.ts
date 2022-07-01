import {environment} from '../../../environments/environment';

export class ProductsUrl {
  static localhost = environment.apiUrl;
  static productsUrl = '/products';
  static baseProductsUrl = this.localhost + '/products';
  static baseCategoriesUrl = this.localhost + '/categories';
  static basePromosUrl = this.localhost + '/promos';
}
