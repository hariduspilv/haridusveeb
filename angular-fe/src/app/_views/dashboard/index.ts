import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { AssetsModule } from '@app/_assets';
import { TranslateModule } from '@app/_modules/translate';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
];

@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    AssetsModule,
    TranslateModule,
  ],
  providers: [
  ],
  bootstrap: [],
})

export class DashboardViewModule { }
