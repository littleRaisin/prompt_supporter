// src/electron/api.ts

import { ipcMain } from "electron";
import db from '../db/db';

/**
 * Promptの翻訳情報を取得・更新するAPI
 */
// 特定取得
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

// お気に入り一覧の取得（ページネーション対応）
ipcMain.handle('get-favorite-list', async (_event, { limit, page }) => {
  try {
    const offset = (page - 1) * limit;
    // データ取得
    const stmt = db.prepare(`
      SELECT * FROM prompt_supporter
      WHERE favorite = 1 AND category = 'character'
      ORDER BY updated_at DESC
      LIMIT @limit OFFSET @offset
    `);
    const items = stmt.all({ limit, offset });

    // 全件数取得
    const countStmt = db.prepare(`
      SELECT COUNT(*) as total FROM prompt_supporter WHERE favorite = 1 AND category = 'character'
    `);
    const countResult = countStmt.get() as { total?: number } | undefined;
    const total = countResult?.total ?? 0;
    return { items, total };
  } catch (err) {
    return { error: String(err) };
  }
});

// カテゴリー別お気に入り一覧の取得（ページネーション対応）
ipcMain.handle('get-favorite-list-by-category', async (_event, { limit, page, category }) => {
  try {
    const offset = (page - 1) * limit;
    // データ取得
    const stmt = db.prepare(`
      SELECT * FROM prompt_supporter
      WHERE favorite = 1 AND category = @category
      ORDER BY updated_at DESC
      LIMIT @limit OFFSET @offset
    `);
    const items = stmt.all({ limit, offset, category });

    // 全件数取得
    const countStmt = db.prepare(`
      SELECT COUNT(*) as total FROM prompt_supporter WHERE favorite = 1 AND category = @category
    `);
    const countResult = countStmt.get({ category }) as { total?: number } | undefined;
    const total = countResult?.total ?? 0;
    return { items, total };
  } catch (err) {
    return { error: String(err) };
  }
});

// 検索結果の取得
ipcMain.handle('get-translation-list', (_event, data: { keyword: string, categories: { character: boolean, tag: boolean, copyright: boolean } }) => {
  try {
    const { keyword, categories } = data; // ここで分割代入する
    let whereClauses = [];
    const params: { [key: string]: any } = { kw: `%${keyword}%` };

    // キーワード検索条件
    whereClauses.push(`
      (prompt_name LIKE @kw OR
      translation_text LIKE @kw OR
      search_word LIKE @kw OR
      note LIKE @kw OR
      copyrights LIKE @kw)
    `);

    // カテゴリ検索条件
    const categoryConditions = [];
    if (categories.character) {
      categoryConditions.push("category = 'character'");
    }
    if (categories.tag) {
      categoryConditions.push("category = 'tag'");
    }
    if (categories.copyright) {
      categoryConditions.push("category = 'copyright'");
    }

    if (categoryConditions.length > 0) {
      whereClauses.push(`(${categoryConditions.join(' OR ')})`);
    }

    const whereClause = whereClauses.join(' AND ');

    const sql = `
      SELECT * FROM prompt_supporter
      WHERE ${whereClause}
      ORDER BY updated_at DESC
      LIMIT 20
    `;
    const stmt = db.prepare(sql);
    return stmt.all(params);
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
  copyrights?: string,
  category?: string // categoryを追加
}) => {
  try {
    const stmt = db.prepare(`
      INSERT INTO prompt_supporter (prompt_name, translation_text, search_word, note, favorite, copyrights, category, updated_at)
      VALUES (@promptName, @translationText, @searchWord, @note, @favorite, @copyrights, @category, datetime('now', 'localtime'))
      ON CONFLICT(prompt_name) DO UPDATE SET
        translation_text=excluded.translation_text,
        search_word=excluded.search_word,
        note=excluded.note,
        favorite=excluded.favorite,
        copyrights=excluded.copyrights,
        category=excluded.category, -- categoryを追加
        updated_at=datetime('now', 'localtime')
    `);
    console.log('Upserting data:', data); // 渡されたデータをログに出力
    stmt.run(data);
    return { success: true };
  } catch (err) {
    console.error('Error in upsert-translation:', err); // エラーもログに出力
    return { error: String(err) };
  }
});
