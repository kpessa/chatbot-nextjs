/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

// Augment the Cypress namespace to include type definitions for
// your custom command.
declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to login with email and password
     * @example cy.login('test@example.com', 'password123')
     */
    login(email: string, password: string): Chainable<void>;
  }
} 