import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MessageService } from '../../messages/message.service';
import { ProductService } from '../../products/shared/product.service';
import { ProductsCacheService } from '../../products/shared/products-cache.service';
import { PromoService } from '../shared/promo.service';
import { Product } from '../../models/product.model';
import { Promo } from '../../models/promo.model';
import {SeoService} from '../../services/seo/seo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  public products: Product[];
  public productsFeatured: any;
  public productsNewArrivals: Product[];
  public productsOnSale: Product[];
  public productsBestRated: Product[];
  public promos: Promo[];

  constructor(
    private messageService: MessageService,
    private productsCache: ProductsCacheService,
    private productService: ProductService,
    private promoService: PromoService,
    private seoService: SeoService,
  ) {
  }

  ngOnInit() {
    this.seoService.setMetaTitle('Mine | Магазин Кави та Чаю');
    this.productService
      .getProducts()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((products) => {
        this.products = <Product[]>products;
      });

    this.productService
      .getProductsByDate(3)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (products) => {
          this.productsNewArrivals = products;
        },
        (err) => console.error(err)
      );

    this.productService
      .getProductsByRating(3)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (products) => {
          this.productsBestRated = products;
        },
        (err) => console.error(err)
      );

    this.productService
      .getProductsQuery()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (products) => {
          this.productsOnSale = products;
        },
        (err) => console.error(err)
      );

    this.promoService
      .getPromos()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((promos) => {
        this.promos = promos;
      });
  }

  ngOnDestroy() {
    // this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
