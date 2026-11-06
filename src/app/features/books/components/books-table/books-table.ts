import { Component, input, output } from '@angular/core';

import { Book } from '../../../../core/models/book.model';
import { BOOK_SORT_FIELD, BookSortField, SORT_DIRECTION, SortDirection } from '../../constants/book-filter.constants';

@Component({
  imports: [],
  selector: 'mbs-books-table',
  styleUrl: './books-table.scss',
  templateUrl: './books-table.html',
})
export class BooksTable {
  readonly books = input.required<Book[]>();
  readonly sortField = input.required<BookSortField>();
  readonly sortDirection = input.required<SortDirection>();

  readonly sortRequested = output<BookSortField>();
  readonly editBook = output<Book>();
  readonly deleteBook = output<Book>();

  protected readonly BOOK_SORT_FIELD = BOOK_SORT_FIELD;
  protected readonly SORT_DIRECTION = SORT_DIRECTION;

  sortByToEmit(sortValue: BookSortField) {
    this.sortRequested.emit(sortValue);
  }

  getSortingDirectionArrow(columnName: BookSortField): string {
    if (this.sortField() === columnName) {
      return this.sortDirection() === SORT_DIRECTION.ASC ? '↑' : '↓';
    } else {
      return '↕';
    }
  }
}
