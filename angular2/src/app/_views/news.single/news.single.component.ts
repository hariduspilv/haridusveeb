import { Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NewsService, RootScopeService } from '../../_services';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { componentFactoryName } from '@angular/compiler';
import { AppComponent } from '../../app.component';
import { Subscription } from 'rxjs/Subscription';
import { MomentModule } from 'angular2-moment/moment.module';
import { getBreadcrumb } from '../../_services/breadcrumb/breadcrumb.graph';
import { Apollo } from 'apollo-angular';


@Component({
  templateUrl: './news.single.component.html',
  styleUrls: ['./news.single.component.scss']
})

export class NewsSingleComponent implements OnInit {

  private querySubscription: Subscription;  
  private path: string;
  private lang: string;
  
  breadcrumb: any;
  content: any;
  unix: any;
  error: boolean;
  map: any;
  allNewsPath: any;

  constructor(
		private router: Router,
		private route: ActivatedRoute,
		private newsService: NewsService,
		private rootScope:RootScopeService,
		private moment: MomentModule,
		private apollo: Apollo
   ) {

    this.route.params.subscribe( params => {

      this.content = false;

      this.error = false;

      const path = this.router.url;

      const that = this;

      newsService.getSingle(path, function(data) {
        if ( data['route'] == null ) {
          that.error = true;
        } else {
          that.content = data['route']['entity'];
        }

        that.allNewsPath = path.split("/");
        that.allNewsPath = that.allNewsPath.slice(0, that.allNewsPath.length - 1).join("/");

        //language service
        const langOptions = data['route']['languageSwitchLinks'];
        let langValues = {};
        for( var i in langOptions ){
          langValues[langOptions[i].language.id] = langOptions[i].url.path;
        }
        that.rootScope.set('langOptions', langValues);
        //language service
      });

    });
  }

  ngOnInit() {
    this.route.params.subscribe(
      (params: ActivatedRoute) => {
        this.path = this.router.url;
        this.lang = params['lang'];
        
        this.querySubscription = this.apollo.watchQuery({
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
      }
    )
  }
}
