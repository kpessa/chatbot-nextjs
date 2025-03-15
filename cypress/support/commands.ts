/// <reference types="cypress" />
import '@testing-library/cypress/add-commands';
import { mount } from '@cypress/react';

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      mount: typeof mount;
      enableDebugMode(): Chainable<void>;
      disableDebugMode(): Chainable<void>;
      verifyDebugMode(enabled: boolean): Chainable<void>;
      login(email: string, password: string): void;
    }
  }
}

// -- This is a parent command --
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/');
    cy.get('input[name=email]').type(email);
    cy.get('input[name=password]').type(password);
    cy.get('button[type=submit]').click();
    cy.url().should('include', '/chat');
  });
});

// Enable debug mode
Cypress.Commands.add('enableDebugMode', () => {
  // Find and click the debug button
  cy.contains('button', 'Debug (Off)').click();
  cy.verifyDebugMode(true);
});

// Disable debug mode
Cypress.Commands.add('disableDebugMode', () => {
  // Find and click the debug button when it's enabled
  cy.contains('button', 'Debug (On)').click();
  cy.verifyDebugMode(false);
});

// Verify debug mode state
Cypress.Commands.add('verifyDebugMode', (enabled: boolean) => {
  const state = enabled ? 'On' : 'Off';
  const className = enabled ? 'text-primary' : 'text-muted-foreground';
  
  // Find the debug button and verify its state
  cy.contains('button', `Debug (${state})`)
    .should('exist')
    .and('have.class', className);
  
  // Verify toast notification
  cy.contains(enabled ? 'Debug mode enabled' : 'Debug mode disabled')
    .should('be.visible');
  
  // Verify console log message
  cy.get('@consoleLog').should('be.calledWith', 
    enabled ? '[DEBUG] Verbose logging enabled' : '[DEBUG] Verbose logging disabled'
  );
});