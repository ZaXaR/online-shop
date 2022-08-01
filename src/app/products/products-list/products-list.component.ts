import {Component, OnDestroy, OnInit} from '@angular/core';

import {combineLatest, Subject} from 'rxjs';
import {filter, map, takeUntil} from 'rxjs/operators';

import {AuthService} from '../../account/shared/auth.service';
import {PagerService} from '../../pager/pager.service';
import {ProductsCacheService} from '../shared/products-cache.service';
import {ProductService} from '../shared/product.service';
import {UiService} from '../shared/ui.service';
import {SortPipe} from '../shared/sort.pipe';
import {Product} from '../../models/product.model';
import {User} from '../../models/user.model';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {StorageService} from '../../services/storage/storage.service';
import {IFilter} from '../../core/interfaces/interfaces';
import {FiltersService} from '../shared/filters.service';
import {OffcanvasService} from '../../core/shared/offcanvas.service';
import {SeoService} from '../../services/seo/seo.service';

@Component({
  selector: 'app-products',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject();
  products: Product[];
  productsPaged: Product[];
  pager: any = {};
  user: User;
  productsLoading: boolean;
  currentPagingPage: number;
  title: string;
  paramsObject: Object;
  filters: IFilter;

  constructor(
    private productService: ProductService,
    private productsCacheService: ProductsCacheService,
    private pagerService: PagerService,
    private sortPipe: SortPipe,
    private authService: AuthService,
    public uiService: UiService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    private router: Router,
    public filtersService: FiltersService,
    private offcanvasService: OffcanvasService,
    private seoService: SeoService
  ) {
    this.router.events
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(event => event instanceof NavigationEnd),
        map((event: NavigationEnd) => event.url))
      .subscribe(() => {
        this.getProducts();
        this.currentPagingPage = 1;
      });
  }

  ngOnInit() {
    this.authService.user
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((user) => {
        this.user = user;
      });
    this.uiService.currentPagingPage$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((page) => {
        this.currentPagingPage = page;
      });
  }

  getProducts() {
    this.productsLoading = true;
    const categories = this.route.snapshot.paramMap.get('categories');
    this.paramsObject = this.route.snapshot.queryParams;
    let paramsString = null;
    if (this.paramsObject) {
      paramsString = '?';
      Object.keys(this.paramsObject).forEach((key) => {
        if (this.paramsObject[key].length > 1 && Array.isArray(this.paramsObject[key])) {
          this.paramsObject[key].forEach(child => {
            paramsString = paramsString + key + '=' + child + '&';
          });
        } else {
          paramsString = paramsString + key + '=' + this.paramsObject[key] + '&';
        }
      });
    }
    combineLatest([
      this.productService
        .getProducts(categories, paramsString),
      this.storageService.categoriesStorage$
    ]).subscribe(([products, category]) => {
      if (Array.isArray(products) && !products.length) {
        this.products = null;
      } else {
        this.products = <Product[]>products;
        this.setPage(this.currentPagingPage);
      }
      category = category.filter(({name}) => name === categories)[0];
      this.filtersService.getFilterByCategory(category);
      this.title = category.abbreviation_ua;
      this.seoService.setMetaTitle('Mine | ' + category.abbreviation_ua);
      this.productsLoading = false;
    });
  }

  onDisplayModeChange(mode: string, e: Event) {
    this.uiService.displayMode$.next(mode);
    e.preventDefault();
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pager = this.pagerService.getPager(this.products.length, page, 8);
    this.productsPaged = this.products.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
    this.uiService.currentPagingPage$.next(page);
  }

  onSort(sortBy: string) {
    this.sortPipe.transform(
      this.products,
      sortBy.replace(':reverse', ''),
      sortBy.endsWith(':reverse')
    );
    this.uiService.sorting$.next(sortBy);
    this.setPage(1);
  }

  ngOnDestroy() {
    // this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  onFilterToggle(e: Event) {
    this.offcanvasService.openOffcanvasNavigationFilter();
    e.preventDefault();
  }
}
