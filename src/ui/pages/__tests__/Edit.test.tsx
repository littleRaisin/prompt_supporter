import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Edit from '../Edit';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

beforeEach(() => {
  Object.defineProperty(window, 'backend', {
    value: {
      getTranslation: vi.fn().mockResolvedValue(null),
      upsertTranslation: vi.fn().mockResolvedValue({}),
    },
    writable: true,
    configurable: true,
  });
});

const renderEdit = () =>
  render(
    <MemoryRouter initialEntries={['/edit']}>
      <Routes>
        <Route path="/edit" element={<Edit />} />
        <Route path="/edit/:promptName" element={<Edit />} />
      </Routes>
    </MemoryRouter>
  );

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
