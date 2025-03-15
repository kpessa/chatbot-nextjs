describe('Chat Page', () => {
  beforeEach(() => {
    cy.visit('/chat');
    // Wait for the page to load
    cy.findByText('AI Assistant').should('exist');
  });

  it('should display the chat interface', () => {
    cy.findByText('AI Assistant').should('exist');
    cy.findByPlaceholderText('Type your message...').should('exist');
  });

  it('should allow selecting a model', () => {
    // Open the model selector dropdown
    cy.get('button[role="combobox"]').click();
    // Select a different model
    cy.findByText('Claude 3 Opus').click();
    // Verify the model was selected
    cy.get('button[role="combobox"]').should('contain', 'Claude 3 Opus');
  });

  it('should send a message and receive a response', () => {
    const message = 'Hello, how are you?';
    
    // Type a message
    cy.findByPlaceholderText('Type your message...').type(message);
    
    // Send the message
    cy.findByRole('button', { name: /send/i }).click();
    
    // Verify the message was sent
    cy.findByText(message).should('exist');
    
    // Wait for the response
    cy.findByText(/I received your message/i, { timeout: 10000 }).should('exist');
  });

  it('should navigate to settings page', () => {
    // Click the settings button
    cy.findByRole('button', { name: /settings/i }).click();
    
    // Verify navigation to settings page
    cy.url().should('include', '/settings');
  });
}); 