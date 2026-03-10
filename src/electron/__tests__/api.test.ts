/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Mock, MockInstance } from 'vitest';
import { ipcMain, shell } from 'electron'; // shellをインポート
import db from '../../db/db'; // 実際のdbインスタンスをインポート

// electronモジュールのモック
vi.mock('electron', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    ipcMain: {
      handle: vi.fn(),
    },
    shell: { // shellモジュールをモック
      openExternal: vi.fn(),
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
      const mockAllFn = vi.fn().mockReturnValue(mockResult);
      const mockGetFn = vi.fn().mockReturnValue({ total: 2 });
      ((db.prepare as unknown) as MockInstance)
        .mockReturnValueOnce({ all: mockAllFn }) // items用
        .mockReturnValueOnce({ get: mockGetFn }); // total用

      const handler = ((ipcMain.handle as unknown) as MockInstance)?.mock?.calls.find(
        (call: any[]) => call[0] === 'get-favorite-list'
      )?.[1];

      const result = await handler(null, { limit: 10, page: 1 });
      expect(db.prepare).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM prompt_supporter')
      );
      expect(mockAllFn).toHaveBeenCalledWith({ limit: 10, offset: 0 });
      expect(db.prepare).toHaveBeenCalledWith(
        expect.stringContaining('SELECT COUNT(*) as total FROM prompt_supporter')
      );
      expect(mockGetFn).toHaveBeenCalled();
      expect(result).toEqual({ items: mockResult, total: 2 });
    });
  });

  describe('get-translation-list', () => {
    it('キーワードで翻訳リストを検索できること', async () => {
      const mockResult = [
        { prompt_name: 'search1' },
        { prompt_name: 'search2' },
      ];
      const mockAllFn = vi.fn().mockReturnValue(mockResult);
      const mockGetFn = vi.fn().mockReturnValue({ total: 2 });
      ((db.prepare as unknown) as MockInstance)
        .mockReturnValueOnce({ all: mockAllFn })
        .mockReturnValueOnce({ get: mockGetFn });

      const handler = (ipcMain.handle as Mock).mock?.calls.find(
        (call: any[]) => call[0] === 'get-translation-list'
      )?.[1];

      expect(handler).toBeDefined();
      const result = await handler!(null, {
        keyword: 'keyword',
        categories: { character: true, tag: true, copyright: true },
        limit: 20,
        page: 1,
      });
      expect(db.prepare).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM prompt_supporter')
      );
      expect(mockAllFn).toHaveBeenCalledWith(
        expect.objectContaining({ kw: '%keyword%', limit: 20, offset: 0 })
      );
      expect(result).toEqual({ items: mockResult, total: 2 });
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
      expect(db.prepare).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO prompt_supporter')
      );
      expect(db.prepare).toHaveBeenCalledWith(
        expect.stringContaining('category')
      );
      expect(result).toEqual({ success: true });
    });

    it('外部URLを開く際にエラーが発生した場合にエラーオブジェクトを返すこと', async () => {
      const mockError = new Error('Failed to open URL');
      (shell.openExternal as Mock).mockRejectedValue(mockError); // shell.openExternalをモック

      const handler = (ipcMain.handle as Mock)?.mock?.calls.find(
        (call: any[]) => call[0] === 'open-external-url'
      )?.[1];

      expect(handler).toBeDefined();
      const testUrl = 'https://example.com';
      const result = await handler!(null, testUrl);
      expect(shell.openExternal).toHaveBeenCalledWith(testUrl);
      expect(result).toEqual({ error: String(mockError) });
    });
  });

  describe('get-favorite-list-by-category', () => {
    it('指定されたカテゴリのお気に入りリストを取得できること', async () => {
      const mockResult = [
        { prompt_name: 'fav_char1', favorite: 1, category: 'character' },
        { prompt_name: 'fav_char2', favorite: 1, category: 'character' },
      ];
      const mockAllFn = vi.fn().mockReturnValue(mockResult);
      const mockGetFn = vi.fn().mockReturnValue({ total: 2 });
      ((db.prepare as unknown) as MockInstance)
        .mockReturnValueOnce({ all: mockAllFn }) // items用
        .mockReturnValueOnce({ get: mockGetFn }); // total用

      const handler = ((ipcMain.handle as unknown) as MockInstance)?.mock?.calls.find(
        (call: any[]) => call[0] === 'get-favorite-list-by-category'
      )?.[1];

      const result = await handler(null, { limit: 10, page: 1, category: 'character' });
      expect(db.prepare).toHaveBeenCalledWith(
        expect.stringContaining("WHERE favorite = 1 AND category = @category")
      );
      expect(mockAllFn).toHaveBeenCalledWith({ limit: 10, offset: 0, category: 'character' });
      expect(db.prepare).toHaveBeenCalledWith(
        expect.stringContaining("SELECT COUNT(*) as total FROM prompt_supporter WHERE favorite = 1 AND category = @category")
      );
      expect(mockGetFn).toHaveBeenCalledWith({ category: 'character' });
      expect(result).toEqual({ items: mockResult, total: 2 });
    });

    it('エラー発生時にエラーオブジェクトを返すこと', async () => {
      const mockError = new Error('DB Error for category');
      ((db.prepare as unknown) as MockInstance).mockImplementation(() => {
        throw mockError;
      });

      const handler = (ipcMain.handle as Mock)?.mock?.calls.find(
        (call: any[]) => call[0] === 'get-favorite-list-by-category'
      )?.[1];

      expect(handler).toBeDefined();
      const result = await handler!(null, { limit: 10, page: 1, category: 'character' });
      expect(result).toEqual({ error: String(mockError) });
    });
  });
});
