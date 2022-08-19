import {Injectable} from '@angular/core';
import {Observable, of, from as fromPromise} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {AngularFireDatabase} from '@angular/fire/compat/database';

import {Order} from '../../../models/order.model';

import {MessageService} from '../../../messages/message.service';
import {AuthService} from '../../shared/auth.service';
import {ProductsUrl} from '../../../products/shared/productsUrl';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class OrderService {
  private productsUrl = ProductsUrl;

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private http: HttpClient,
    private store: AngularFireDatabase
  ) {
  }

  public getOrders() {
    return this.authService.user
      .pipe(
        switchMap((user) => {
          if (user) {
            const remoteUserOrders = `/users/${user.uid}/orders`;
            return this.store.list(remoteUserOrders).valueChanges();
          } else {
            return of(null);
          }
        })
      );
  }

  public addUserOrder(order: Order, total: number, user: string) {
    const orderWithMetaData = {
      ...order,
      ...this.constructOrderMetaData(),
      total
    };

    const databaseOperation = this.store
      .list(`users/${user}/orders`)
      .push(orderWithMetaData)
      .then((response) => response, (error) => error);

    return fromPromise(databaseOperation);
  }

  addAnonymousOrder(order: Order, total: number): Observable<any> {
    const orderWithMetaData = {
      ...order,
      ...this.constructOrderMetaData(),
      total
    };
    // console.log(orderWithMetaData);
    // console.log(this.productsUrl.baseOnlineShopUrl);
    return this.http.post<any>(this.productsUrl.baseOnlineShopUrl, orderWithMetaData);

    // const databaseOperation = this.store
    //   .list('orders')
    //   .push(orderWithMetaData)
    //   .then((response) => response, (error) => error);
    //
    // return fromPromise(databaseOperation);
  }

  constructOrderMetaData() {
    return {
      number: (Math.random() * 10000000000).toString().split('.')[0],
      date: new Date().toString(),
      status: 'In Progress'
    };
  }
}
