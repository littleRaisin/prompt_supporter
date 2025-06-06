// src/electron/preload.ts

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('backend', {
  // 翻訳情報を取得
  getTranslation: (danbooruName: string) =>
    ipcRenderer.invoke('get-translation', danbooruName),

  // 翻訳情報を取得
  getTranslationList: (danbooruName: string) =>
    ipcRenderer.invoke('get-translation-list', danbooruName),

  // お気に入り一覧を取得
  getFavoriteList: (limit: number = 20) =>
    ipcRenderer.invoke('get-favorite-list', limit),

  // 翻訳情報を追加・更新
  upsertTranslation: (data: {
    danbooruName: string,
    translationText?: string,
    searchWord?: string,
    note?: string,
    favorite?: number;
    copyrights?: string;
  }) => ipcRenderer.invoke('upsert-translation', data),
});
