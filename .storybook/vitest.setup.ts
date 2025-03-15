import { beforeAll } from 'vitest';
import { setProjectAnnotations } from '@storybook/experimental-nextjs-vite';
import * as projectAnnotations from './preview';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
const project = setProjectAnnotations([projectAnnotations]);

beforeAll(project.beforeAll);

// Mock UUID generation for consistent testing
vi.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));