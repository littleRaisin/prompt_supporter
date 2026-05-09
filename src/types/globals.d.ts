import type { Category, Translation } from './Translation';

type SearchCategories = { character: boolean; tag: boolean; copyright: boolean };

declare global {
  interface Window {
    backend: {
      getTranslation: (promptName: string) => Promise<Translation | { error: string }>;
      getTranslationList: (data: { keyword: string; categories: SearchCategories; limit: number; page: number }) => Promise<{ items: Translation[]; total: number } | { error: string }>;
      getFavoriteList: (limit?: number, page?: number) => Promise<{ items: Translation[]; total: number } | { error: string }>;
      getFavoriteListByCategory: (limit: number, page: number, category: Category) => Promise<{ items: Translation[]; total: number } | { error: string }>;
      upsertTranslation: (data: {
        promptName: string;
        translationText?: string;
        searchWord?: string;
        note?: string;
        favorite?: 0 | 1;
        copyrights?: string;
        category?: Category;
      }) => Promise<{ success?: boolean; error?: string }>;
      deleteTranslation: (promptName: string) => Promise<{ success?: boolean; error?: string }>;
      openExternalUrl: (url: string) => Promise<{ success?: boolean; error?: string }>;
      getAppVersion: () => Promise<string | { error: string }>;
    };
  }
}

export {};
