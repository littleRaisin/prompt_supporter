import type { Meta, StoryObj } from '@storybook/react';
import SearchCategoryCheckbox from '../ui/components/SearchCategoryCheckbox';

const meta: Meta<typeof SearchCategoryCheckbox> = {
  title: 'UI/SearchCategoryCheckbox',
  component: SearchCategoryCheckbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    categoryKey: { control: 'select', options: ['character', 'tag', 'copyright'] },
    checked: { control: 'boolean' },
    onChange: { action: 'category changed' }, // actionはそのまま残す
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const CharacterChecked: Story = {
  args: {
    label: 'キャラ',
    categoryKey: 'character',
    checked: true,
    onChange: () => {}, // ダミー関数に変更
  },
};

export const TagUnchecked: Story = {
  args: {
    label: 'タグ',
    categoryKey: 'tag',
    checked: false,
    onChange: () => {}, // ダミー関数に変更
  },
};

export const CopyrightChecked: Story = {
  args: {
    label: 'コピーライト',
    categoryKey: 'copyright',
    checked: true,
    onChange: () => {}, // ダミー関数に変更
  },
};
