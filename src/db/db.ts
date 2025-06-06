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
    copyrights TEXT,
    updated_at TEXT DEFAULT (datetime('now', 'localtime'))
  );
`);

// updated_atカラムがなければ追加
type TableInfoColumn = { name: string; [key: string]: any };
const columns = db.prepare(`PRAGMA table_info(danbooru_translation)`).all() as TableInfoColumn[];
const hasUpdatedAt = columns.some(col => col.name === 'updated_at');
if (!hasUpdatedAt) {
  db.exec(`ALTER TABLE danbooru_translation ADD COLUMN updated_at TEXT`);
}

export default db;