describe('Game Journal Functionality', () => {
    const timestamp = new Date().getTime();
    const testUsername = `testuser_${timestamp}`;
    const testEmail = `testuser_${timestamp}@example.com`;
    const testPassword = 'Password123!';

    before(() => {
        // Setup initial user for journal tests
        cy.request('POST', `${Cypress.env('API_URL')}/users/register`, {
            username: testUsername,
            email: testEmail,
            password: testPassword
        });
    });

    beforeEach(() => {
        // Login before each test that requires it
        cy.visit('/login');
        cy.get('input[type="text"]').type(testUsername);
        cy.get('input[type="password"]').type(testPassword);
        cy.get('button[type="submit"]').click();
        cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('should add a game to the user journal', () => {
        // Visit specific game detail page (e.g., The Witcher 3: Wild Hunt assuming ID 1942)
        cy.visit('/game/1942');
        cy.contains('The Witcher 3: Wild Hunt', { timeout: 10000 }).should('be.visible');

        // Click Add to List / Accept Quest
        cy.get('button').contains('Accept Quest').click();

        // Modal should open, change status to 'PLAYING'
        cy.get('select[name="status"]').select('PLAYING');
        
        // Provide a review/note
        cy.get('textarea[name="review"]').type('Going great so far!');
        
        // Submit
        cy.get('button[type="submit"]').contains('Confirm Quest Details').click();

        // Find success toast
        cy.contains('Quest successfully added to your journal!').should('be.visible');
    });

    it('should view the added game in the user journal', () => {
        cy.visit('/my-list');
        cy.contains('SYNCHRONIZING_DATA...', { timeout: 10000 }).should('not.exist');

        // Verify the game is in the list
        cy.contains('The Witcher 3: Wild Hunt').should('be.visible');
        cy.contains('PLAYING').should('be.visible');
    });

    it('should edit the game in the list', () => {
        cy.visit('/my-list');
        cy.contains('SYNCHRONIZING_DATA...', { timeout: 10000 }).should('not.exist');

        // Open options dropdown
        cy.contains('The Witcher 3: Wild Hunt').parents('.group').find('button').last().click({ force: true });
        
        // Click edit inside dropdown
        cy.contains('button', 'Edit Status').click({ force: true });

        // Change status to COMPLETED
        cy.get('select[name="status"]').select('COMPLETED');
        cy.get('button[type="submit"]').contains('Confirm Quest Details').click();

        // Verify it changed in the UI automatically
        cy.visit('/my-list');
        cy.contains('SYNCHRONIZING_DATA...', { timeout: 10000 }).should('not.exist');
        cy.contains('COMPLETED').should('be.visible');
    });
});
