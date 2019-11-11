import { Component, Input, OnInit } from '@angular/core';
import { SettingsService } from '@app/_services/SettingsService';
import { HttpClient } from '@angular/common/http';

interface BreadcrumbsItem {
  title: string;
  link: string;
}

@Component({
  selector: 'breadcrumbs',
  templateUrl: './breadcrumbs.template.html',
  styleUrls: ['./breadcrumbs.styles.scss'],
})

export class BreadcrumbsComponent implements OnInit{
  @Input() data: BreadcrumbsItem[] = [];
  @Input() path: string = '';

  constructor(
    private settings: SettingsService,
    private http: HttpClient,
  ) {}

  private parseData(response): void {
    try {
      this.data = response['data']['route']['breadcrumb'].map((item) => {
        return {
          title: item.text,
          link: item.url.path,
        };
      });

    } catch (err) {
      console.log('Unable to parse Breadcrumbs data;');
    }

  }

  private getData(): void {
    const variables = {
      path: this.path,
    };
    const path = `${this.settings.query('getBreadcrumbs')}&variables=${JSON.stringify(variables)}`;
    const subscription = this.http.get(path).subscribe((response) => {
      this.parseData(response);
    });
  }
  ngOnInit() {
    if (this.path) {
      this.getData();
    }
  }
}