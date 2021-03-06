import {
  AfterViewInit,
  ContentChildren,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
} from '@angular/core';
import { FormItemComponent } from '@app/_assets/formItem';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { QueryParamsService } from '@app/_services/QueryParams.service';

@Directive({
  selector: '[filters]',
})

export class FiltersDirective implements AfterViewInit, OnDestroy {

  @ContentChildren(FormItemComponent, { descendants: true })
    formItems: QueryList<FormItemComponent>;
  @Input() outsideParameters: Object = {};

  private paramsWatcher: Subscription = new Subscription();

  constructor(
    private el: ElementRef,
    private router: Router,
    private route: ActivatedRoute,
    private filters: QueryParamsService,
  ) {
  }

  bindEvents(): void {
    this.el.nativeElement.addEventListener('submit', (e) => {
      e.preventDefault();
      this.gatherValues();
    });
  }

  gatherValues(): void {
    let queryParams = {};
    if (this.outsideParameters) {
      queryParams = { ...this.outsideParameters };
    }

    this.formItems.forEach((item) => {
      const data = item.getValue();
      if (data.search && !item.excludeFromSearch) {
        if (data.name && data.name !== '' && data.value && data.value !== '') {
          queryParams[data.name] = data.value;
        }
      }
    });
    Object.keys(queryParams).forEach((item) => {
      if (Array.isArray(queryParams[item])) {
        queryParams[item] = queryParams[item].join(';');
      }
    });

    this.router.navigate([], {
      queryParams,
    });
  }

  setValues(): void {
    const tmpParams = this.filters.getValues();
    this.formItems.forEach((item) => {
      const data = item.getValue();
      if (tmpParams[data.name]) {
        item.setValue(tmpParams[data.name]);
      } else {
        const val = item.type === 'multi-select' ? [] : '';
        item.setValue(val);
      }
    });
  }

  watchParams(): void {
    this.paramsWatcher = this.route.queryParams.subscribe((queryParams) => {
      this.setValues();
    });
  }

  ngAfterViewInit() {
    this.bindEvents();
    this.watchParams();
  }

  ngOnDestroy() {
    this.paramsWatcher.unsubscribe();
  }

}
