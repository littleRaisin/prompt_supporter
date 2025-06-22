import type { Meta, StoryObj } from '@storybook/react';
import Pagination from '../ui/components/Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'UI/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    page: { control: { type: 'number', min: 1 } },
    maxPage: { control: { type: 'number', min: 1 } },
    onPageChange: { action: 'page changed' }, // actionはそのまま残す
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    page: 1,
    maxPage: 10,
    onPageChange: () => {}, // ダミー関数に変更
  },
};

export const MiddlePage: Story = {
  args: {
    page: 5,
    maxPage: 10,
    onPageChange: () => {}, // ダミー関数に変更
  },
};

export const LastPage: Story = {
  args: {
    page: 10,
    maxPage: 10,
    onPageChange: () => {}, // ダミー関数に変更
  },
};

export const SinglePage: Story = {
  args: {
    page: 1,
    maxPage: 1,
    onPageChange: () => {}, // ダミー関数に変更
  },
};
