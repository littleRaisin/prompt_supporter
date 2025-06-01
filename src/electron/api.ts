// src/electron/api.ts

import { ipcMain } from "electron";
import type { IpcMainInvokeEvent } from "electron";
import db from '../db/db';

ipcMain.handle(
  "node-version",
  (event: IpcMainInvokeEvent, msg: string): string => {

    return process.versions.node;
  }
);

/**
 * Danbooruの翻訳情報を取得・更新するAPI
 */
// 取得
ipcMain.handle('get-translation', (_event, keyword: string) => {
  try {
    const stmt = db.prepare(`
      SELECT * FROM danbooru_translation
      WHERE
        danbooru_name = @kw
    `);
    return stmt.get({ kw: keyword });
  } catch (err) {
    return { error: String(err) };
  }
});

// 取得
ipcMain.handle('get-translation-list', (_event, keyword: string) => {
  try {
    const stmt = db.prepare(`
      SELECT * FROM danbooru_translation
      WHERE
        danbooru_name LIKE @kw OR
        translation_text LIKE @kw OR
        search_word LIKE @kw OR
        copyrights LIKE @kw
      LIMIT 20
    `);
    // %keyword% で部分一致
    return stmt.all({ kw: `%${keyword}%` });
  } catch (err) {
    return { error: String(err) };
  }
});

// 追加・更新
ipcMain.handle('upsert-translation', (_event, data: {
  danbooruName: string,
  translationText?: string,
  searchWord?: string,
  note?: string,
  favorite?: number,      // 追加
  copyrights?: string     // 追加
}) => {
  try {
    const stmt = db.prepare(`
      INSERT INTO danbooru_translation (danbooru_name, translation_text, search_word, note, favorite, copyrights)
      VALUES (@danbooruName, @translationText, @searchWord, @note, @favorite, @copyrights)
      ON CONFLICT(danbooru_name) DO UPDATE SET
        translation_text=excluded.translation_text,
        search_word=excluded.search_word,
        note=excluded.note,
        favorite=excluded.favorite,
        copyrights=excluded.copyrights
    `);
    stmt.run(data);
    return { success: true };
  } catch (err) {
    return { error: String(err) };
  }
});