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

// tslint:disable-next-line:class-name
export interface iFilter {
  categories_id?: [] | string;
  type_coffee?: [] | string;
  roast_degree?: [] | string;
  coffee_variety?: [] | string;
  packaging?: [] | string;
  type_tea?: [] | string;
  type_leaf?: [] | string;
  type_taste?: [] | string;
}

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
  filters: iFilter;
  checkedFilters: iFilter;

  constructor(
    private productService: ProductService,
    private productsCacheService: ProductsCacheService,
    private pagerService: PagerService,
    private sortPipe: SortPipe,
    private authService: AuthService,
    public uiService: UiService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    private router: Router
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
      this.storageService.categoriesStorage$,
      this.productService.getFilters()
    ]).subscribe(([products, category, filters]) => {
      if (Array.isArray(products) && !products.length) {
        this.products = null;
      } else {
        this.products = <Product[]>products;
        this.setPage(this.currentPagingPage);
      }
      category = category.filter(({name}) => name === categories)[0];
      this.filters = filters.filter(({categories_id}) => categories_id === category._id)[0];
      this.checkFiltersChecked();
      this.title = category.abbreviation_ua;
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

  checkFiltersChecked() {
    this.route.queryParams.subscribe(data => {
      this.checkedFilters = this.unfreeze(data);
    });
  }

  unfreeze(obj) {
    if (Object.isFrozen(obj)) {
      return Object.assign({}, obj);
    }
    return obj;
  }

  arrayRemove(arr, value) {
    return arr.filter((ele) => {
      // tslint:disable-next-line:triple-equals
      return ele != value;
    }, {});
  }

  onChange(type: string, value, event) {
    if (event.currentTarget.checked) {
      if (this.checkedFilters[type]) {
        if (Array.isArray(this.checkedFilters[type])) {
          this.checkedFilters[type] = [value, ...this.checkedFilters[type]];
        } else {
          this.checkedFilters[type] = [value, this.checkedFilters[type]];
        }
        console.log(this.checkedFilters);
      } else {
        this.checkedFilters[type] = value;
      }
      this.router.navigate(
        [],
        {
          relativeTo: this.route,
          queryParams: this.checkedFilters,
          queryParamsHandling: 'merge', // remove to replace all query params by provided
        });
    } else {
      if (Array.isArray(this.checkedFilters[type])) {
        this.checkedFilters[type] = this.arrayRemove(this.checkedFilters[type], value);
      } else {
        delete this.checkedFilters[type];
      }
      // console.log(this.checkedFilters);
      this.router.navigate(
        ['.'],
        {
          relativeTo: this.route,
          queryParams: this.checkedFilters,
        }
      );
    }
  }

  isChange(type, value) {
    const selected = this.checkedFilters[type];
    if (selected) {
      return selected.includes(value);
    } else {
      return false;
    }
  }
}
