export type Translation = {
  prompt_name: string;
  translation_text?: string;
  search_word?: string;
  note?: string;
  favorite?: number;
  copyrights?: string;
  category?: string; // categoryを追加
  updated_at?: string;
};
export type TranslationList = Translation[];
