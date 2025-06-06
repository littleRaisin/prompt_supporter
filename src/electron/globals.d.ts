interface Translation {
  danbooru_name: string;
  translation_text?: string;
  search_word?: string;
  note?: string;
  favorite?: number;
  copyrights?: string;
  updated_at?: string;
}

interface Window {
  backend: {
    getTranslation: (danbooruName: string) => Promise<Translation | { error: string }>;
    getTranslationList: (danbooruName: string) => Promise<Translation[] | { error: string }>;
    getFavoriteList: (limit?: number) => Promise<Translation[] | { error: string }>;
    upsertTranslation: (data: {
      danbooruName: string;
      translationText?: string;
      searchWord?: string;
      note?: string;
      favorite?: number;
      copyrights?: string;
    }) => Promise<{ success?: boolean; error?: string }>;
  };
}