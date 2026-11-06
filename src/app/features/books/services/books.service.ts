import { Injectable, computed, signal, effect } from '@angular/core';

import { BOOKS } from '../data/books.mock';
import { Book, BookSchema, CreateBook } from '../../../core/models/book.model';
import { z } from 'zod';

const BOOKS_STORAGE_KEY = 'mybookshelf-demo-books';

@Injectable({ providedIn: 'root' })
export class BooksService {
  private readonly _books = signal<Book[]>(this.loadBooks());

  readonly books = this._books.asReadonly();

  readonly totalBooks = computed(() => this.books().length);

  constructor() {
    effect(() => {
      const books = this._books();

      try {
        localStorage.setItem(
          BOOKS_STORAGE_KEY,
          JSON.stringify(books)
        );
      } catch (error) {
        console.error('Failed to save books', error);
      }
    });
  }

  private loadBooks(): Book[] {
    try {
      const stored = localStorage.getItem(BOOKS_STORAGE_KEY);

      if (stored === null) {
        return structuredClone(BOOKS);
      }

      const parsed = JSON.parse(stored);
      const result = z.array(BookSchema).safeParse(parsed);

      if (result.success) {
        return result.data;
      }

      console.warn('Invalid saved book. Loading demo data.');
    } catch (error) {
      console.log('Failed to load saved books:', error);
    }

    return structuredClone(BOOKS);
  }

  addBook(data: CreateBook): Book {
    const createdBook = BookSchema.parse({
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    });

    this._books.update(books => [ ...books, createdBook ]);

    return createdBook;
  }

  updateBook(id: string, data: CreateBook): Book | null {
    const existingBook = this._books().find(book => book.id === id);

    if (!existingBook) {
      return null;
    }

    const updateBook = BookSchema.parse({
      ...existingBook,
      ...data,
      id: existingBook.id,
      createdAt: existingBook.createdAt,
    });

    this._books.update(books => books
      .map(book => book.id === id ? updateBook : book)
    );

    return updateBook;
  }

  deleteBook(id: string): boolean {
    if (!this._books().some(book => book.id === id)) {
      return false;
    }

    this._books.update(books =>
      books.filter(book => book.id !== id)
    );

    return true;
  }

  resetDemoData(): void {
    this._books.set(structuredClone(BOOKS));
  }
}
