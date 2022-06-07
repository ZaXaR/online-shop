import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import {catchError, Observable, of} from 'rxjs';
import {Promo} from '../../models/promo.model';
import {HttpClient} from '@angular/common/http';
import {Product} from '../../models/product.model';
import {map} from 'rxjs/operators';
import {MessageService} from '../../messages/message.service';
import {ProductsUrl} from '../../products/shared/productsUrl';

@Injectable()
export class PromoService {
  private productsUrl = ProductsUrl;

  constructor(
    private messageService: MessageService,
    private angularFireDatabase: AngularFireDatabase,
    private http: HttpClient
  ) {
  }

  private log(message: string) {
    this.messageService.add('ProductService: ' + message);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      this.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  public getPromos(): Observable<Promo[]> {
    return this.http.get<Promo[]>(`${this.productsUrl.basePromosUrl}`, {observe: 'response'})
      .pipe(map((arr) => arr.body as Promo[]), catchError(this.handleError<any>(`getPromos`)));
  }

  // getPromos(): Observable<Promo[]> {
  //   return this.angularFireDatabase.list<Promo>('promos').valueChanges();
  // }
}
