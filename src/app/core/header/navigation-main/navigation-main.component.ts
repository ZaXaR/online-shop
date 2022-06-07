import {Component, OnDestroy, OnInit} from '@angular/core';

import {Subscription} from 'rxjs';

import {AuthService} from '../../../account/shared/auth.service';

import {User} from '../../../models/user.model';
import {ProductService} from '../../../products/shared/product.service';
import {StorageService} from '../../../services/storage/storage.service';

@Component({
  selector: 'app-navigation-main',
  templateUrl: './navigation-main.component.html',
  styleUrls: ['./navigation-main.component.scss']
})
export class NavigationMainComponent implements OnInit, OnDestroy {
  public user: User;
  private authSubscription: Subscription;
  public categories: any;

  constructor(public authService: AuthService,
              private productService: ProductService,
              private storageService: StorageService) {
  }

  ngOnInit() {
    this.authService.user.subscribe((user) => {
      this.user = user;
    });
    this.getCategories();
  }

  getCategories() {
    this.storageService.categoriesStorage$.subscribe(categories => {
      this.categories = categories;
    });
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
