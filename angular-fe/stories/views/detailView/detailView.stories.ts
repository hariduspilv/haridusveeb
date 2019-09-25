import { storiesOf } from '@storybook/angular';
import { TranslateService } from '@app/_modules/translate/translate.service';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@app/_modules/translate/translate.module';
import { DetailViewModule } from '@app/_views/detailView';
import { SettingsService } from '@app/_services';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { withKnobs } from '@storybook/addon-knobs';
import detailViewHtml from './detailView.html';
import detailViewMd from './detailView.md';
import { AssetsModule } from '@app/_assets';

const moduleMetadata = {
  imports: [
    RouterTestingModule,
    TranslateModule.forRoot(),
    DetailViewModule,
    BrowserAnimationsModule,
    AssetsModule,
  ],
  providers: [
    TranslateService,
    SettingsService,
  ],
};

const notes = { markdown: detailViewMd };

const storiesData = [
  {
    type: 'news',
    title: 'Uudis',
    path: '/uudised/henri-uudis-2019-09',
  },
  {
    type: 'event',
    title: 'Sündmus',
    path: '/s%C3%BCndmused/henri-s%C3%BCndmus-2019-09',
  },
  {
    type: 'studyProgramme',
    title: 'Eriala',
    path: '/erialad/arhitektuur',
  },
  {
    type: 'profession',
    title: 'Ametiala',
    path: '/ametialad/ajakirjanik',
  },
  {
    type: 'field',
    title: 'Valdkond',
    path: '/valdkonnad/henri-valdkond-2019-09',
  },
  {
    type: 'surveyPage',
    title: 'Tööjõuprognoos',
    // tslint:disable-next-line
    path: '/tööjõuprognoos/eesti-tööturg-täna-ja-homme-milliseid-ameteid-ja-oskusi-tööturg-lähitulevikus-vajab',
  },
  {
    type: 'resultPage',
    title: 'Tulemused',
    path: '/oska-tulemused/tulemused-testimisel',
  },
];

const storyData = (data) => {
  return {
    moduleMetadata,
    props: {
      data,
    },
    template: detailViewHtml,
  };
};

const stories = storiesOf('Detail views', module);

storiesData.forEach((item) => {
  stories.add(item.title, () => { return storyData(item); }, { notes });
});
