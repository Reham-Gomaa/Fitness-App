import type { Meta, StoryObj } from '@storybook/angular';
import { Login } from './login';
import { expect } from 'storybook/test';

const meta: Meta<Login> = {
  component: Login,
  title: 'Login',
};
export default meta;

type Story = StoryObj<Login>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/login/gi)).toBeTruthy();
  },
};
