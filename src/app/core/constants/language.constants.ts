export const LANGUAGE = {
  CZECH: 'cs',
  ENGLISH: 'en',
  GERMAN: 'de',
  LATVIAN: 'lv',
  POLISH: 'pl',
  RUSSIAN: 'ru',
  OTHER: 'other',
} as const;

export type Language = (typeof LANGUAGE)[keyof typeof LANGUAGE];

export const LANGUAGE_LABELS: Record<Language, string> = {
  [LANGUAGE.CZECH]: 'Čeština',
  [LANGUAGE.ENGLISH]: 'English',
  [LANGUAGE.GERMAN]: 'Deutsch',
  [LANGUAGE.LATVIAN]: 'Latviešu',
  [LANGUAGE.POLISH]: 'Polski',
  [LANGUAGE.RUSSIAN]: 'Russian',
  [LANGUAGE.OTHER]: 'Other',
}
