// src/electron/preload.ts

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('backend', {
  // 翻訳情報を取得
  getTranslation: (promptName: string) =>
    ipcRenderer.invoke('get-translation', promptName),

  // 翻訳情報を取得
  getTranslationList: (promptName: string) =>
    ipcRenderer.invoke('get-translation-list', promptName),

  // お気に入り一覧を取得
  getFavoriteList: (limit: number = 20) =>
    ipcRenderer.invoke('get-favorite-list', limit),

  // 翻訳情報を追加・更新
  upsertTranslation: (data: {
    promptName: string,
    translationText?: string,
    searchWord?: string,
    note?: string,
    favorite?: number;
    copyrights?: string;
  }) => ipcRenderer.invoke('upsert-translation', data),
});
