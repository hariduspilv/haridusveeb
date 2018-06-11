import { Component, OnInit, OnDestroy} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Apollo } from 'apollo-angular';

import { getBreadcrumb } from '../../_services/breadcrumb/breadcrumb.graph';

@Component({
  selector: 'breadcrumbs',
  templateUrl: 'breadcrumbs.component.html',
})

export class BreadcrumbsComponent implements OnInit, OnDestroy {
  
  subscriptions: Subscription[] = [];
  
  path: string;
  lang: string;
  breadcrumb: any;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apollo: Apollo,
  ) {}
  
  ngOnInit() {
    const paramsSub = this.route.params.subscribe(
      (params: ActivatedRoute) => {
        this.path = this.router.url;
        this.lang = params['lang'];
      }
    )
    this.subscriptions = [...this.subscriptions, paramsSub];
    // GET BREADCRUMB
    const breadcrumbSubscription = this.apollo.watchQuery({
      query: getBreadcrumb,
      variables: {
        path: this.path,
        lang: this.lang.toUpperCase(),
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
    })
    .valueChanges
    .subscribe(({data}) => {
      this.breadcrumb = data['route']['breadcrumb'];
    });
    this.subscriptions = [...this.subscriptions, breadcrumbSubscription];
  }

  ngOnDestroy() {
    for (let sub of this.subscriptions) {
      if (sub && sub.unsubscribe) {
        sub.unsubscribe();
      }
    }
  }
}