interface Window {
  backend: {
    nodeVersion: (msg: string) => Promise<string>;
    getTranslation: (danbooruName: string) => Promise<string | { error: string }>;
    upsertTranslation: (data: {
      danbooruName: string;
      viewName?: string;
      translationText?: string;
      note?: string;
    }) => Promise<{ success?: boolean; error?: string }>;
  };
}
