import type { Meta, StoryObj } from '@storybook/angular';
import { Home } from './home';
import { expect } from 'storybook/test';

const meta: Meta<Home> = {
  component: Home,
  title: 'Home',
};
export default meta;

type Story = StoryObj<Home>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/home/gi)).toBeTruthy();
  },
};
