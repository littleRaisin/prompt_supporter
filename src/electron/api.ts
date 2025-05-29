// src/electron/api.ts

import { ipcMain } from "electron";
import type { IpcMainInvokeEvent } from "electron";
import db from '../db/db';

ipcMain.handle(
  "node-version",
  (event: IpcMainInvokeEvent, msg: string): string => {
    console.log(event);
    console.log(msg);

    return process.versions.node;
  }
);

/**
 * Danbooruの翻訳情報を取得・更新するAPI
 */
// 1件取得
ipcMain.handle('get-translation', (_event, danbooruName: string) => {
  try {
    const stmt = db.prepare('SELECT * FROM danbooru_translation WHERE danbooru_name = ?');
    return stmt.get(danbooruName);
  } catch (err) {
    return { error: String(err) };
  }
});

// 追加・更新
ipcMain.handle('upsert-translation', (_event, data: {
  danbooruName: string,
  viewName?: string,
  translationText?: string,
  memo?: string
}) => {
  try {
    const stmt = db.prepare(`
      INSERT INTO danbooru_translation (danbooru_name, view_name, translation_text, memo)
      VALUES (@danbooruName, @viewName, @translationText, @memo)
      ON CONFLICT(danbooru_name) DO UPDATE SET
        view_name=excluded.view_name,
        translation_text=excluded.translation_text,
        memo=excluded.memo
    `);
    stmt.run(data);
    return { success: true };
  } catch (err) {
    return { error: String(err) };
  }
});