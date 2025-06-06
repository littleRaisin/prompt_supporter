import Database from 'better-sqlite3';
import path from 'path';

// 開発環境かどうか判定
const isDev = process.env.NODE_ENV === 'development' || process.env.DEV === 'true';

let dbPath: string;

if (isDev) {
  // 開発時はプロジェクト直下
  dbPath = path.join(__dirname, '../../danbooru.sqlite');
} else {
  // 本番はuserDataディレクトリ
  const electron = require('electron');
  dbPath = path.join(electron.app.getPath('userData'), 'danbooru.sqlite');
}

const db = new Database(dbPath);

// テーブル作成（なければ作成）
db.exec(`
  CREATE TABLE IF NOT EXISTS danbooru_translation (
    danbooru_name TEXT PRIMARY KEY,
    translation_text TEXT,
    search_word TEXT,
    note TEXT,
    favorite INTEGER NOT NULL DEFAULT 0,
    copyrights TEXT,
    updated_at TEXT DEFAULT (datetime('now', 'localtime'))
  );
`);

export default db;