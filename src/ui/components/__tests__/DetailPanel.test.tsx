import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import DetailPanel from '../DetailPanel';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  Toaster: () => null,
  toast: { success: vi.fn() },
}));

beforeEach(() => {
  Object.defineProperty(window, 'backend', {
    value: {
      upsertTranslation: vi.fn().mockResolvedValue({}),
    },
    writable: true,
    configurable: true,
  });

  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
    writable: true,
    configurable: true,
  });
});

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe('DetailPanel - コピーライト表示', () => {
  it('カテゴリがtagの場合、コピーライトセクションが非表示になること', () => {
    renderWithRouter(
      <DetailPanel
        item={{
          prompt_name: 'test_tag',
          translation_text: 'テスト',
          copyrights: 'some_copyright',
          category: 'tag',
          favorite: 0,
        }}
        onDataChange={vi.fn()}
      />
    );

    expect(screen.queryByText('common.Copyrights')).not.toBeInTheDocument();
  });

  it('カテゴリがcharacterの場合、コピーライトセクションが表示されること', () => {
    renderWithRouter(
      <DetailPanel
        item={{
          prompt_name: 'test_character',
          translation_text: 'テスト',
          copyrights: 'some_copyright',
          category: 'character',
          favorite: 0,
        }}
        onDataChange={vi.fn()}
      />
    );

    expect(screen.getByText('common.Copyrights')).toBeInTheDocument();
  });

  it('カテゴリがcopyrightの場合、コピーライトセクションが表示されること', () => {
    renderWithRouter(
      <DetailPanel
        item={{
          prompt_name: 'test_copyright',
          translation_text: 'テスト',
          copyrights: 'some_copyright',
          category: 'copyright',
          favorite: 0,
        }}
        onDataChange={vi.fn()}
      />
    );

    expect(screen.getByText('common.Copyrights')).toBeInTheDocument();
  });
});
