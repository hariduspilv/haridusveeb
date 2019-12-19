import { storiesOf } from '@storybook/angular';
import { TranslateService } from '@app/_modules/translate/translate.service';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@app/_modules/translate/translate.module';
import { DetailViewModule } from '@app/_views/detailView';
import { SettingsService, RippleService, ModalService } from '@app/_services';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { withKnobs } from '@storybook/addon-knobs';
import detailViewHtml from './detailView.html';
import detailViewMd from './detailView.md';
import { AssetsModule, settingsProviderFactory } from '@app/_assets';
import { DetailViewComponent } from '@app/_views/detailView/detailView.component';
import { APP_BASE_HREF } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription, Subject, Observable, of } from 'rxjs';
import { APP_INITIALIZER } from '@angular/core';
import { EmbedVideoService } from 'ngx-embed-video';
import { InfoSystemViewComponent } from '@app/_views/infoSystemView/infoSystem.component';

const stories = storiesOf('Views', module);

stories.add(
  'Infosystem',
  () => {
    return {
      moduleMetadata: {
        declarations: [
          InfoSystemViewComponent,
        ],
        imports: [
          RouterTestingModule,
          TranslateModule.forRoot(),
          BrowserAnimationsModule,
          AssetsModule,
        ],
        providers: [
          TranslateService,
          SettingsService,
          RippleService,
          ModalService,
          EmbedVideoService,
          {
            provide: ActivatedRoute,
            useValue: { snapshot: {}, params: new Observable<Params>() } },
          {
            provide: APP_INITIALIZER,
            useFactory: settingsProviderFactory,
            deps: [SettingsService],
            multi: true,
          },
        ],
      },
      props: {
      },
      template: '<infoSystem-view></infoSystem-view>',
    };
  },
);