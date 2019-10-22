import { Component, OnInit, Input, Output, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as _moment from 'moment';
const moment = _moment;
import { RootScopeService } from '@app/_services/RootScopeService';
import { Subscription } from 'rxjs';
import { AlertsService, ModalService } from '@app/_services';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SettingsService } from '@app/_services/SettingsService';
import { UserService } from '@app/_services/userService';
import { TableService } from '@app/_services/tableService';

const acceptableFormsRestrictedLength = 4;

@Component({
  selector: 'applications',
  templateUrl: './applications.template.html',
  styleUrls: ['./applications.styles.scss'],
})

export class ApplicationsComponent implements OnDestroy, OnInit {
  @Input() jwt;
  loading = {
    initial: false,
    interval: false,
  };
  dummyDataVersion: string;
  startTime;
  endViewCheck: boolean = false;
  acceptableFormsLimiter = acceptableFormsRestrictedLength;
  lang: string;
  pollingLoader: boolean = true;
  data = {
    message: null,
    acceptable_forms: [],
    documents: [],
    drafts: [],
    educationalInstitutions: [],
  };
  requestIterator;
  requestIteratorTimeout = 2000;
  currentRole: string = '';

  institutionData = {};

  modalTitleExists = true;
  modalTopAction = false;
  modalBottomAction = false;
  institutionModalFields = [];

  acceptableFormsList = [];
  acceptableFormsListRestricted: boolean = true;
  tableOverflown: any = [{ 0: false, 1: false }];
  elemAtStart: any = [{ 0: true, 1: true }];
  initialized: any = [{ 0: false, 1: false }];
  private subscriptions: Subscription[] = [];
  userData;
  error = false;
  modalLoading = false;
  formOptions = {
    ownerType: [],
    ownershipType: [],
    studyInstitutionType: [],
  };

  constructor(
    public alertsService: AlertsService,
    public http: HttpClient,
    public rootScope: RootScopeService,
    public route: ActivatedRoute,
    public tableService: TableService,
    public user: UserService,
    public settings: SettingsService,
    public modalService: ModalService,
  ) { }

  pathWatcher() {
    const queryParams = this.route.queryParams.subscribe(
      (strings: ActivatedRoute) => {
        if (strings['version'] !== undefined) {
          this.dummyDataVersion = strings['version'];
        } else {
          this.dummyDataVersion = '1';
        }
      },
    );

    this.subscriptions = [...this.subscriptions, queryParams];
  }

  selectLanguage(obj: object) {
    if (obj[this.lang]) return obj[this.lang];
    return obj['et'];
  }

  compileXjsonLink(formName) {
    if (!formName) return '';
    return formName;
  }

  sortList(list, method) {
    const ACCEPTED = ['title', 'date'];
    if (!list || (list && !list.length) || !ACCEPTED.includes(method)) return list;

    function compareTitle(a, b) {
      if (!a['title'] || !b['title']) return -1;
      const title1 = this.selectLanguage(a['title']).toUpperCase();
      const title2 = this.selectLanguage(b['title']).toUpperCase();
      if (title1 < title2) {
        return -1;
      }
      if (title1 > title2) {
        return 1;
      }
      return 0;
    }

    const regex = /(\d{2}).(\d{2}).(\d{4})/;
    function compareDate(a, b) {
      if (!a['document_date'] || !b['document_date']) return -1;
      return Number(new Date(b.document_date.replace(regex, '$3/$2/$1'))) - Number(new Date(a.document_date.replace(regex, '$3/$2/$1')));
    }

    if (method === 'title') return list.sort(compareTitle);
    return list.sort(compareDate);
  }

  formatAcceptableForms(list) {
    if (this.acceptableFormsListRestricted) {
      return JSON.parse(JSON.stringify(list)).splice(0, acceptableFormsRestrictedLength);
    }

    return JSON.parse(JSON.stringify(list));
  }

  toggleAcceptableFormsList() {
    this.acceptableFormsListRestricted = this.acceptableFormsListRestricted ? false : true;
    this.acceptableFormsList = this.formatAcceptableForms(this.data.acceptable_forms);
  }

  fetchData() {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.jwt);

