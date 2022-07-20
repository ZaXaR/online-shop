// Modules
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LOCALE_ID, NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {ProductsModule} from './products/products.module';
import {SharedModule} from './shared/shared.module';
import {CoreModule} from './core/core.module';
import {CheckoutModule} from './checkout/checkout.module';
import {AccountModule} from './account/account.module';
import {AdminModule} from './admin/admin.module';
import {AngularFireModule} from '@angular/fire/compat';
import {AngularFireDatabaseModule} from '@angular/fire/compat/database';
import {AngularFireStorageModule} from '@angular/fire/compat/storage';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {ToastrModule} from 'ngx-toastr';
import {environment} from '../environments/environment';

// Components
import {AppComponent} from './app.component';
import {CartComponent} from './cart/cart.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import localeUk from '@angular/common/locales/uk';
import {registerLocaleData} from '@angular/common';
import {StorageService} from './services/storage/storage.service';

registerLocaleData(localeUk);

@NgModule({
    declarations: [
        AppComponent,
        CartComponent,
        PageNotFoundComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
        AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
        AngularFireStorageModule, // imports firebase/storage only needed for storage features
        HttpClientModule,
        SharedModule,
        CoreModule,
        ProductsModule,
        CheckoutModule,
        AccountModule,
        AdminModule,
        ToastrModule.forRoot(), // ToastrModule added
    ],
    providers: [
        StorageService,
        {provide: LOCALE_ID, useValue: 'uk_UA'},
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
