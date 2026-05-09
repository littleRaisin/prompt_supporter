import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Edit from '../Edit';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, string>) =>
      opts ? `${key}:${JSON.stringify(opts)}` : key,
  }),
}));

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
  toast: { success: vi.fn(), error: vi.fn() },
}));

const mockBackend = {
  getTranslation: vi.fn().mockResolvedValue(null),
  upsertTranslation: vi.fn().mockResolvedValue({ success: true }),
  deleteTranslation: vi.fn().mockResolvedValue({ success: true }),
};

beforeEach(() => {
  vi.clearAllMocks();
  Object.defineProperty(window, 'backend', {
    value: mockBackend,
    writable: true,
    configurable: true,
  });
});

const renderEdit = (path = '/edit') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/edit" element={<Edit />} />
        <Route path="/edit/:promptName" element={<Edit />} />
      </Routes>
    </MemoryRouter>
  );

describe('Edit - バリデーション', () => {
  it('promptNameが空のまま送信するとエラーメッセージが表示されること', async () => {
    renderEdit();
    const submitButton = screen.getByText('common.saveButton');
    await userEvent.click(submitButton);
    expect(await screen.findByText('common.promptNameRequired')).toBeInTheDocument();
  });
});

describe('Edit - 削除ボタンの表示制御', () => {
  it('新規登録モードでは削除ボタンが表示されないこと', () => {
    renderEdit('/edit');
    expect(screen.queryByText('common.deleteButton')).not.toBeInTheDocument();
  });

  it('編集モードでは削除ボタンが表示されること', async () => {
    mockBackend.getTranslation.mockResolvedValue({
      prompt_name: 'test', translation_text: '', category: 'character', favorite: 0,
    });
    renderEdit('/edit/test');
    expect(await screen.findByText('common.deleteButton')).toBeInTheDocument();
  });

  it('削除ボタンをクリックすると確認モーダルが開くこと', async () => {
    mockBackend.getTranslation.mockResolvedValue({
      prompt_name: 'test', translation_text: '', category: 'character', favorite: 0,
    });
    renderEdit('/edit/test');
    const deleteButton = await screen.findByText('common.deleteButton');
    await userEvent.click(deleteButton);
    expect(screen.getByText('common.deleteConfirmTitle')).toBeInTheDocument();
  });
});

describe('Edit - コピーライトフィールドの表示', () => {
  it('デフォルト(character)ではコピーライトフィールドが表示されること', async () => {
    const { container } = renderEdit();

    // Wait for form to render and default value to be set
    const categorySelect = await screen.findByRole('combobox');
    expect(categorySelect).toBeInTheDocument();

    // Copyright input should be visible when category is 'character'
    expect(container.querySelector('input[name="copyrights"]')).toBeInTheDocument();
  });

  it('カテゴリをtagに変更するとコピーライトフィールドが非表示になること', async () => {
    const { container } = renderEdit();

    const categorySelect = await screen.findByRole('combobox');
    await userEvent.selectOptions(categorySelect, 'tag');

    expect(container.querySelector('input[name="copyrights"]')).not.toBeInTheDocument();
  });

  it('カテゴリをcopyrightに選択するとコピーライトフィールドが表示されること', async () => {
    const { container } = renderEdit();

    const categorySelect = await screen.findByRole('combobox');
    await userEvent.selectOptions(categorySelect, 'copyright');

    expect(container.querySelector('input[name="copyrights"]')).toBeInTheDocument();
  });
});
