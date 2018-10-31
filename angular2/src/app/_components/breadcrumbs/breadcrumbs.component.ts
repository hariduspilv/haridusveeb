import { Component, Input, OnInit, OnDestroy} from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Apollo } from 'apollo-angular';

import { MetaTagsService } from '@app/_services/metaTagsService';
import { HttpService } from '@app/_services/httpService';
@Component({
  selector: 'breadcrumbs',
  templateUrl: 'breadcrumbs.component.html',
})

export class BreadcrumbsComponent implements OnInit, OnDestroy {
  //@Input() custom: string;

  subscriptions: Subscription[] = [];
  
  path: string;
  prevPath: string = "";
  lang: string;
  breadcrumb: any;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apollo: Apollo,
    private metaTags: MetaTagsService,
    private http: HttpService
  ) {}
  
  getData() {
    // GET BREADCRUMB

    let url = "/graphql?queryId=getBreadcrumbs:1&variables=";
    let variables = {
      path: this.path
    };

    const breadcrumbSubscription = this.http.get(url+JSON.stringify(variables)).subscribe((response) => {
      let data = response['data'];
      if( !data['route'] ){
        history.replaceState({}, '', `/${this.lang}`);
        this.router.navigateByUrl(`/${this.lang}/404`);
      }
      this.metaTags.set(data['route']['entity']['entityMetatags']);
      this.breadcrumb = data['route']['breadcrumb'];
    });

    this.subscriptions = [...this.subscriptions, breadcrumbSubscription];
  }
  private updateBreadcrumbs(){
    this.path = this.router.url.split('?')[0];
    if( this.path !== this.prevPath ){
      this.prevPath = this.path;
      this.breadcrumb = [];
      this.getData();
    }
  }
  ngOnInit() {
    const paramsSub = this.route.params.subscribe(
      (params: ActivatedRoute) => {
        
        this.lang = params['lang'];
        this.updateBreadcrumbs();
       
      }
    );
    const eventsSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {       
        this.updateBreadcrumbs();
      }
    });

    this.subscriptions = [...this.subscriptions, paramsSub];
    this.subscriptions = [...this.subscriptions, eventsSub];
    
    
  }

  ngOnDestroy() {
    for (let sub of this.subscriptions) {
      if (sub && sub.unsubscribe) {
        sub.unsubscribe();
      }
    }
  }
}