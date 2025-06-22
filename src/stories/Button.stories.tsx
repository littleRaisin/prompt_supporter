import type { Meta, StoryObj } from '@storybook/react';
import Button from '../ui/components/Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text' },
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
    onClick: { action: 'clicked' },
    variant: { control: 'select', options: ['primary', 'secondary'] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    text: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    text: 'Secondary Button',
    variant: 'secondary',
  },
};

export const Clickable: Story = {
  args: {
    text: 'Click Me',
    onClick: () => alert('Button clicked!'),
  },
};
