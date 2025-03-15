describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the title', () => {
    cy.findByRole('heading', { name: /LLM Chat Interface/i }).should('exist');
  });

  it('should have navigation links', () => {
    cy.findByRole('link', { name: /Open Chat/i }).should('exist');
    cy.findByRole('link', { name: /Open Settings/i }).should('exist');
  });

  it('should navigate to chat page', () => {
    cy.findByRole('link', { name: /Open Chat/i }).click();
    cy.url().should('include', '/chat');
  });

  it('should navigate to settings page', () => {
    cy.findByRole('link', { name: /Open Settings/i }).click();
    cy.url().should('include', '/settings');
  });
}); 