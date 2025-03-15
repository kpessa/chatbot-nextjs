describe('Export Functionality', () => {
  beforeEach(() => {
    cy.visit('/chat');
    // Wait for the page to load
    cy.findByText('AI Assistant').should('exist');
    
    // Send a message to have something to export
    const message = 'Hello, this is a test message for export';
    cy.findByPlaceholderText('Type your message...').type(message);
    cy.findByRole('button', { name: /send/i }).click();
    
    // Wait for the response
    cy.findByText(/I received your message/i, { timeout: 10000 }).should('exist');
  });

  it('should show export button when messages exist', () => {
    cy.findByRole('button', { name: /export/i }).should('exist');
  });

  it('should open export menu when clicked', () => {
    cy.findByRole('button', { name: /export/i }).click();
    
    // Verify export options are displayed
    cy.findByText('Export as Text').should('exist');
    cy.findByText('Export as JSON').should('exist');
    cy.findByText('Export as HTML').should('exist');
    cy.findByText('Export as Markdown').should('exist');
  });

  // Note: Testing actual file downloads is complex in Cypress
  // This test verifies the UI interaction but not the actual download
  it('should trigger export when option is selected', () => {
    // Spy on the download function
    cy.window().then((win) => {
      cy.spy(win.document, 'createElement').as('createElement');
    });
    
    // Click export button
    cy.findByRole('button', { name: /export/i }).click();
    
    // Select export as text
    cy.findByText('Export as Text').click();
    
    // Verify an anchor element was created (part of the download process)
    cy.get('@createElement').should('have.been.calledWith', 'a');
  });
}); 