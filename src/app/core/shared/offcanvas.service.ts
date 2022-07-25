import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class OffcanvasService {
  public offcanvasNavigationMobileMenuOpen: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public offcanvasNavigationMobileFilterOpen: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public toggleOffcanvasNavigation() {
    const state = !this.offcanvasNavigationMobileMenuOpen.getValue();
    this.offcanvasNavigationMobileMenuOpen.next(state);
  }

  public openOffcanvasNavigation() {
    this.offcanvasNavigationMobileMenuOpen.next(true);
  }

  public openOffcanvasNavigationFilter() {
    console.log('open');
    this.offcanvasNavigationMobileFilterOpen.next(true);
  }

  public closeOffcanvasNavigation() {
    this.offcanvasNavigationMobileMenuOpen.next(false);
    this.offcanvasNavigationMobileFilterOpen.next(false);
  }

  // public closeOffcanvasNavigationFilter() {
  //   console.log('close');
  //   this.offcanvasNavigationMobileFilterOpen.next(false);
  // }
}
