import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { TopBar } from '../top-bar/top-bar';
import { SideNav } from '../side-nav/side-nav';
import { BookFormDialog } from '../../../features/books/components/book-form-dialog/book-form-dialog';
import { BookDialogService } from '../../../features/books/services/book-dialog.service';

@Component({
  selector: 'mbs-shell',
  imports: [
    TopBar,
    SideNav,
    RouterOutlet,
    BookFormDialog,
  ],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
})
export class AppShell {
  bookDialogService = inject(BookDialogService);
}
