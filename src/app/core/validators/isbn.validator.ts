import { z } from 'zod';
import { parse } from 'isbn3';

export const optionalField = <T extends z.ZodType>(schema: T) => z.union([
  z.literal('').transform(() => undefined),
  schema.optional(),
])

export const IsbnSchema = z.string().refine(
  (value) => parse(value)?.isValid === true,
  { message: 'Invalid ISBN-10 or ISBN-13' }
);
