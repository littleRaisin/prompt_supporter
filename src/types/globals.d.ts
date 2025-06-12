import type { Translation } from './Translation';

declare global {
  interface Window {
    backend: {
      getTranslation: (promptName: string) => Promise<Translation | { error: string }>;
      getTranslationList: (promptName: string) => Promise<Translation[] | { error: string }>;
      getFavoriteList: (
        limit?: number,
        page?: number
      ) => Promise<{ items: Translation[]; total: number } | { error: string }>;
      upsertTranslation: (data: {
        promptName: string;
        translationText?: string;
        searchWord?: string;
        note?: string;
        favorite?: number;
        copyrights?: string;
      }) => Promise<{ success?: boolean; error?: string }>;
    };
  }
}

export {};