import Database from 'better-sqlite3';

const db = new Database('danbooru.sqlite');

// テーブル作成（なければ作成）
db.exec(`
  CREATE TABLE IF NOT EXISTS danbooru_translation (
    danbooru_name TEXT PRIMARY KEY,
    translation_text TEXT,
    search_word TEXT,
    note TEXT,
    favorite INTEGER NOT NULL DEFAULT 0, -- 追加: お気に入り（0=false, 1=true）
    copyrights TEXT
  );
`);

export default db;