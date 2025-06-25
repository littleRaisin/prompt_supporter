import type { Meta, StoryObj } from '@storybook/react';
import Result from '../ui/components/Result';
import type { Translation } from '../types/Translation';

const meta: Meta<typeof Result> = {
  title: 'UI/Result',
  component: Result,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    item: { control: 'object' },
    handleClick: { action: 'item clicked' },
    handleEdit: { action: 'edit clicked' },
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
  category: 'tag', // or 'character', 'copyright'
  updated_at: '2023-01-01T12:00:00Z',
};

export const Default: Story = {
  args: {
    item: sampleItem,
    handleClick: () => () => {}, // ダミー関数に変更
    handleEdit: () => () => {}, // ダミー関数に変更
  },
};

export const CharacterCategory: Story = {
  args: {
    item: { ...sampleItem, category: 'character', copyrights: 'CharacterName' },
    handleClick: () => () => {}, // ダミー関数に変更
    handleEdit: () => () => {}, // ダミー関数に変更
  },
};

export const CopyrightCategory: Story = {
  args: {
    item: { ...sampleItem, category: 'copyright', copyrights: 'CopyrightHolder' },
    handleClick: () => () => {}, // ダミー関数に変更
    handleEdit: () => () => {}, // ダミー関数に変更
  },
};

export const LongText: Story = {
  args: {
    item: { ...sampleItem, translation_text: 'これは非常に長いサンプルの翻訳テキストです。表示領域を超える可能性のあるテキストをテストするために使用されます。' },
    handleClick: () => () => {}, // ダミー関数に変更
    handleEdit: () => () => {}, // ダミー関数に変更
  },
};
