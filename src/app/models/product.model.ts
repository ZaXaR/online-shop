export class Product {
  public imageFeaturedUrl?;

  constructor(
    // public id: number = 1,
    public _id: number = 1,
    public date: string = new Date().toISOString().split('T')[0],
    public name: string = '',
    public description: string = '',
    public price: number = 0,
    public priceNormal: number = 0,
    public reduction: number = 0,
    public imageURLs: string[] = [],
    public imageRefs: string[] = [],
    public categories: {} = {},
    public ratings: {} = {},
    public currentRating: number = 0,
    public sale: boolean = false,
    public barcode: number = 0,
    public nameOfProduct: string = '',
    public lastUpdateDate: string = new Date().toISOString().split('T')[0],
    public fullDesc: string = '',
    public options?: {
      stick: boolean,
      categories: {
        _id: string,
        name: string,
        abbreviation: string,
        abbreviation_ua: string
      }
    }
  ) {
  }
}
