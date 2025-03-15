describe('Settings Page', () => {
  beforeEach(() => {
    cy.visit('/settings');
    // Wait for the page to load
    cy.findByText('Settings').should('exist');
  });

  it('should display the settings interface', () => {
    cy.findByText('Settings').should('exist');
    cy.findByText('Model Settings').should('exist');
    cy.findByText('API Keys').should('exist');
    cy.findByText('Theme').should('exist');
  });

  it('should allow changing the theme', () => {
    // Find the theme selector
    cy.findByLabelText('Theme').should('exist');
    
    // Select dark theme
    cy.findByLabelText('Theme').click();
    cy.findByText('Dark').click();
    
    // Verify the theme was changed
    cy.get('html').should('have.class', 'dark');
    
    // Select light theme
    cy.findByLabelText('Theme').click();
    cy.findByText('Light').click();
    
    // Verify the theme was changed
    cy.get('html').should('not.have.class', 'dark');
  });

  it('should allow setting API keys', () => {
    // Find the OpenAI API key input
    cy.findByLabelText('OpenAI API Key').should('exist');
    
    // Enter an API key
    const apiKey = 'sk-test-key123456789';
    cy.findByLabelText('OpenAI API Key').type(apiKey);
    
    // Save settings
    cy.findByRole('button', { name: /save settings/i }).click();
    
    // Verify the success message
    cy.findByText(/settings saved/i).should('exist');
  });

  it('should navigate back to chat page', () => {
    // Click the back to chat button
    cy.findByRole('link', { name: /back to chat/i }).click();
    
    // Verify navigation to chat page
    cy.url().should('include', '/chat');
  });
}); 