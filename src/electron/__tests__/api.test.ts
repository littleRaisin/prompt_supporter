/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Mock, MockInstance } from 'vitest';
import { ipcMain } from 'electron';
import db from '../../db/db'; // 実際のdbインスタンスをインポート

// ipcMainのモック
vi.mock('electron', async (importOriginal) => {
  const actual = await importOriginal() as any; // anyにキャスト
  return {
    ...actual,
    ipcMain: {
      handle: vi.fn(),
    },
  };
});

// dbモジュールのモック
vi.mock('../../db/db', () => ({
  default: {
    prepare: vi.fn(() => ({
      get: vi.fn(),
      all: vi.fn(),
      run: vi.fn(),
    })),
    exec: vi.fn(),
  },
}));

// テスト対象のAPIファイルをインポート（モック後にインポートする必要がある）
import '../api';

describe('Electron API', () => {
  beforeEach(() => {
    // 各テストの前にdbモックをリセット
    ((db.prepare as unknown) as MockInstance).mockClear();
  });

  describe('get-translation', () => {
    it('指定されたキーワードの翻訳情報を取得できること', async () => {
      const mockResult = {
        prompt_name: 'test_prompt',
        translation_text: 'テストプロンプト',
      };
      ((db.prepare as unknown) as MockInstance).mockReturnValue({
        get: vi.fn().mockReturnValue(mockResult),
      });

      // ipcMain.handleのコールバックを取得
      const handler = (ipcMain.handle as unknown as { mock: { calls: any[] } }).mock.calls.find(
        (call: any[]) => call[0] === 'get-translation'
      )[1];

      const result = await handler(null, 'test_prompt');
      expect(db.prepare).toHaveBeenCalledWith(`
      SELECT * FROM prompt_supporter
      WHERE
        prompt_name = @kw
    `);
      expect(result).toEqual(mockResult);
    });

    it('エラー発生時にエラーオブジェクトを返すこと', async () => {
      const mockError = new Error('DB Error');
      ((db.prepare as unknown) as MockInstance).mockImplementation(() => {
        throw mockError;
      });

      const handler = (ipcMain.handle as Mock)?.mock?.calls.find(
        (call: any[]) => call[0] === 'get-translation'
      )?.[1];

      expect(handler).toBeDefined();
      const result = await handler!(null, 'test_prompt');
      expect(result).toEqual({ error: String(mockError) });
    });
  });

  describe('get-favorite-list', () => {
    it('お気に入りリストを取得できること', async () => {
      const mockResult = [
        { prompt_name: 'fav1', favorite: 1 },
        { prompt_name: 'fav2', favorite: 1 },
      ];
      ((db.prepare as unknown) as MockInstance).mockReturnValue({
        all: vi.fn().mockReturnValue(mockResult),
      });

      const handler = ((ipcMain.handle as unknown) as MockInstance)?.mock?.calls.find(
        (call: any[]) => call[0] === 'get-favorite-list'
      )?.[1];

      const result = await handler(null, 10);
      expect(db.prepare).toHaveBeenCalledWith(`
      SELECT * FROM prompt_supporter
      WHERE favorite = 1
      ORDER BY updated_at DESC
      LIMIT @limit
    `);
      expect(result).toEqual(mockResult);
    });
  });

  describe('get-translation-list', () => {
    it('キーワードで翻訳リストを検索できること', async () => {
      const mockResult = [
        { prompt_name: 'search1' },
        { prompt_name: 'search2' },
      ];
      ((db.prepare as unknown) as MockInstance).mockReturnValue({
        all: vi.fn().mockReturnValue(mockResult),
      });

      const handler = (ipcMain.handle as Mock).mock?.calls.find(
        (call: any[]) => call[0] === 'get-translation-list'
      )?.[1];

      expect(handler).toBeDefined();
      const result = await handler!(null, 'keyword');
      expect(db.prepare).toHaveBeenCalledWith(`
      SELECT * FROM prompt_supporter
      WHERE
        prompt_name LIKE @kw OR
        translation_text LIKE @kw OR
        search_word LIKE @kw OR
        note LIKE @kw OR
        copyrights LIKE @kw
      ORDER BY updated_at DESC
      LIMIT 20
    `);
      expect(result).toEqual(mockResult);
    });
  });

  describe('upsert-translation', () => {
    it('翻訳情報を追加または更新できること', async () => {
      ((db.prepare as unknown) as MockInstance).mockReturnValue({
        run: vi.fn(),
      });

      const handler = (ipcMain.handle as Mock).mock?.calls.find(
        (call: any[]) => call[0] === 'upsert-translation'
      )?.[1];
      expect(handler).toBeDefined();

      const testData = {
        promptName: 'new_prompt',
        translationText: '新しいプロンプト',
        favorite: 1,
      };
      const result = await handler(null, testData);
      expect(db.prepare).toHaveBeenCalledWith(`
      INSERT INTO prompt_supporter (prompt_name, translation_text, search_word, note, favorite, copyrights, updated_at)
      VALUES (@promptName, @translationText, @searchWord, @note, @favorite, @copyrights, datetime('now', 'localtime'))
      ON CONFLICT(prompt_name) DO UPDATE SET
        translation_text=excluded.translation_text,
        search_word=excluded.search_word,
        note=excluded.note,
        favorite=excluded.favorite,
        copyrights=excluded.copyrights,
        updated_at=datetime('now', 'localtime')
    `);
      expect(result).toEqual({ success: true });
    });
  });
});
