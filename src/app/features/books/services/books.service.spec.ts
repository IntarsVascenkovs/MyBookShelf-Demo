import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { BookSchema, CreateBook } from '../../../core/models/book.model';
import { BOOKS } from '../data/books.mock';
import { BooksService } from './books.service';

const newBook: CreateBook = {
  title: 'A new book',
  author: 'Test Author',
  language: 'en',
  condition: 'good',
  status: 'owned',
};

describe('BooksService', () => {
  let service: BooksService;

  beforeEach(() => {
    const storage = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    });
    service = TestBed.inject(BooksService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    vi.unstubAllGlobals();
  });

  it('starts with a readonly copy of the demo collection and counts all books', () => {
    expect(service.books()).toEqual(BOOKS);
    expect(service.books()).not.toBe(BOOKS);
    expect(service.totalBooks()).toBe(BOOKS.length);
    expect('set' in service.books).toBe(false);
    expect('update' in service.books).toBe(false);
  });

  it('adds a book with valid generated metadata and updates the count', () => {
    const created = service.addBook({ ...newBook, status: 'lent-out' });

    expect(created).toMatchObject({ ...newBook, status: 'lent-out' });
    expect(BookSchema.safeParse(created).success).toBe(true);
    expect(service.books()).toEqual([...BOOKS, created]);
    expect(service.totalBooks()).toBe(BOOKS.length + 1);
  });

  it('updates the matching book and preserves its ID and creation date', () => {
    const original = BOOKS[0];
    const changes = { ...newBook, status: 'wishlist' } as const;
    const updated = service.updateBook(original.id, changes);

    expect(updated).toEqual({ ...original, ...changes });
    expect(service.books()).toEqual([updated, ...BOOKS.slice(1)]);
    expect(service.totalBooks()).toBe(BOOKS.length);
  });

  it('deletes the matching book and updates the count', () => {
    expect(service.deleteBook(BOOKS[0].id)).toBe(true);
    expect(service.books()).toEqual(BOOKS.slice(1));
    expect(service.totalBooks()).toBe(BOOKS.length - 1);
  });

  it('returns failure results for missing IDs and leaves the collection intact', () => {
    const before = service.books();
    const missingId = '00000000-0000-4000-8000-000000000000';

    expect(service.updateBook(missingId, newBook)).toBeNull();
    expect(service.deleteBook(missingId)).toBe(false);
    expect(service.books()).toBe(before);
  });

  it('restores the demo collection and persists the reset', () => {
    service.deleteBook(BOOKS[0].id);
    service.updateBook(BOOKS[1].id, newBook);
    service.addBook(newBook);
    TestBed.tick();

    service.resetDemoData();

    expect(service.books()).toEqual(BOOKS);
    expect(service.totalBooks()).toBe(BOOKS.length);
    TestBed.tick();
    TestBed.resetTestingModule();
    expect(TestBed.inject(BooksService).books()).toEqual(BOOKS);
  });

  it('loads additions, updates and deletions when the service is recreated', () => {
    const created = service.addBook(newBook);
    const changes = { ...newBook, title: 'Updated title' };
    const updated = service.updateBook(BOOKS[0].id, changes);
    service.deleteBook(BOOKS[1].id);

    TestBed.tick();
    TestBed.resetTestingModule();
    const reloaded = TestBed.inject(BooksService);

    expect(reloaded).not.toBe(service);
    expect(reloaded.books()).toEqual([updated, ...BOOKS.slice(2), created]);
  });
});
