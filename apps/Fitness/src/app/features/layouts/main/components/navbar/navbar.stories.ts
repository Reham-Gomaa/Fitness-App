import type { Meta, StoryObj } from '@storybook/angular';
import { Navbar } from './navbar';
import { expect } from 'storybook/test';

const meta: Meta<Navbar> = {
  component: Navbar,
  title: 'Navbar',
};
export default meta;

type Story = StoryObj<Navbar>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/navbar/gi)).toBeTruthy();
  },
};
