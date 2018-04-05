import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewsComponent, FrontpageComponent } from './_views';

const appRoutes: Routes = [
  { path: ':lang/artiklid/:id', component: NewsComponent },
  { path: ':lang/articles/:id', component: NewsComponent },
  { path: '', component: FrontpageComponent },
  { path: ':lang', component: FrontpageComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

export const routedComponents = [
  NewsComponent,
  FrontpageComponent
];
