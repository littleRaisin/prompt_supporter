// src/electron/preload.ts

import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld('backend', {
    // 翻訳情報を取得
    getTranslation: (promptName : string) => ipcRenderer.invoke('get-translation', promptName),

    // 翻訳情報を取得
    getTranslationList: (data: { keyword: string, categories: { character: boolean, tag: boolean, copyright: boolean } }) => ipcRenderer.invoke('get-translation-list', data),

    // お気に入り一覧を取得
    getFavoriteList: (limit: number = 20, page = 1): Promise<{ items: any[]; total: number }> =>
    ipcRenderer.invoke('get-favorite-list', {
        limit,
        page
    }),

    // カテゴリー別お気に入り一覧を取得
    getFavoriteListByCategory: (limit: number, page: number, category: string): Promise<{ items: any[]; total: number }> =>
    ipcRenderer.invoke('get-favorite-list-by-category', {
        limit,
        page,
        category
    }),

    // 翻訳情報を追加・更新
    upsertTranslation: (data : {
        promptName: string,
        translationText?: string,
        searchWord?: string,
        note?: string,
        favorite?: number;
        copyrights?: string;
        category?: string; // categoryを追加
    }) => ipcRenderer.invoke('upsert-translation', data),

    // 外部URLを開く
    openExternalUrl: (url: string) => ipcRenderer.invoke('open-external-url', url)
});
