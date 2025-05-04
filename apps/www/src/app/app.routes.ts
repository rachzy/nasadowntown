import { Route } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';

export type CustomRoute = Route & {
  menuTitle?: string;
  showInSidebar?: boolean;
};

export const appRoutes: CustomRoute[] = [
  {
    path: '',
    title: 'Home',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    menuTitle: 'Home',
    title: 'Nasa Downtown',
    component: HomePageComponent,
    showInSidebar: true,
  },
  {
    path: 'mars-photos',
    title: 'Mars Photos',
    loadComponent: () =>
      import('./pages/mars-page/mars-page.component').then(
        (m) => m.MarsPageComponent
      ),
    showInSidebar: true,
  },
];
