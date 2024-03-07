import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details.component';

export const appRoutes: Route[] = [
  { path: '', component: HomeComponent },
  { path: 'search/:game-search', component: DetailsComponent },
  { path: 'details/:id', component: DetailsComponent },
];
