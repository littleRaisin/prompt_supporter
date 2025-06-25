import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import DetailPanel from '../ui/components/DetailPanel';
import type { Translation } from '../types/Translation';

// Mock window.backend for Storybook
const mockBackend = {
  getTranslation: async (promptName: string) => {
    console.log('getTranslation called with:', promptName);
    return { error: 'Not implemented in Storybook mock' };
  },
  getTranslationList: async (data: { keyword: string, categories: { character: boolean, tag: boolean, copyright: boolean } }) => {
    console.log('getTranslationList called with:', data);
    return { error: 'Not implemented in Storybook mock' };
  },
  getFavoriteList: async (limit?: number, page?: number) => {
    console.log('getFavoriteList called with:', limit, page);
    return { items: [], total: 0 };
  },
  getFavoriteListByCategory: async (limit: number, page: number, category: string) => {
    console.log('getFavoriteListByCategory called with:', limit, page, category);
    return { items: [], total: 0 };
  },
  upsertTranslation: async (data: {
    promptName: string;
    translationText?: string;
    searchWord?: string;
    note?: string;
    favorite?: number;
    copyrights?: string;
    category?: string;
  }) => {
    console.log('upsertTranslation called with:', data);
    return { success: true };
  },
  openExternalUrl: async (url: string) => {
    console.log('openExternalUrl called with:', url);
    return { success: true };
  },
};

// Assign the mock backend to window.backend
window.backend = mockBackend;

const meta: Meta<typeof DetailPanel> = {
  title: 'UI/DetailPanel',
  component: DetailPanel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  argTypes: {
    item: { control: 'object' },
    onDataChange: { action: 'data changed' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleItem: Translation = {
  prompt_name: 'sample_prompt_001',
  translation_text: 'これはサンプルの翻訳テキストです。',
  search_word: 'サンプル',
  note: 'これはサンプルのメモです。\n複数行のテキストも表示されます。',
  favorite: 1,
  copyrights: 'SampleCorp',
  category: 'General',
  updated_at: '2023-01-01T12:00:00Z',
};

export const Default: Story = {
  args: {
    item: sampleItem,
    onDataChange: () => alert('Data changed!'),
  },
};

export const NotFavorite: Story = {
  args: {
    item: { ...sampleItem, favorite: 0 },
    onDataChange: () => alert('Data changed!'),
  },
};

export const NoNote: Story = {
  args: {
    item: { ...sampleItem, note: undefined },
    onDataChange: () => alert('Data changed!'),
  },
};

export const NoCopyrights: Story = {
  args: {
    item: {
      "prompt_name": "sample_prompt_001",
      "translation_text": "これはサンプルの翻訳テキストです。",
      "search_word": "サンプル",
      "note": "これはサンプルのメモです。\n複数行のテキストも表示されます。",
      "favorite": 0,
      "category": "General",
      "updated_at": "2023-01-01T12:00:00.000Z"
    },
    onDataChange: () => alert('Data changed!'),
  },
};

export const NullItem: Story = {
  args: {
    item: null,
    onDataChange: () => alert('Data changed!'),
  },
};
