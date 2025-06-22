import type { Meta, StoryObj } from '@storybook/react';
import FavoriteIcon from '../ui/components/FavoriteIcon';

const meta: Meta<typeof FavoriteIcon> = {
  title: 'UI/FavoriteIcon',
  component: FavoriteIcon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isFavorite: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isFavorite: false,
  },
};

export const Favorited: Story = {
  args: {
    isFavorite: true,
  },
};

export const Clickable: Story = {
  args: {
    isFavorite: false,
    onClick: () => alert('Favorite icon clicked!'),
  },
};
