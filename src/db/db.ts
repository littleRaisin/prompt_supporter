import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs'; // fsモジュールをインポート

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
    category TEXT, -- categoryのDEFAULTはマイグレーションで設定
    updated_at TEXT DEFAULT (datetime('now', 'localtime'))
  );

  -- スキーマバージョン管理テーブル
  CREATE TABLE IF NOT EXISTS schema_version (
    version INTEGER PRIMARY KEY
  );
`);

// --- マイグレーションロジック ---
const migrationsDir = path.join(__dirname, './migrations'); // マイグレーションスクリプトのディレクトリ

function getCurrentSchemaVersion(): number {
  try {
    const result = db.prepare("SELECT version FROM schema_version ORDER BY version DESC LIMIT 1").get() as { version: number } | undefined;
    return result ? result.version : 0;
  } catch (e) {
    // テーブルが存在しない場合など、エラーが発生した場合はバージョン0とみなす
    return 0;
  }
}

async function runMigrations() {
  const currentVersion = getCurrentSchemaVersion();
  console.log(`Current schema version: ${currentVersion}`);

  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.ts') || file.endsWith('.js'))
    .sort(); // ファイル名をソートして実行順序を保証

  for (const file of migrationFiles) {
    const migrationPath = path.join(migrationsDir, file);
    // 動的にモジュールをインポート
    const migration = await import(migrationPath);
    const migrationVersion = migration.version;

    if (migrationVersion > currentVersion) {
      console.log(`Running migration: ${file} (version ${migrationVersion})`);
      db.transaction(() => { // トランザクションでマイグレーションを実行
        migration.up(db);
        db.prepare("INSERT OR REPLACE INTO schema_version (version) VALUES (?)").run(migrationVersion);
      })(); // 即時実行
    }
  }
  console.log("All migrations completed.");
}

// アプリケーション起動時にマイグレーションを実行
runMigrations().catch(error => {
  console.error("Failed to run migrations:", error);
  // エラーハンドリング: アプリケーションを終了するなど
});

export default db;
