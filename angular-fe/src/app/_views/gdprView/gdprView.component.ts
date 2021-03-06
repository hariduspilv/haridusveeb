import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService, AuthService, AlertsService } from '@app/_services';
import FieldVaryService from '@app/_services/FieldVaryService';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@app/_modules/translate/translate.service';

@Component({
  selector: 'gdprView',
  templateUrl: 'gdprView.template.html',
  styleUrls: ['gdprView.styles.scss'],
})

export class GdprViewComponent implements OnInit{

  public data: any;
  public groupedData: any[] = [];
  public breadcrumbs: any = [
    {
      title: 'Avaleht',
      link: '/',
    },
    {
      title: 'Minu töölaud',
      link: '/töölaud',
    },
    {
      title: 'Sinu andmete kasutajad',
    },
  ];
  public loading = false;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private params: any;

  public requestIterator: any;
  public requestIteratorTimeout = 1000;
  public requestCounter: number = 0;

  constructor (
    private http: HttpClient,
    private settings: SettingsService,
    private location: Location,
    public auth: AuthService,
    private router: ActivatedRoute,
    private alerts: AlertsService,
    private translate: TranslateService,
  ) {}

  private groupByReceiver() {
    this.groupedData = [
      ...new Set(this.data.value.GDPR.map(el => el.receiver))]
        .sort().map((el) => {
          return {
            institution: el,
            queries: this.data.value.GDPR.filter((query) => {
              if (query.receiver === el) {
                return true;
              }
              return false;
            }),
          };
        });
    this.groupedData = this.groupedData.map((el) => {
      if (el.institution.match(/<a href=".+?>.+<\/a>/g, '')) {
        return {
          institution: el.institution.replace(/<a href=".+?>/g, '').replace(/<\/a>/g, ''),
          queries: el.queries,
          link: el.institution.replace('href=', 'target="_blank" href='),
        };
      }
      return {
        institution: el.institution.replace(/<a href=".+?>/g, '').replace(/<\/a>/g, ''),
        queries: el.queries,
        link: false,
      };
    });
    this.loading = false;
  }

  getData(init = true) {
    this.loading = true;
    this.http
    .get(`${this.settings.url}/dashboard/eeIsikukaart/eeIsikukaartGDPR`)
    .subscribe(
      (response: any) => {
        if (response.redis_hit && response.value) {
          this.loading = false;
          this.data = response;
          this.groupByReceiver();
        }
        if (response.redis_hit && !response.value) {
          this.loading = false;
          this.data = false;
        }
        if (this.groupedData.length === 0) {
          this.alerts.info(this.translate.get('xjson.data_missing'), 'no-results');
        }
      });
  }
  ngOnInit() {
    this.router.queryParams.pipe(takeUntil(this.destroy$)).subscribe((val) => {
      this.params = val;
      this.getData();
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    if (this.requestIterator) {
      clearTimeout(this.requestIterator);
    }
  }
}
