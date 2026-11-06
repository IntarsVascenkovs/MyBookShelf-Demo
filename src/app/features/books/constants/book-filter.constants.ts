import { BookKey } from '../../../core/models/book.model';

export const BOOK_SORT_FIELD = {
  TITLE: BookKey.title,
  AUTHOR: BookKey.author,
  YEAR: BookKey.publicationYear,
  DATE_ADDED: BookKey.createdAt,
} as const;

export type BookSortField = (typeof BOOK_SORT_FIELD)[keyof typeof BOOK_SORT_FIELD];

export const SORT_DIRECTION = {
  ASC: 'asc',
  DESC: 'desc',
}

export type SortDirection = (typeof SORT_DIRECTION)[keyof typeof SORT_DIRECTION];
