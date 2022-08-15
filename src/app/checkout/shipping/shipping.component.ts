import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CheckoutService } from '../shared/checkout.service';

@Component({
  selector: 'app-checkout-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss']
})
export class ShippingComponent implements OnInit {
  public formShipping: FormGroup;
  public shippingMethods: {method: string, time: string, fee: number, value: string}[];

  constructor(private checkoutService: CheckoutService) { }

  ngOnInit() {
    this.shippingMethods = [
      {
        method: 'Самовивіз з магазину',
        time: '',
        fee: 0,
        value: 'economy'
      },
      {
        method: 'Доставка на офіс Bandapixels',
        time: 'Протягом 24 годин',
        fee: 0,
        value: 'bandapixels'
      },
      {
        method: 'Нова пошта',
        time: 'до одного тижня',
        fee: 30,
        value: 'priority'
      }
    ];
    this.formShipping = new FormGroup({
      'shippingMethod': new FormControl(this.shippingMethods[1].value, Validators.required)
    });
  }

  public onBack() {
    this.checkoutService.previousStep();
  }

  public onContinue() {
    this.checkoutService.setShippingMethod(this.formShipping.controls.shippingMethod.value);
    this.checkoutService.nextStep();
  }

}
