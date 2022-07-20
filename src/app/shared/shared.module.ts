import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppRoutingModule} from '../app-routing.module';
import {FormsModule} from '@angular/forms';

import {PriceComponent} from './price/price.component';
import {PageTitleComponent} from '../core/page-title/page-title.component';
import {FiltersComponent} from './filters/filters.component';

@NgModule({
  declarations: [
    PriceComponent,
    PageTitleComponent,
    FiltersComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule
  ],
  exports: [
    PriceComponent,
    PageTitleComponent,
    FiltersComponent,
    CommonModule,
    AppRoutingModule,
    FormsModule
  ]
})
export class SharedModule {
}
