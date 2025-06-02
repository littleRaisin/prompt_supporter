interface Window {
  backend: {
    getTranslation: (danbooruName: string) => Promise<string[] | { error: string }>;
    getTranslationList: (danbooruName: string) => Promise<string[] | { error: string }>;
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
