import Database from 'better-sqlite3';

const db = new Database('danbooru.sqlite');

// テーブル作成（なければ作成）
db.exec(`
  CREATE TABLE IF NOT EXISTS danbooru_translation (
    danbooru_name TEXT PRIMARY KEY,
    view_name TEXT,
    translation_text TEXT,
    memo TEXT
  );
`);

export default db;