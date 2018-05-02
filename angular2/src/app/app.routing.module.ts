import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewsComponent, FrontpageComponent, EventsComponent, PersonalDataComponent, EventsSingleComponent } from './_views';

const appRoutes: Routes = [
  { path: ':lang/artiklid/:id', component: NewsComponent },
  { path: ':lang/articles/:id', component: NewsComponent },
  { path: ':lang/events', component: EventsComponent },
  { path: ':lang/events/:id', component: EventsSingleComponent },
  { path: ':lang/sundmused', component: EventsComponent },
  { path: ':lang/sundmused/:id', component: EventsSingleComponent },
  { path: ':lang', component: FrontpageComponent },

  { path: ':lang/isikukaart', component: PersonalDataComponent },
  { path: '**', redirectTo: '/et', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

export const routedComponents = [
  NewsComponent,
  FrontpageComponent,
  EventsComponent,
  EventsSingleComponent,
  PersonalDataComponent
];