    setTimeout(() => {
      const subscription = this.http.get(this.settings.url + '/dashboard/applications/1?_format=json', { headers }).subscribe((response: any) => {
        if (typeof response.found !== undefined && response.found === null) {
          this.fetchData();
        } else {
          if (response['error'] && response['error']['message_text']) {
            this.alertsService.info(response['error']['message_text']['et'], 'general', 'applications', false, false);
          } else if (this.currentRole === 'natural_person') {
            this.data.acceptable_forms = response['acceptable_forms'];
            this.data.drafts = response['drafts'];
            this.data.documents = response['documents'];
            this.data.acceptable_forms = this.sortList(this.data.acceptable_forms, 'title');
            this.data.drafts = this.sortList(this.data.drafts, 'title');
            this.data.documents = this.sortList(this.data.documents, 'date');
            this.acceptableFormsList = this.formatAcceptableForms(this.data.acceptable_forms);
          } else {
            const responseData = response['educationalInstitutions'].map((elem) => {
              elem.documents = this.sortList(elem.documents, 'date');
              elem.acceptable_forms = this.sortList(elem.acceptable_forms, 'title');
              elem.drafts = this.sortList(elem.drafts, 'title');
              return elem;
            });
            if (JSON.stringify(this.data.educationalInstitutions) !== JSON.stringify(responseData)) {
              this.data.educationalInstitutions = responseData;
              if (response['message']) {
                this.alertsService.info(response['message'], 'general', 'applications', false, false);
              }
              if (this.data.educationalInstitutions && this.data.educationalInstitutions.length) {
                this.data.educationalInstitutions.forEach((elem, index) => {
                  this.tableOverflown[index] = { 0: false, 1: false, 2: false };
                  this.elemAtStart[index] = { 0: true, 1: true, 2: true };
                  this.initialized[index] = { 0: false, 1: false, 2: false };
                });
              }
            }
          }
          this.loading['initial'] = false;
        }
        subscription.unsubscribe();
      });
    },         1000);
  }

  initialTableCheck(id, parentIndex, index) {
    const element = document.getElementById(id);
    if (element) {
      this.tableOverflown[parentIndex][index] = (element.scrollWidth - element.scrollLeft) > element.clientWidth;
      this.initialized[parentIndex][index] = true;
    }
  }

  institutionInfoFieldSum(school) {
    let counter = 0;
    if (school.institutionInfo.contacts && school.institutionInfo.contacts.contactEmail) counter = + 1;
    if (school.institutionInfo.contacts && school.institutionInfo.contacts.contactPhone) counter = + 1;
    if (school.institutionInfo.contacts && school.institutionInfo.contacts.webpageAddress) counter = + 1;
    if (school.institutionInfo.address && school.institutionInfo.address.addressHumanReadable) counter = + 1;
    return counter;
  }

  loadInstitutionModal() {
    this.institutionModalFields = [
      {
        col: 12,
        type: 'text',
        title: 'school.institution_name',
        modelName: 'name',
        required: true,
      },
      {
        col: 12,
        type: 'text',
        title: 'dashboard.nameENG',
        modelName: 'nameENG',
        required: false,
      },
      {
        col: 6,
        type: 'text',
        title: 'dashboard.contactPhone',
        modelName: 'contactPhone',
        required: true,
      },
      {
        col: 6,
        type: 'text',
        title: 'event.participant_email',
        modelName: 'contactEmail',
        required: true,
      },
      {
        col: 12,
        type: 'text',
        title: 'dashboard.address',
        modelName: 'address',
        required: true,
      },
      {
        col: 6,
        type: 'text',
        title: 'dashboard.webpageAddress',
        modelName: 'webpageAddress',
        required: true,
      },
      {
        col: 6,
        type: 'select',
        title: 'dashboard.ownerType',
        modelName: 'ownerType',
        options: [],
        required: true,
      },
      {
        col: 6,
        type: 'select',
        title: 'school.ownership',
        modelName: 'ownershipType',
        options: [],
        required: true,
      },
      {
        col: 6,
        type: 'select',
        title: 'dashboard.studyInstitutionType',
        modelName: 'studyInstitutionType',
        options: [],
        required: true,
      },
    ];

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.jwt);
    this.error = false;
    this.modalLoading = true;
    this.modalService.toggle('institutionModal');
    const sub = this.http.get(this.settings.url + '/educational-institution/data?_format=json', { headers }).subscribe((response: any) => {

      Object.keys(this.formOptions).forEach((key) => {
        Object.values(response[key]).forEach((elem, index) => {
          elem['id'] = Object.keys(response[key])[index];
          this.formOptions[key].push(elem);
        });
      });

      this.modalLoading = false;
      sub.unsubscribe();
    });
  }

  ngOnInit() {
    this.lang = this.rootScope.get('lang');
    this.userData = this.jwt ? this.user.decodeToken(this.jwt) : this.user.getData();
    this.currentRole = this.userData['role']['current_role']['type'];
    this.pathWatcher();
    this.startTime = Date.now();
    this.loading['initial'] = true;
    this.fetchData();
  }

  ngAfterViewChecked() {
    if (!this.endViewCheck) {
      this.initialTableCheck('table_0', 0, 0);
      this.initialTableCheck('table_1', 0, 1);
      if (this.data.educationalInstitutions && this.data.educationalInstitutions.length) {
        this.data.educationalInstitutions.forEach((elem, index) => {
          this.initialTableCheck('juridicalFirst_' + index, index, 0);
          this.initialTableCheck('juridicalSecond_' + index, index, 1);
          this.initialTableCheck('juridicalThird_' + index, index, 2);
        });
        if (document.getElementById('juridicalThird_' + (this.data.educationalInstitutions.length - 1))) {
          this.endViewCheck = true;
        }
      }
    }
  }

  ngOnDestroy() {
    if (this.requestIterator) {
      clearTimeout(this.requestIterator);
    }

    /* Clear all subscriptions */
    for (const sub of this.subscriptions) {
      if (sub && sub.unsubscribe) {
        sub.unsubscribe();
      }
    }
  }
}
