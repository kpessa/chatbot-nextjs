// Type definition for the spy object
type ConsoleSpy = {
  getCalls: () => Array<{ args: unknown[] }>;
} & Cypress.Agent<sinon.SinonSpy>;

describe('ChatInterface', () => {
  beforeEach(() => {
    // Visit the chat page before each test
    cy.visit('/chat');

    // Spy on console.log
    cy.window().then((win) => {
      cy.spy(win.console, 'log').as('consoleLog');
    });
  });

  describe('Debug Mode', () => {
    it('should toggle debug mode when clicking the debug button', () => {
      // Enable debug mode
      cy.enableDebugMode();

      // Disable debug mode
      cy.disableDebugMode();
    });

    it('should log API requests when debug mode is enabled', () => {
      // Enable debug mode
      cy.enableDebugMode();

      // Type and send a message
      cy.get('textarea[placeholder="Type your message..."]').type('Hello{enter}');

      // Wait for debug logs
      cy.wait(2000);

      // Verify debug mode logs
      cy.get('@consoleLog').should((spy: unknown) => {
        const consoleSpy = spy as ConsoleSpy;
        // Verify debug mode is enabled
        expect(consoleSpy).to.be.calledWith('Verbose logging enabled');
        
        // Verify API request logging
        const calls = consoleSpy.getCalls();
        const apiCall = calls.find((call) => 
          typeof call.args[0] === 'string' && 
          call.args[0] === 'Starting sendMessage with:'
        );
        expect(apiCall).to.exist;
      });
    });

    it('should show toast notifications when toggling debug mode', () => {
      // Enable debug mode
      cy.enableDebugMode();
      cy.contains('Debug mode enabled').should('be.visible');

      // Disable debug mode
      cy.disableDebugMode();
      cy.contains('Debug mode disabled').should('be.visible');
    });

    it('should persist debug state during chat session', () => {
      // Enable debug mode
      cy.enableDebugMode();

      // Send multiple messages
      cy.get('textarea[placeholder="Type your message..."]').type('First message{enter}');
      cy.wait(1000); // Wait for first message to be sent
      cy.get('textarea[placeholder="Type your message..."]').type('Second message{enter}');

      // Wait for debug logs
      cy.wait(2000);

      // Verify debug mode is still enabled
      cy.verifyDebugMode(true);

      // Verify debug mode logs
      cy.get('@consoleLog').should((spy: unknown) => {
        const consoleSpy = spy as ConsoleSpy;
        // Verify debug mode is enabled
        expect(consoleSpy).to.be.calledWith('Verbose logging enabled');
        
        // Verify API request logging for both messages
        const calls = consoleSpy.getCalls();
        const apiCalls = calls.filter((call) => 
          typeof call.args[0] === 'string' && 
          call.args[0] === 'Starting sendMessage with:'
        );
        expect(apiCalls).to.have.length.at.least(2);
      });
    });

    it('should handle rapid debug mode toggling', () => {
      // Rapidly toggle debug mode multiple times
      for (let i = 0; i < 3; i++) {
        cy.get('button').contains('Debug').click();
        cy.wait(100);
      }

      // Verify final state matches button state
      cy.get('button').contains('Debug').then(($btn) => {
        const isEnabled = $btn.text().includes('(On)');
        cy.verifyDebugMode(isEnabled);
      });
    });
  });
}); 