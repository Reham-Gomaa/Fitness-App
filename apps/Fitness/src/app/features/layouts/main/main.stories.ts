import type { Meta, StoryObj } from '@storybook/angular';
import { Main } from './main';
import { expect } from 'storybook/test';

const meta: Meta<Main> = {
  component: Main,
  title: 'Main',
};
export default meta;

type Story = StoryObj<Main>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/main/gi)).toBeTruthy();
  },
};
