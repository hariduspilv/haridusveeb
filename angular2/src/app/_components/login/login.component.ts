import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { SideMenuService, RootScopeService } from '@app/_services';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SettingsService } from '@app/_services/settings.service';
import { UserService } from '@app/_services/userService';
import { taraLoginModal } from '../dialogs/taraLogin/taraLogin.modal';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit{
  
  loginVisible: boolean;
  postUrl:string;
  mobileUrl:string;
  formModels: object = {};
  data: any;

  mobError: object = {
    state: false,
    text: ''
  };
  error: boolean = false;

  user: any;

  loader:boolean;

  taraUrl: any;
  harIDurl: any;

  basicLogin: boolean = false;

  constructor(
    private route : ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private http: HttpClient,
    private sidemenu: SideMenuService,
    private settings: SettingsService,
    private userService: UserService,
    private rootScope: RootScopeService,
    public dialog: MatDialog
  ) {
    this.postUrl = this.settings.url+this.settings.login;
    this.mobileUrl = this.settings.url+this.settings.mobileLogin;
  }

  toggleLogin() {
    this.loginVisible = !this.loginVisible;
  }

  submit(type) {

    /* clear all values */
    this.error = false;
    this.mobError['state'] = false;
    this.mobError['text'] = '';
    this.loader = true;
    this.user = false;
    this.userService.clearStorage();
    this.formModels['password'] = !this.formModels['password'] ? '' : this.formModels['password'];
    this.formModels['auth_method'] = type === 'mobile' ? 'mobile_id' : 'basic';
    
    let headers = new HttpHeaders();
    headers = headers.append('X-CSRF-TOKEN', sessionStorage.getItem('xcsrfToken'));

    if (type === 'mobile') {
      let mobileForm = {telno: this.formModels['tel']};
      this.http.post(this.mobileUrl, mobileForm, {headers}).subscribe(data => {
        let consecutiveForm = { session_code: data['Sesscode'], id_code: data['UserIDCode'], auth_method: 'mobile_id' }
        this.loginSubmit(consecutiveForm, headers, true)
      }, (data) => {
        this.loader = false;
        if( !data['token'] ) {
          this.mobError['state'] = true;
          this.mobError['text'] = data['error'] && data['error']['message'] ? data['error']['message'] : 'errors.request';
          return false; 
        }
      });
    } else {
      this.loginSubmit(this.formModels, headers, false)
    }
  }

  loginSubmit (form, headers, isMobile) {
    this.http.post(this.postUrl, form, {headers}).subscribe(data => {
      this.loader = false;
      this.data = data;
      
      if( !data['token'] ) { 
        if (isMobile) { 
          this.mobError['state'] = true; 
          this.mobError['text'] = data['error'] && data['error']['message'] ? data['error']['message'] : 'errors.request';
        }
        if (!isMobile) this.error = true; 
        return false; 
      }

      for( let i in this.formModels ){
        this.formModels[i] = '';
      };

      this.loginVisible = false;

      this.user = this.userService.storeData(data['token']);
      
      let redirectUrl = '/töölaud/taotlused';
      let lang = this.rootScope.get("lang");
      
      this.router.navigateByUrl("/", {skipLocationChange: true}).then( () => {
        this.router.navigateByUrl(redirectUrl);
        this.sidemenu.triggerLang();
      });
      
    }, (data) => {
      this.formModels['password'] = '';
      this.loader = false;
      if( !data['token'] ){
        if (isMobile) { 
          this.mobError['state'] = true; 
          this.mobError['text'] = data['error'] && data['error']['message'] ? data['error']['message'] : 'errors.request';
        }
        if (!isMobile) this.error = true;
        return false; 
      }
    });
  }

  openTara() {
    this.taraUrl = this.settings.url+"/external-login/tara";
    window.location.href = this.taraUrl;
  }
  openHarID() {
    this.harIDurl = this.settings.url+"/external-login/harid";
    window.location.href = this.harIDurl;
  }
  ngOnInit() {

    if( this.settings.url == "https://htm.wiseman.ee" || this.settings.url == "http://test-htm.wiseman.ee:30000" ){
      this.basicLogin = true;
    }
    
    this.user = this.userService.getData();
  }

  logOut() {
    this.userService.logout();
    this.user = this.userService.getData();
    this.rootScope.set('teachingsAccordion', 0);
    this.rootScope.set('certificatesAccordion', 0);
    this.sidemenu.triggerLang();
  }

  /*
  submit() {

    this.error = false;

    this.loader = true;

    this.userService.clearStorage();

    this.user = false;

    this.http.post(this.postUrl, this.formModels).subscribe(data => {

      this.formModels['password'] = '';

      this.loader = false;

      this.data = data;
      
      if( data['token'] ){
        
        sessionStorage.setItem("token", this.data.token);

        for( let i in this.formModels ){
          this.formModels[i] = '';
        };

        this.userService.triggerPageReload();
  
        this.loginVisible = false;

        this.userService.decodeToken();
      }else{
        this.error = true;
      }
      
    });
  }

  logOut() {
    this.userService.logout();
  }

  readStorage() {
    return sessionStorage.getItem("token");
  }

  ngOnInit() {
    this.userService.decodeToken();
  }

  */
}
