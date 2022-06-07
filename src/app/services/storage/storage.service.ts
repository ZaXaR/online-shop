import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ProductService} from '../../products/shared/product.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  public categoriesStorage$: BehaviorSubject<any>
    = new BehaviorSubject<any>(null);
  _categoriesStorage = this.categoriesStorage$.asObservable();

  constructor(private productService: ProductService) {
    this.productService.getCategories().subscribe(response => {
      this.categoriesStorage$.next(response.reverse());
    });
  }

}
