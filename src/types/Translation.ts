export type Translation = {
  prompt_name: string;
  translation_text?: string;
  search_word?: string;
  note?: string;
  favorite?: number;
  copyrights?: string;
  category?: string;
  updated_at?: string;
};
export type TranslationList = Translation[];
