import { Route } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    title: 'Nasa Downtown',
    component: HomePageComponent,
  },
  {
    path: 'mars',
    title: 'Mars',
    loadComponent: () =>
      import('./pages/mars-page/mars-page.component').then(
        (m) => m.MarsPageComponent
      ),
  },
];
