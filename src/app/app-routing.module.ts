import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'viewer',
    loadComponent: () =>
      import('./pages/viewer/viewer.component').then((m) => m.ViewerComponent),
  },
  {
    path: 'creation',
    loadComponent: () =>
      import('./pages/create/create.component').then((m) => m.CreateComponent),
  },
  {
    path: 'creation/:id',
    loadComponent: () =>
      import('./pages/create/create.component').then((m) => m.CreateComponent),
  },
];
