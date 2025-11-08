import type { Meta, StoryObj } from '@storybook/angular';
import { Forgetpass } from './forgetpass';
import { expect } from 'storybook/test';

const meta: Meta<Forgetpass> = {
  component: Forgetpass,
  title: 'Forgetpass',
};
export default meta;

type Story = StoryObj<Forgetpass>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/forgetpass/gi)).toBeTruthy();
  },
};
