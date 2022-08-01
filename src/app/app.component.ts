import {Component} from '@angular/core';
import {OffcanvasService} from './core/shared/offcanvas.service';
import {SeoService} from './services/seo/seo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public offcanvasService: OffcanvasService, private seoService: SeoService) {
    this.seoService.setMetaTitle('Mine | Магазин Кави та Чаю');
  }
}
