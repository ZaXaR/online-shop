import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {IFilter} from '../../core/interfaces/interfaces';
import {FiltersService} from '../../products/shared/filters.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class FiltersComponent implements OnInit, OnDestroy {
  filters: IFilter;

  constructor(public filtersServices: FiltersService) {
    this.filtersServices.filterCategoryStorageReplay$.subscribe(response =>
      this.filters = response
    );
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    // this.filtersServices.filterCategoryStorageReplay$.unsubscribe();
  }
}
