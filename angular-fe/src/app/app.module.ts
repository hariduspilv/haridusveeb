import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID, APP_INITIALIZER } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { HttpClientModule, HttpClientJsonpModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule } from '@app/_modules/translate';
// tslint:disable-next-line: import-name
import localeEt from '@angular/common/locales/et';
import { registerLocaleData, Location } from '@angular/common';
import { AssetsModule } from './_assets';
import { RoutesModule } from './app.routes';
import { AuthInterceptor } from './_interceptors';
import { AmpService } from './_services/ampService';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
// We dont need short month names at all!
localeEt[5][1] = localeEt[5][2].map((item) => {
  return item.charAt(0).toUpperCase() + item.slice(1);
});

registerLocaleData(localeEt);

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    RoutesModule,
    AssetsModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    TranslateModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    { provide: LOCALE_ID, useValue:'et-EE' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AmpService,
    Location,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }
