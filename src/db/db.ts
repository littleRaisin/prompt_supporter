import Database from 'better-sqlite3';
import path from 'path';

const isDev = process.env.NODE_ENV === 'development' || process.env.DEV === 'true';
let dbPath: string;

if (isDev) {
  dbPath = path.join(__dirname, '../../prompt-supporter.sqlite');
} else {
  const electron = require('electron');
  dbPath = path.join(electron.app.getPath('userData'), 'prompt-supporter.sqlite');
}

const db = new Database(dbPath);

// --- テーブル作成（なければ作成） ---
db.exec(`
  CREATE TABLE IF NOT EXISTS prompt_supporter (
    prompt_name TEXT PRIMARY KEY,
    translation_text TEXT,
    search_word TEXT,
    note TEXT,
    favorite INTEGER NOT NULL DEFAULT 0,
    copyrights TEXT,
    category TEXT DEFAULT 'character', -- 新しいカラムを追加
    updated_at TEXT DEFAULT (datetime('now', 'localtime'))
  );
`);

// --- マイグレーション: categoryカラムの追加 ---
// categoryカラムが存在しない場合のみ追加
const tableInfo = db.prepare("PRAGMA table_info(prompt_supporter);").all();
const hasCategoryColumn = (tableInfo as { name: string }[]).some(column => column.name === 'category');

if (!hasCategoryColumn) {
  db.exec(`
    ALTER TABLE prompt_supporter ADD COLUMN category TEXT DEFAULT 'character';
  `);
  console.log("Added 'category' column to prompt_supporter table.");
}

export default db;
