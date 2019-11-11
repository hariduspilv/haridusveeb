import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AssetsModule } from '@app/_assets';
import { TranslateModule } from '@app/_modules/translate';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '@app/_interceptors';
import { StudyProgrammeListViewComponent } from './studyProgrammeListView.component';

const routes: Routes = [
  {
    path: '',
    component: StudyProgrammeListViewComponent,
  },
];

@NgModule({
  declarations: [
    StudyProgrammeListViewComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    AssetsModule,
    TranslateModule,
    CommonModule,
    FormsModule,
  ],
  exports: [
    StudyProgrammeListViewComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor , multi: true },
  ],
})

export class StudyProgrammeListViewModule { }