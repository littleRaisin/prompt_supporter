import type { Meta, StoryObj } from '@storybook/react';
import TextButton from '../ui/components/TextButton';

const meta: Meta<typeof TextButton> = {
  title: 'UI/TextButton',
  component: TextButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' }, // actionはそのまま残す
    children: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'テキストボタン',
    onClick: () => {}, // ダミー関数に変更
  },
};

export const LongText: Story = {
  args: {
    children: '非常に長いテキストのボタンです',
    onClick: () => {}, // ダミー関数に変更
  },
};
