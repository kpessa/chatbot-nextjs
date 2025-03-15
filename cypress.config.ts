import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    experimentalRunAllSpecs: true,
    defaultCommandTimeout: 10000,
    setupNodeEvents() {
      // implement node event listeners here
    },
  },
}); 