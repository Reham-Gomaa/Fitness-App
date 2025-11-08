import type { Meta, StoryObj } from '@storybook/angular';
import { Notfound } from './notfound';
import { expect } from 'storybook/test';

const meta: Meta<Notfound> = {
  component: Notfound,
  title: 'Notfound',
};
export default meta;

type Story = StoryObj<Notfound>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/notfound/gi)).toBeTruthy();
  },
};
