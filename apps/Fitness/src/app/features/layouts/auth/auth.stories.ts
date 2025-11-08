import type { Meta, StoryObj } from '@storybook/angular';
import { Auth } from './auth';
import { expect } from 'storybook/test';

const meta: Meta<Auth> = {
  component: Auth,
  title: 'Auth',
};
export default meta;

type Story = StoryObj<Auth>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/auth/gi)).toBeTruthy();
  },
};
