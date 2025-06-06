// src/electron/api.ts

import { ipcMain } from "electron";
import db from '../db/db';

/**
 * Promptの翻訳情報を取得・更新するAPI
 */
// 取得
ipcMain.handle('get-translation', (_event, keyword: string) => {
  try {
    const stmt = db.prepare(`
      SELECT * FROM prompt_supporter
      WHERE
        prompt_name = @kw
    `);
    return stmt.get({ kw: keyword });
  } catch (err) {
    return { error: String(err) };
  }
});

ipcMain.handle('get-favorite-list', (_event, limit: number) => {
  try {
    const stmt = db.prepare(`
      SELECT * FROM prompt_supporter
      WHERE favorite = 1
      ORDER BY updated_at DESC
      LIMIT @limit
    `);
    return stmt.all({ limit });
  } catch (err) {
    return { error: String(err) };
  }
});

// 取得
ipcMain.handle('get-translation-list', (_event, keyword: string) => {
  try {
    const stmt = db.prepare(`
      SELECT * FROM prompt_supporter
      WHERE
        prompt_name LIKE @kw OR
        translation_text LIKE @kw OR
        search_word LIKE @kw OR
        note LIKE @kw OR
        copyrights LIKE @kw
      ORDER BY updated_at DESC
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
  promptName: string,
  translationText?: string,
  searchWord?: string,
  note?: string,
  favorite?: number,
  copyrights?: string
}) => {
  try {
    const stmt = db.prepare(`
      INSERT INTO prompt_supporter (prompt_name, translation_text, search_word, note, favorite, copyrights, updated_at)
      VALUES (@promptName, @translationText, @searchWord, @note, @favorite, @copyrights, datetime('now', 'localtime'))
      ON CONFLICT(prompt_name) DO UPDATE SET
        translation_text=excluded.translation_text,
        search_word=excluded.search_word,
        note=excluded.note,
        favorite=excluded.favorite,
        copyrights=excluded.copyrights,
        updated_at=datetime('now', 'localtime')
    `);
    stmt.run(data);
    return { success: true };
  } catch (err) {
    return { error: String(err) };
  }
});