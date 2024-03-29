import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {Params} from '@angular/router';

import {combineLatest, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {AuthService} from '../../account/shared/auth.service';
import {CartService} from '../../cart/shared/cart.service';
import {CartItem} from '../../models/cart-item.model';
import {ProductsCacheService} from '../shared/products-cache.service';
import {ProductRatingService} from '../shared/product-rating.service';
import {ProductService} from '../shared/product.service';

import {Product} from '../../models/product.model';
import {User} from '../../models/user.model';
import {StorageService} from '../../services/storage/storage.service';
import {SeoService} from '../../services/seo/seo.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  @Input() public product: Product;
  public productLoading: boolean;

  public user: User;

  public imagesLoaded: string[];
  public activeImageUrl: string;
  public activeImageIndex: number;

  public selectedQuantity: number;

  public ratingCount: number;
  public ratingValues: number[];
  public selectedRating: any;
  public title: {
    _id: string,
    name: string,
    abbreviation: string
    abbreviation_ua: string
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private authService: AuthService,
    private cartService: CartService,
    private productsCacheService: ProductsCacheService,
    private productService: ProductService,
    private productRatingService: ProductRatingService,
    private storageService: StorageService,
    private seoService: SeoService
  ) {
  }

  ngOnInit(): void {
    this.authService.user
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((user) => {
        this.user = user;
      });

    this.ratingValues = [1, 2, 3, 4, 5];
    this.selectedQuantity = 1;
    this.imagesLoaded = [];

    this.route.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params: Params) => {
        this.getProduct();
      });
  }

  private getProduct(): void {
    this.productLoading = true;

    const id = this.route.snapshot.params['id'];
    combineLatest([
      this.productService
        .getProduct(id),
      this.storageService.categoriesStorage$,
      this.productService.getAdditInform(id)
    ]).pipe(takeUntil(this.unsubscribe$))
      .subscribe(([product, category, description]) => {
        if (product) {
          this.product = <Product>product;
          this.seoService.setMetaTitle(product.nameOfProduct);
          if (description.dataDescription) {
            this.product.fullDesc = description.dataDescription.fullDesc;
            this.seoService.setMetaDescription(description.dataDescription.fullDesc);
          }
          const data = category.filter(({name}) => name === this.product.options.categories.name);
          this.title = data[0];
          this.setupProduct();
          this.productLoading = false;
        } else {
          this.router.navigate(['/404-product-not-found']);
        }
      });
  }

  public onSelectThumbnail(event, index) {
    event.preventDefault();
    this.activeImageUrl = this.product.imageURLs[index];
    this.activeImageIndex = index;
  }

  public onAddToCart() {
    this.cartService.addItem(new CartItem(this.product, this.selectedQuantity));
  }

  public onSelectQuantity(event) {
    this.selectedQuantity = <number>+event.target.value;
  }

  public onRate() {
    const rating = parseInt(this.selectedRating, 10);
    this.productRatingService
      .rateProduct(this.product, rating)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response) => {
        this.getProduct();
      });
  }

  public onImageLoad(e: any) {
    this.imagesLoaded.push(e.target.src);
  }

  private setupProduct() {
    if (this.product) {
      // this.checkCategories();
      // this.checkRatings();
      this.activeImageUrl = this.product.imageURLs[0];
      this.activeImageIndex = 0;
    }
  }

  // private checkRatings() {
  //   this.ratingCount = this.product.ratings
  //     ? Object.keys(this.product.ratings).length
  //     : 0;
  //
  //   // check for existing rating
  //   if (
  //     this.product.ratings &&
  //     this.user &&
  //     Object.keys(this.product.ratings).includes(this.user.uid)
  //   ) {
  //     this.selectedRating = this.product.ratings[this.user.uid];
  //   }
  // }

  ngOnDestroy() {
    // this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
