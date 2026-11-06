import { Routes } from '@angular/router';
import { BooksList } from './features/books/pages/books-list/books-list';
import { AppShell } from './core/layout/app-shell/app-shell';
import { Dashboard } from './features/dashboard/pages/dashboard/dashboard';

export const routes: Routes = [
  {
    path: '',
    component: AppShell,
    children: [
      { path: '', component: Dashboard },
      { path: 'books', component: BooksList },
    ],
  },
];
