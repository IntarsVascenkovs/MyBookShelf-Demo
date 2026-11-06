import { computed, inject, Injectable } from '@angular/core';
import { BooksService } from '../../books/services/books.service';
import { DuplicateBookGroup } from '../models/duplicate-book-group.model';
import { BOOK_STATUS } from '../../../core/constants/book.constants';

@Injectable({ providedIn: 'root' })
export class DuplicatesService {
  private readonly bookService = inject(BooksService);

  readonly duplicateGroups = computed<DuplicateBookGroup[]>(() => {
    const duplicateBooksList = new Map<string, DuplicateBookGroup>();

    for (const book of this.bookService.books()) {
      if (book.status !== BOOK_STATUS.OWNED) {
        continue;
      }

      const key = `${book.title.trim().toLowerCase()}|${book.author.trim().toLowerCase()}`;
      const existingGroup = duplicateBooksList.get(key);

      if (existingGroup === undefined) {
        duplicateBooksList.set(key, {
          title: book.title,
          author: book.author,
          bookIds: [ book.id ],
        });
      } else {
        existingGroup.bookIds.push(book.id);
      }
    }

    return [ ...duplicateBooksList.values() ].filter(group => group.bookIds.length > 1);
  });

  readonly duplicateBooksCount = computed(() =>
    this.duplicateGroups().reduce((total, group) => total + group.bookIds.length - 1, 0)
  );
}
