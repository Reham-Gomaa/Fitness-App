import type { Meta, StoryObj } from '@storybook/angular';
import { Footer } from './footer';
import { expect } from 'storybook/test';

const meta: Meta<Footer> = {
  component: Footer,
  title: 'Footer',
};
export default meta;

type Story = StoryObj<Footer>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/footer/gi)).toBeTruthy();
  },
};
