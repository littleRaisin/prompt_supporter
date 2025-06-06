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
    updated_at TEXT DEFAULT (datetime('now', 'localtime'))
  );
`);

export default db;