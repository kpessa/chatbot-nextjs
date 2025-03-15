import type { Meta, StoryObj } from '@storybook/react';
import { ExportMenu } from '@/components/molecules/ExportMenu';
import { Message } from '@/lib/types';

const meta: Meta<typeof ExportMenu> = {
  title: 'Molecules/ExportMenu',
  component: ExportMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ExportMenu>;

// Sample messages for the stories
const sampleMessages: Message[] = [
  {
    id: '1',
    role: 'user',
    content: 'Hello, how can you help me today?',
    timestamp: Date.now() - 60000,
  },
  {
    id: '2',
    role: 'assistant',
    content: 'I can help you with a variety of tasks. What would you like to know?',
    timestamp: Date.now() - 30000,
  },
  {
    id: '3',
    role: 'user',
    content: 'Can you explain how to use React hooks?',
    timestamp: Date.now(),
  },
];

export const Default: Story = {
  args: {
    messages: sampleMessages,
  },
};

export const Empty: Story = {
  args: {
    messages: [],
  },
};

export const WithCustomClass: Story = {
  args: {
    messages: sampleMessages,
    className: 'bg-blue-100 p-2 rounded',
  },
}; 