import { computed, inject, Injectable } from '@angular/core';
import { BooksService } from '../../books/services/books.service';
import { BOOK_STATUS } from '../../../core/constants/book.constants';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly bookService = inject(BooksService);

  readonly wishlistBooks = computed(() =>
    this.bookService.books().filter(book => book.status === BOOK_STATUS.WISHLIST).length
  );
}
