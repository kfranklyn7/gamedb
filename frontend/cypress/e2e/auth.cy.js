describe('Authentication Flow', () => {
    const timestamp = new Date().getTime();
    const testUsername = `testuser_${timestamp}`;
    const testEmail = `testuser_${timestamp}@example.com`;
    const testPassword = 'Password123!';
  
    it('should register a new user successfully', () => {
      cy.visit('/register');
      cy.get('input[type="text"]').type(testUsername);
      cy.get('input[type="email"]').type(testEmail);
      cy.get('input[type="password"]').type(testPassword);
      cy.get('button[type="submit"]').click();
      
      // Should redirect to login on success
      cy.url().should('include', '/login');
    });
  
    it('should login an existing user successfully', () => {
      cy.visit('/login');
      cy.get('input[type="text"]').type(testUsername);
      cy.get('input[type="password"]').type(testPassword);
      cy.get('button[type="submit"]').click();
  
      // Should redirect to dashboard/home and show logout button
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      cy.contains('LOGOUT').should('be.visible');
    });
  
    it('should display error on invalid login', () => {
      cy.visit('/login');
      cy.get('input[type="text"]').type('nonexistentuser');
      cy.get('input[type="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();
  
      // Error message should be visible
      cy.contains('Invalid username or password').should('be.visible');
    });
  });
