export type Locale = 'zh-CN' | 'en-US';

export const defaultLocale: Locale = 'zh-CN';

export interface SupportedLocale {
  code: Locale;
  label: string;
  shortLabel: string;
}

export const supportedLocales: SupportedLocale[] = [
  { code: 'zh-CN', label: '简体中文', shortLabel: '中文' },
  { code: 'en-US', label: 'English', shortLabel: 'EN' },
];
