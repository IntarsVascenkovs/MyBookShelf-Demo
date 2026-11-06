import { z } from 'zod';

import { LANGUAGE } from '../constants/language.constants';
import { BOOK_CONDITION, BOOK_ISSUE, BOOK_STATUS } from '../constants/book.constants';
import { IsbnSchema, optionalField } from '../validators/isbn.validator';

export const BookSchema = z.object({
  id: z.uuid(),
  title: z.string().trim().min(1),
  author: z.string().trim().min(1),
  description: z.string().optional(),
  imageUrl: z.url({ protocol: /^https?$/ }).optional(),
  language: z.enum(LANGUAGE),
  languageDetails: z.string().trim().optional(),
  publicationYear: z.number().int().min(1).optional(),
  isbn: optionalField(IsbnSchema),
  condition: z.enum(BOOK_CONDITION),
  status: z.enum(BOOK_STATUS),
  issues: z.array(z.enum(BOOK_ISSUE)).optional(),
  createdAt: z.iso.datetime(),
});

// Full book model
export type Book = z.infer<typeof BookSchema>;

// Model for creating a book
export const CreateBookSchema = BookSchema.omit({
  id: true,
  createdAt: true,
})

export type CreateBook = z.infer<typeof CreateBookSchema>;

// Runtime property names derived from the schema
export const BookKey = BookSchema.keyof().enum;
