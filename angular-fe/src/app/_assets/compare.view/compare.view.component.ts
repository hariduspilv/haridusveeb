import { Component, Input } from '@angular/core';
import { CompareComponent } from '@app/_assets/compare/compare.component';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '@app/_services/SettingsService';
import { TranslateService } from '@app/_modules/translate/translate.service';
import { CompareService } from '@app/_services';
import { Router } from '@angular/router';
import { translationsPerType } from '../compare/helpers/compare';
@Component({
  selector: 'compare-view',
  templateUrl: './compare.view.template.html',
  styleUrls: ['./compare.view.styles.scss'],
})

export class CompareViewComponent extends CompareComponent {
  @Input() key: string;
  @Input() queryName: string;
  private queryId: string;
  private loading: boolean = false;
  private translations = translationsPerType;
  public compare: String[] = [];
  private deleteText: string = '';
  private deleteIndicator: number = 1;
  constructor(
    private http: HttpClient,
    private settings: SettingsService,
    public translateService: TranslateService,
    public compareService: CompareService,
    public router: Router) {
    super(null, null, null, null);
  }

  ngOnInit() {
    this.compare = this.readFromLocalStorage(this.key);
    this.queryId = this.settings.get(`request.${this.queryName}`);
    this.getData();
  }

  getData() {
    this.loading = true;
    const allVars = {
      'studyProgramme.compare': {
        lang: 'ET',
        nidValues: `[${this.compare.map(id => id.toString())}]`,
      },
      'oskaProfessions.compare': {
        lang: 'ET',
        titleValue: '',
        titleEnabled: false,
        oskaFieldValue: '',
        oskaFieldEnabled: false,
        fixedLabelValue: '',
        fixedLabelEnabled: false,
        fillingBarValues: [],
        fillingBarFilterEnabled: false,
        sortedBy: false,
        offset: '0',
        limit: '3',
        sortField: 'title',
        sortDirection: 'ASC',
        indicatorSort: false,
        nid: this.compare,
        nidEnabled: true,
      },
    };
    const variables = allVars[this.key];

    let query = `queryName=${this.queryName}`;
    query += `&queryId=${this.queryId}&variables=${JSON.stringify(variables)}`;
    const path = `${this.settings.url}/graphql?${query}`.trim();
    this.http.get(path).subscribe((response) => {
      const data = response['data']['nodeQuery']['entities'];
      this.compareService.formatData(data, this.compare, this.key);
      this.loading = false;
      if (!data.length) this.rerouteToParent();
    },                            (err) => {
      this.rerouteToParent();
      this.loading = false;
    });
  }

  rerouteToParent(): void {
    const parentUrl = this.router.url.split('/')[0];
    this.router.navigateByUrl(parentUrl);
  }

  removeItemFromList(id, sessionStorageKey) {
    const existing = this.readFromLocalStorage(sessionStorageKey);
    this.removeItemFromLocalStorage(id, sessionStorageKey, existing);
    const data = this.compareService.list.filter(item => item.nid !== id);
    this.compareService.formatData(data, this.compare, this.key);

    if (!this.compareService.list.length) {
      this.rerouteToParent();
    }
  }

  setDeleteText() {
    this.deleteText = this.deleteIndicator.toString();
    this.deleteIndicator += 1;
  }
}
