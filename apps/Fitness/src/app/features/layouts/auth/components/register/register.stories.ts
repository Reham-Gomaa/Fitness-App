import type { Meta, StoryObj } from '@storybook/angular';
import { Register } from './register';
import { expect } from 'storybook/test';

const meta: Meta<Register> = {
  component: Register,
  title: 'Register',
};
export default meta;

type Story = StoryObj<Register>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/register/gi)).toBeTruthy();
  },
};
