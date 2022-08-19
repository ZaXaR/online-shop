import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { CheckoutService } from './shared/checkout.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  checkoutSubscription: Subscription;
  steps: string[];
  activeStep: number;

  constructor(private checkoutService: CheckoutService) {}

  ngOnInit() {
    this.steps = ['1. Адреса', '2. Доставка', '3. Оплата', '4. Перегляд'];
    this.activeStep = this.checkoutService.activeStep;
    this.checkoutSubscription = this.checkoutService.stepChanged.subscribe((step: number) => {
      this.activeStep = step;
    });
  }

  ngOnDestroy() {
    this.checkoutSubscription.unsubscribe();
  }
}
