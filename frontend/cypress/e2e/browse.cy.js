describe('Browse and Search Functionality', () => {
    beforeEach(() => {
        cy.visit('/browse');
    });

    it('should load initial default search results', () => {
        // Wait for loading to finish
        cy.contains('SYNCHRONIZING_DATA...', { timeout: 10000 }).should('not.exist');
        // Ensure game cards are visible
        cy.get('.grid > div').should('have.length.greaterThan', 0);
    });

    it('should filter games by platform', () => {
        // Wait for loading to finish
        cy.contains('SYNCHRONIZING_DATA...', { timeout: 10000 }).should('not.exist');
        
        // Find platform filter section, assuming we have a PC tag
        cy.contains('button', 'PC').click({ force: true });
        
        // Results should update
        cy.contains('SYNCHRONIZING_DATA...').should('not.exist');
        cy.get('.grid > div').should('have.length.greaterThan', 0);
    });

    it('should search for a specific game (Witcher 3)', () => {
        // Find search input and type "Witcher 3"
        cy.get('input[placeholder="Search quest identifier..."]').type('Witcher 3', { force: true });
        
        // Wait for results
        cy.contains('SYNCHRONIZING_DATA...', { timeout: 10000 }).should('not.exist');
        // Check for specific game card title
        cy.contains('The Witcher 3: Wild Hunt').should('be.visible');
    });
});
