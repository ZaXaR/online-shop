import {Component, OnDestroy, OnInit} from '@angular/core';

import {Subscription} from 'rxjs';

import {AuthService} from '../../../account/shared/auth.service';

import {User} from '../../../models/user.model';
import {ProductService} from '../../../products/shared/product.service';

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
              private productService: ProductService) {
  }

  ngOnInit() {
    this.authService.user.subscribe((user) => {
      this.user = user;
    });
    this.getCategories();
  }

  getCategories() {
    console.log('getCategories');
      this.productService.getCategories().subscribe(data => {
        this.categories = data;
      });
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
