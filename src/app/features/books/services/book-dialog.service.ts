import { computed, Service, signal } from '@angular/core';

import { BOOK_STATUS, BookStatus } from '../../../core/constants/book.constants';
import { Book } from '../../../core/models/book.model';

@Service()
export class BookDialogService {
  private readonly _isOpen = signal(false);
  private readonly _initialStatus = signal<BookStatus>(BOOK_STATUS.OWNED);
  private readonly _editingBook = signal<Book | null>(null);

  readonly isOpen = this._isOpen.asReadonly();
  readonly initialStatus = this._initialStatus.asReadonly();
  readonly editingBook = this._editingBook.asReadonly();

  readonly isEditMode = computed(() => this._editingBook !== null);

  open(status: BookStatus = BOOK_STATUS.OWNED): void {
    this._editingBook.set(null);
    this._initialStatus.set(status);
    this._isOpen.set(true);
  }

  openEdit(book: Book): void {
    this._editingBook.set(book);
    this._isOpen.set(true);
  }

  close(): void {
    this._isOpen.set(false);
    this._editingBook.set(null);
  }
}
