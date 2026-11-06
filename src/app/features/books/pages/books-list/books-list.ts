import { Component, inject, signal, computed } from '@angular/core';

import { BooksService } from '../../services/books.service';
import { BOOK_STATUS, BookStatus } from '../../../../core/constants/book.constants';
import { BOOK_SORT_FIELD, SORT_DIRECTION, BookSortField, SortDirection } from '../../constants/book-filter.constants';
import { BooksTable } from '../../components/books-table/books-table';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { BookDialogService } from '../../services/book-dialog.service';
import { Book } from '../../../../core/models/book.model';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';

const ALL_STATUSES = 'ALL' as const;
type StatusFilter = BookStatus | typeof ALL_STATUSES;

@Component({
  selector: 'mbs-books-list',
  imports: [
    BooksTable,
    Pagination,
    ConfirmDialog
  ],
  templateUrl: './books-list.html',
  styleUrl: './books-list.scss',
})
export class BooksList {
  private readonly booksService = inject(BooksService);

  protected readonly bookDialogService = inject(BookDialogService);

  readonly pageSize = signal(10);
  readonly currentPage = signal(1);

  protected readonly BOOK_STATUS = BOOK_STATUS;
  protected readonly ALL_STATUSES = ALL_STATUSES;
  protected readonly BOOK_SORT_FIELD = BOOK_SORT_FIELD;

  protected readonly searchTerm = signal('');
  protected readonly selectedStatus = signal<StatusFilter>(ALL_STATUSES);

  protected readonly sortField = signal<BookSortField>(BOOK_SORT_FIELD.TITLE);
  protected readonly sortDirection = signal<SortDirection>(SORT_DIRECTION.ASC);

  protected readonly bookToDelete = signal<Book | null>(null);

  protected readonly isResetConfirmationOpen = signal(false);

  protected readonly filteredBooks = computed(() => {
    const books = this.booksService.books();
    const search = this.searchTerm().trim().toLowerCase();
    const status = this.selectedStatus();

    console.log({
      totalBooks: books.length,
      selectedStatus: status,
      searchTerm: search,
    });

    return books.filter(book => {
      const matchesSearch =
        book.title.toLowerCase().includes(search) ||
        book.author.toLowerCase().includes(search);

      const matchesStatus = status === ALL_STATUSES || book.status === status;

      return matchesSearch && matchesStatus;
    })
  })

  protected readonly sortedBooks = computed(() => {
    const books = [ ...this.filteredBooks() ];
    const field = this.sortField();
    const direction = this.sortDirection();

    return books.sort((a, b) => {
      let comparison: number;

      if (field === BOOK_SORT_FIELD.YEAR) {
        comparison = (a.publicationYear ?? 0) - (b.publicationYear ?? 0);
      } else {
        comparison = a[field].localeCompare(b[field]);
      }

      return direction === SORT_DIRECTION.ASC ? comparison : -comparison;
    });
  });

  protected sortBy(field: BookSortField): void {
    if (this.sortField() === field) {
      this.sortDirection.update(direction => direction === SORT_DIRECTION.ASC ? SORT_DIRECTION.DESC : SORT_DIRECTION.ASC);
    } else {
      this.sortField.set(field);
      this.sortDirection.set(SORT_DIRECTION.ASC);
    }

    this.currentPage.set(1);
  }

  protected onSearch(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  protected onStatusChange(value: StatusFilter): void {
    this.selectedStatus.set(value);
    this.currentPage.set(1);
  }

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.sortedBooks().length / this.pageSize()))
  );

  readonly validCurrentPage = computed(() =>
    Math.min(this.currentPage(), this.totalPages())
  );

  readonly paginatedBooks = computed(() => {
    const books = this.sortedBooks();
    const page = this.validCurrentPage();
    const size = this.pageSize();

    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;

    return books.slice(startIndex, endIndex);
  })

  protected changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) this.currentPage.set(page);
  }

  protected onEditBook(book: Book): void {
    this.bookDialogService.openEdit(book);
  }

  protected requestDelete(book: Book): void {
    this.bookToDelete.set(book);
  }

  protected cancelDelete(): void {
    this.bookToDelete.set(null);
  }

  protected confirmDelete(): void {
    const book = this.bookToDelete();

    if (!book) {
      return;
    }

    const deleted = this.booksService.deleteBook(book.id);

    if (!deleted) {
      console.error('Book not found:', book.id);
      return;
    }

    this.bookToDelete.set(null);
  }

  protected requestReset(): void {
    this.isResetConfirmationOpen.set(true);
  }

  protected cancelReset(): void {
    this.isResetConfirmationOpen.set(false);
  }

  protected confirmReset(): void {
    this.booksService.resetDemoData();
    this.currentPage.set(1);
    this.isResetConfirmationOpen.set(false);
  }
}
