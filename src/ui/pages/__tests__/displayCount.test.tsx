import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Home from '../Home';
import SearchResult from '../SearchResult';
import FavoriteCategoryList from '../FavoriteCategoryList';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: { count?: number }) =>
      opts?.count !== undefined ? `${opts.count}件` : key,
  }),
}));

// Mock window.backend
const mockGetFavoriteList = vi.fn();
const mockGetTranslationList = vi.fn();
const mockGetFavoriteListByCategory = vi.fn();

beforeEach(() => {
  mockGetFavoriteList.mockResolvedValue({
    items: [
      { prompt_name: 'test1', translation_text: 'テスト1', favorite: 1, category: 'character' },
    ],
    total: 1,
  });
  mockGetTranslationList.mockResolvedValue({
    items: [
      { prompt_name: 'test1', translation_text: 'テスト1', favorite: 0, category: 'tag' },
    ],
    total: 1,
  });
  mockGetFavoriteListByCategory.mockResolvedValue({
    items: [
      { prompt_name: 'test1', translation_text: 'テスト1', favorite: 1, category: 'character' },
    ],
    total: 1,
  });

  Object.defineProperty(window, 'backend', {
    value: {
      getFavoriteList: mockGetFavoriteList,
      getTranslationList: mockGetTranslationList,
      getFavoriteListByCategory: mockGetFavoriteListByCategory,
    },
    writable: true,
    configurable: true,
  });
});

afterEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe('Home - 表示件数の初期値', () => {
  it('localStorageに保存値がない場合、デフォルト値(20)が使用される', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByDisplayValue('20件')).toBeInTheDocument();
    expect(mockGetFavoriteList).toHaveBeenCalledWith(20, 1);
  });

  it('localStorageに保存値がある場合、保存値が初期値として使用される', async () => {
    localStorage.setItem('favorite_limit', '50');

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByDisplayValue('50件')).toBeInTheDocument();
    expect(mockGetFavoriteList).toHaveBeenCalledWith(50, 1);
  });

  it('各表示件数オプションがlocalStorageから正しく復元される', async () => {
    for (const count of [5, 10, 50, 100]) {
      localStorage.setItem('favorite_limit', String(count));

      const { unmount } = render(
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </MemoryRouter>
      );

      expect(await screen.findByDisplayValue(`${count}件`)).toBeInTheDocument();
      expect(mockGetFavoriteList).toHaveBeenCalledWith(count, 1);

      unmount();
      mockGetFavoriteList.mockClear();
    }
  });
});

describe('SearchResult - 表示件数の初期値', () => {
  it('localStorageに保存値がない場合、デフォルト値(20)が使用される', async () => {
    render(
      <MemoryRouter initialEntries={['/search/test']}>
        <Routes>
          <Route path="/search/:promptName" element={<SearchResult />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByDisplayValue('20件')).toBeInTheDocument();
    expect(mockGetTranslationList).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 20 })
    );
  });

  it('localStorageに保存値がある場合、保存値が初期値として使用される', async () => {
    localStorage.setItem('search_result_limit', '50');

    render(
      <MemoryRouter initialEntries={['/search/test']}>
        <Routes>
          <Route path="/search/:promptName" element={<SearchResult />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByDisplayValue('50件')).toBeInTheDocument();
    expect(mockGetTranslationList).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 50 })
    );
  });
});

describe('FavoriteCategoryList - 表示件数の初期値', () => {
  it('localStorageに保存値がない場合、デフォルト値(20)が使用される', async () => {
    render(
      <MemoryRouter initialEntries={['/favorite/character']}>
        <Routes>
          <Route path="/favorite/:category" element={<FavoriteCategoryList />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByDisplayValue('20件')).toBeInTheDocument();
    expect(mockGetFavoriteListByCategory).toHaveBeenCalledWith(20, 1, 'character');
  });

  it('localStorageに保存値がある場合、保存値が初期値として使用される', async () => {
    localStorage.setItem('favorite_category_limit', '50');

    render(
      <MemoryRouter initialEntries={['/favorite/character']}>
        <Routes>
          <Route path="/favorite/:category" element={<FavoriteCategoryList />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByDisplayValue('50件')).toBeInTheDocument();
    expect(mockGetFavoriteListByCategory).toHaveBeenCalledWith(50, 1, 'character');
  });
});
