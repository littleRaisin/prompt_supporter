// src/electron/preload.ts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("backend", {
  // Node.jsのバージョンを取得
  nodeVersion: (msg: string) =>
    ipcRenderer.invoke("node-version", msg),

  // 翻訳情報を取得
  getTranslation: (danbooruName: string) =>
    ipcRenderer.invoke('get-translation', danbooruName),

  // 翻訳情報を追加・更新
  upsertTranslation: (data: {
    danbooruName: string,
    viewName?: string,
    translationText?: string,
    memo?: string
  }) => ipcRenderer.invoke('upsert-translation', data),
});
