import { Route } from '@angular/router';
import { Main } from './features/layouts/main/main';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  {
    path: 'main',
    component: Main,
    title: 'Main',
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        title: 'Home',
        loadComponent: () =>
          import('./features/pages/home/home').then((c) => c.Home),
      },
    ],
  },
  {
    path: 'auth',
    title: 'Authintication',
    loadComponent: () =>
      import('./features/layouts/auth/auth').then((c) => c.Auth),
    children: [
      {
        path: 'login',
        title: 'Login',
        loadComponent: () =>
          import('./features/layouts/auth/components/login/login').then(
            (c) => c.Login
          ),
      },
      {
        path: 'register',
        title: 'Register',
        loadComponent: () =>
          import('./features/layouts/auth/components/register/register').then(
            (c) => c.Register
          ),
      },
      {
        path: 'forgetpass',
        title: 'Forget Password',
        loadComponent: () =>
          import(
            './features/layouts/auth/components/forgetpass/forgetpass'
          ).then((c) => c.Forgetpass),
      },
    ],
  },
  {
    path: '**',
    title: 'Not Found',
    loadComponent: () =>
      import('./features/pages/notfound/notfound').then((c) => c.Notfound),
  },
];
