import { signal, WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BOOK_STATUS } from '../../../core/constants/book.constants';
import { Book } from '../../../core/models/book.model';
import { BooksService } from '../../books/services/books.service';
import { WishlistService } from './wishlist.service';

function book(id: string, status: Book['status']): Book {
  return {
    id, title: 'Dune', author: 'Frank Herbert', language: 'en',
    condition: 'good', status, createdAt: '2026-01-01',
  };
}

describe('WishlistService', () => {
  let books: WritableSignal<Book[]>;
  let service: WishlistService;

  beforeEach(() => {
    books = signal<Book[]>([]);
    TestBed.configureTestingModule({
      providers: [{ provide: BooksService, useValue: { books: books.asReadonly() } }],
    });
    service = TestBed.inject(WishlistService);
  });

  it('returns zero for an empty collection', () => {
    expect(service.wishlistBooks()).toBe(0);
  });

  it('excludes owned and lent-out books', () => {
    books.set([book('1', BOOK_STATUS.OWNED), book('2', BOOK_STATUS.LENT_OUT)]);
    expect(service.wishlistBooks()).toBe(0);
  });

  it('counts each wishlist entry even when titles and authors match', () => {
    books.set([book('1', BOOK_STATUS.WISHLIST), book('2', BOOK_STATUS.OWNED),
      book('3', BOOK_STATUS.WISHLIST), book('4', BOOK_STATUS.LENT_OUT)]);
    expect(service.wishlistBooks()).toBe(2);
  });

  it('reacts to additions, status changes, removals and clearing', () => {
    expect(service.wishlistBooks()).toBe(0);
    books.set([book('1', BOOK_STATUS.WISHLIST), book('2', BOOK_STATUS.WISHLIST)]);
    expect(service.wishlistBooks()).toBe(2);
    books.update(current => current.map(item => item.id === '1'
      ? { ...item, status: BOOK_STATUS.OWNED } : item));
    expect(service.wishlistBooks()).toBe(1);
    books.update(current => current.filter(item => item.id !== '2'));
    expect(service.wishlistBooks()).toBe(0);
    books.set([book('3', BOOK_STATUS.WISHLIST)]);
    expect(service.wishlistBooks()).toBe(1);
    books.set([]);
    expect(service.wishlistBooks()).toBe(0);
  });
});
