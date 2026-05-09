// src/electron/preload.ts

import { contextBridge, ipcRenderer } from 'electron';
import type { Category, Translation } from '../types/Translation';

contextBridge.exposeInMainWorld('backend', {
    // 翻訳情報を取得
    getTranslation: (promptName : string) => ipcRenderer.invoke('get-translation', promptName),

    // 翻訳情報を取得
    getTranslationList: (data: { keyword: string, categories: { character: boolean, tag: boolean, copyright: boolean } }) => ipcRenderer.invoke('get-translation-list', data),

    // お気に入り一覧を取得
    getFavoriteList: (limit: number = 20, page = 1): Promise<{ items: Translation[]; total: number }> =>
    ipcRenderer.invoke('get-favorite-list', {
        limit,
        page
    }),

    // カテゴリー別お気に入り一覧を取得
    getFavoriteListByCategory: (limit: number, page: number, category: Category): Promise<{ items: Translation[]; total: number }> =>
    ipcRenderer.invoke('get-favorite-list-by-category', {
        limit,
        page,
        category
    }),

    // 翻訳情報を追加・更新
    upsertTranslation: (data: {
        promptName: string;
        translationText?: string;
        searchWord?: string;
        note?: string;
        favorite?: 0 | 1;
        copyrights?: string;
        category?: Category;
    }) => ipcRenderer.invoke('upsert-translation', data),

    // 翻訳情報を削除
    deleteTranslation: (promptName: string) => ipcRenderer.invoke('delete-translation', promptName),

    // 外部URLを開く
    openExternalUrl: (url: string) => ipcRenderer.invoke('open-external-url', url),

    // アプリケーションのバージョンを取得
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),
});
