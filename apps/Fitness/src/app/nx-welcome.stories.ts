import type { Meta, StoryObj } from '@storybook/angular';
import { NxWelcome } from './nx-welcome';
import { expect } from 'storybook/test';

const meta: Meta<NxWelcome> = {
  component: NxWelcome,
  title: 'NxWelcome',
};
export default meta;

type Story = StoryObj<NxWelcome>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/nx-welcome/gi)).toBeTruthy();
  },
};
