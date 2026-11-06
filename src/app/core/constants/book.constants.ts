export const BOOK_CONDITION = {
  NEW: 'new',
  VERY_GOOD: 'very-good',
  GOOD: 'good',
  FAIR: 'fair',
  POOR: 'poor',
  PARTIAL: 'partial',
} as const;

export const BOOK_STATUS = {
  OWNED: 'owned',
  WISHLIST: 'wishlist',
  LENT_OUT: 'lent-out',
} as const;

export const BOOK_ISSUE = {
  MISSING_COVER: 'missing-cover',
  MISSING_PAGES: 'missing-pages',
  WATER_DAMAGE: 'water-damage',
  WRITING_INSIDE: 'writing-inside',
  TORN_PAGES: 'torn-pages',
} as const;

export type BookCondition = (typeof BOOK_CONDITION)[keyof typeof BOOK_CONDITION];
export type BookStatus = (typeof BOOK_STATUS)[keyof typeof BOOK_STATUS];
export type BookIssue = (typeof BOOK_ISSUE)[keyof typeof BOOK_ISSUE];


