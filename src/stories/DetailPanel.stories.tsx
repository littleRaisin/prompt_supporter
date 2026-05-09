import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import DetailPanel from '../ui/components/DetailPanel';
import type { Translation } from '../types/Translation';

// Mock window.backend for Storybook
const mockBackend: Window['backend'] = {
  getTranslation: async (_promptName) => ({ error: 'Not implemented in Storybook mock' }),
  getTranslationList: async (_data) => ({ error: 'Not implemented in Storybook mock' }),
  getFavoriteList: async (_limit?, _page?) => ({ items: [], total: 0 }),
  getFavoriteListByCategory: async (_limit, _page, _category) => ({ items: [], total: 0 }),
  upsertTranslation: async (_data) => ({ success: true }),
  deleteTranslation: async (_promptName) => ({ success: true }),
  openExternalUrl: async (_url) => ({ success: true }),
  getAppVersion: async () => '0.0.0',
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
  category: 'character',
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
      "category": "character",
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
