import type { Translation } from './Translation';

declare global {
  interface Window {
    backend: {
      getTranslation: (promptName: string) => Promise<Translation | { error: string }>;
      getTranslationList: (data: { keyword: string, categories: { character: boolean, tag: boolean, copyright: boolean }, limit: number, page: number }) => Promise<{ items: Translation[]; total: number } | { error: string }>;
      getFavoriteList: (
        limit?: number,
        page?: number
      ) => Promise<{ items: Translation[]; total: number } | { error: string }>;
      getFavoriteListByCategory: ( // 新しいAPIの型定義を追加
        limit: number,
        page: number,
        category: string
      ) => Promise<{ items: Translation[]; total: number } | { error: string }>;
      upsertTranslation: (data: {
        promptName: string;
        translationText?: string;
        searchWord?: string;
        note?: string;
        favorite?: number;
        copyrights?: string;
        category?: string; // categoryを追加
      }) => Promise<{ success?: boolean; error?: string }>;
      openExternalUrl: (url: string) => Promise<{ success?: boolean; error?: string }>; // 外部URLを開くAPIの型定義を追加
    };
  }
}

export {};
