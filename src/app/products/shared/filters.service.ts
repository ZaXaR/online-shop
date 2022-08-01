import {Injectable} from '@angular/core';
import {IFilter} from '../../core/interfaces/interfaces';
import {ReplaySubject} from 'rxjs';
import {ProductService} from './product.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map} from 'rxjs/operators';

@Injectable()
export class FiltersService {
  public filtersStorageReplay$: ReplaySubject<IFilter>
    = new ReplaySubject();
  public filterCategoryStorageReplay$: ReplaySubject<IFilter>
    = new ReplaySubject();
  checkedFilters: IFilter;

  constructor(
    public productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map((event: NavigationEnd) => event.url))
      .subscribe(() => {
        this.getFilters();
      });
  }

  getFilters() {
    this.productService.getFilters().subscribe(response =>
      this.filtersStorageReplay$.next(response));
  }

  getFilterByCategory(category) {
    this.filtersStorageReplay$.subscribe((response: any) => {
      this.filterCategoryStorageReplay$.next(
        response.filter(({categories_id}) => categories_id === category._id)[0]);
      this.checkFiltersChecked();
    });
  }


  onChange(type: string, value, event) {
    if (event.currentTarget.checked) {
      if (this.checkedFilters[type]) {
        if (Array.isArray(this.checkedFilters[type])) {
          this.checkedFilters[type] = [value, ...this.checkedFilters[type]];
        } else {
          this.checkedFilters[type] = [value, this.checkedFilters[type]];
        }
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
      this.router.navigate(
        [],
        {
          relativeTo: this.route,
          queryParams: this.checkedFilters,
          // queryParamsHandling: 'merge', // remove to replace all query params by provided
        }
      );
    }
  }

  isChange(type, value) {
    const selected = this.checkedFilters[type];
    if (selected) {
      if (selected === value) {
        return true;
      }
      // return selected.includes(value);
    } else {
      return false;
    }
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

}
