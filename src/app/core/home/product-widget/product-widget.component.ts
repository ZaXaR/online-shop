import {Component, Input} from '@angular/core';

import {Product} from '../../../models/product.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-product-widget',
  templateUrl: './product-widget.component.html',
  styleUrls: ['./product-widget.component.scss']
})
export class ProductWidgetComponent {
  public href: string;
  @Input() public products: Product[];
  @Input() public widgetTitle: string;

  constructor(private router: Router) {
    this.href = this.router.url;
  }
}
