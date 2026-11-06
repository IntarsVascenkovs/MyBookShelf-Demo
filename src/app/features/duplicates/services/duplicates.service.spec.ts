import { signal, WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BOOK_STATUS } from '../../../core/constants/book.constants';
import { Book } from '../../../core/models/book.model';
import { BooksService } from '../../books/services/books.service';
import { DuplicatesService } from './duplicates.service';

function book(id: string, overrides: Partial<Book> = {}): Book {
  return {
    id, title: 'Dune', author: 'Frank Herbert', language: 'en',
    condition: 'good', status: BOOK_STATUS.OWNED, createdAt: '2026-01-01',
    ...overrides,
  };
}

describe('DuplicatesService', () => {
  let books: WritableSignal<Book[]>;
  let service: DuplicatesService;

  beforeEach(() => {
    books = signal<Book[]>([]);
    TestBed.configureTestingModule({
      providers: [{ provide: BooksService, useValue: { books: books.asReadonly() } }],
    });
    service = TestBed.inject(DuplicatesService);
  });

  it('returns no groups or extra copies for an empty collection', () => {
    expect(service.duplicateGroups()).toEqual([]);
    expect(service.duplicateBooksCount()).toBe(0);
  });

  it('keeps different titles or authors separate', () => {
    books.set([book('1'), book('2', { title: 'Other' }),
      book('3', { author: 'Another Author' })]);
    expect(service.duplicateGroups()).toEqual([]);
    expect(service.duplicateBooksCount()).toBe(0);
  });

  it('ignores case and surrounding whitespace in both title and author', () => {
    books.set([book('1'), book('2', {
      title: ' \tDUNE\n', author: '\n FRANK HERBERT \t',
    })]);
    expect(service.duplicateGroups()).toEqual([
      { title: 'Dune', author: 'Frank Herbert', bookIds: ['1', '2'] },
    ]);
    expect(service.duplicateBooksCount()).toBe(1);
  });

  it('preserves internal whitespace when matching', () => {
    books.set([book('1'), book('2', { title: 'Du ne' }),
      book('3', { author: 'Frank  Herbert' })]);
    expect(service.duplicateGroups()).toEqual([]);
  });

  it('groups only owned copies, excluding wishlist and lent-out matches', () => {
    books.set([
      book('1'), book('2'),
      book('3', { status: BOOK_STATUS.WISHLIST }),
      book('4', { status: BOOK_STATUS.LENT_OUT }),
      book('5', { title: 'Other', status: BOOK_STATUS.WISHLIST }),
      book('6', { title: 'Other', status: BOOK_STATUS.LENT_OUT }),
      book('7', { title: 'Single owned' }),
      book('8', { title: 'Single owned', status: BOOK_STATUS.WISHLIST }),
    ]);
    expect(service.duplicateGroups()).toEqual([
      { title: 'Dune', author: 'Frank Herbert', bookIds: ['1', '2'] },
    ]);
    expect(service.duplicateBooksCount()).toBe(1);
  });

  it('sums extra copies across groups rather than all grouped books', () => {
    books.set([book('1'), book('2'), book('3'),
      book('4', { title: 'Other' }), book('5', { title: 'Other' }),
      book('6', { title: 'Unique' })]);
    expect(service.duplicateGroups().map(group => group.bookIds)).toEqual([
      ['1', '2', '3'], ['4', '5'],
    ]);
    expect(service.duplicateBooksCount()).toBe(3);
  });

  it('reacts to additions, status changes and clearing', () => {
    books.set([book('1')]);
    expect(service.duplicateGroups()).toEqual([]);
    expect(service.duplicateBooksCount()).toBe(0);
    books.update(current => [...current, book('2'), book('3')]);
    expect(service.duplicateGroups()[0].bookIds).toEqual(['1', '2', '3']);
    expect(service.duplicateBooksCount()).toBe(2);
    books.update(current => current.map(item => item.id === '1'
      ? item : { ...item, status: BOOK_STATUS.WISHLIST }));
    expect(service.duplicateGroups()).toEqual([]);
    expect(service.duplicateBooksCount()).toBe(0);
    books.set([]);
    expect(service.duplicateGroups()).toEqual([]);
    expect(service.duplicateBooksCount()).toBe(0);
  });
});
