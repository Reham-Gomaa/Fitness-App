import type { Meta, StoryObj } from '@storybook/angular';
import { App } from './app';
import { expect } from 'storybook/test';

const meta: Meta<App> = {
  component: App,
  title: 'App',
};
export default meta;

type Story = StoryObj<App>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/app/gi)).toBeTruthy();
  },
};
