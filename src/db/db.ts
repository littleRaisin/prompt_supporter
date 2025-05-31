import Database from 'better-sqlite3';

const db = new Database('danbooru.sqlite');

// テーブル作成（なければ作成）
db.exec(`
  CREATE TABLE IF NOT EXISTS danbooru_translation (
    danbooru_name TEXT PRIMARY KEY,
    view_name TEXT,
    translation_text TEXT,
    note TEXT,
    favorite INTEGER NOT NULL DEFAULT 0, -- 追加: お気に入り（0=false, 1=true）
    copyrights TEXT
  );
`);

// 仮データ投入
const insert = db.prepare(`
  INSERT OR IGNORE INTO danbooru_translation
    (danbooru_name, view_name, translation_text, note, favorite, copyrights)
  VALUES
    (@danbooru_name, @view_name, @translation_text, @note, @favorite, @copyrights)
`);

insert.run({
  danbooru_name: "lion_(kemono_friends)",
  view_name: "ライオン",
  translation_text: "百獣の王",
  note: "けものフレンズのキャラ",
  favorite: 1,
  copyrights: "kemono friends"
});

insert.run({
  danbooru_name: "serval_(kemono_friends)",
  view_name: "サーバル",
  translation_text: "元気なフレンズ",
  note: "",
  favorite: 0,
  copyrights: "kemono friends"
});

export default db;