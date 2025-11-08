import type { Meta, StoryObj } from '@storybook/angular';
import { FitnessForm } from './fitness-form';
import { expect } from 'storybook/test';

const meta: Meta<FitnessForm> = {
  component: FitnessForm,
  title: 'FitnessForm',
};
export default meta;

type Story = StoryObj<FitnessForm>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/fitness-form/gi)).toBeTruthy();
  },
};
