import type { Database } from 'better-sqlite3';

export const version = 1; // このマイグレーションのバージョン

export function up(db: Database) {
  // スキーマをアップグレードするロジック
  db.exec(`
    ALTER TABLE prompt_supporter ADD COLUMN category TEXT DEFAULT 'character';
  `);
  console.log("Migration 001: Added 'category' column to prompt_supporter table.");
}
