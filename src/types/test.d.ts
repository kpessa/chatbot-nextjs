import '@testing-library/jest-dom';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: HTMLAttributes<HTMLElement>;
    }
  }
}

export {}; 