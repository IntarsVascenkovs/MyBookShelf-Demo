import { BookSchema, CreateBook, CreateBookSchema } from './book.model';

const requiredFields: CreateBook = {
  title: 'Dune',
  author: 'Frank Herbert',
  language: 'en',
  condition: 'good',
  status: 'owned',
};

const metadata = {
  id: '039546bd-f668-52b6-b456-87421014655f',
  createdAt: '2023-01-01T00:00:00Z',
};

describe.each([
  { name: 'CreateBookSchema', schema: CreateBookSchema, input: requiredFields },
  { name: 'BookSchema', schema: BookSchema, input: { ...requiredFields, ...metadata } },
])('$name', ({ schema, input }) => {
  it('accepts a book with only its required fields', () => {
    expect(schema.parse(input)).toEqual(input);
  });

  it('accepts valid optional fields', () => {
    const book = {
      ...input,
      description: 'A science fiction novel',
      imageUrl: 'https://example.com/dune.jpg',
      languageDetails: 'English edition',
      publicationYear: 1965,
      isbn: '9780441172719',
      issues: ['writing-inside'],
    };

    expect(schema.parse(book)).toEqual(book);
  });

  it('normalizes a blank ISBN to undefined', () => {
    expect(schema.parse({ ...input, isbn: '' }).isbn).toBeUndefined();
  });

  it.each([
    ['isbn', '9780441172718'],
    ['title', ''],
    ['title', '   '],
    ['publicationYear', 0],
    ['publicationYear', -1],
    ['publicationYear', 1965.5],
    ['publicationYear', '1965'],
  ])('rejects %s with value %j', (field, value) => {
    const result = schema.safeParse({ ...input, [field]: value });

    expect(result.error?.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: [field] })]),
    );
  });
});

describe('BookSchema metadata', () => {
  it.each([
    ['id', undefined],
    ['id', 'not-a-uuid'],
    ['createdAt', undefined],
    ['createdAt', '2023-01-01'],
  ])('rejects %s with value %j', (field, value) => {
    const result = BookSchema.safeParse({ ...requiredFields, ...metadata, [field]: value });

    expect(result.error?.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: [field] })]),
    );
  });
});
