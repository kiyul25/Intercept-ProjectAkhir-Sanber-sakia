Cypress.on('uncaught:exception', () => false);

describe('Scenario Verifikasi Fungsi Login', () => {
  const loginUrl = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';
  const apiBase = 'https://opensource-demo.orangehrmlive.com/web/index.php';

  it('TC-001: Login Berhasil', () => {
    cy.visit(loginUrl);
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.intercept('POST', `${apiBase}/api/v2/auth/login`).as('req1');
    cy.get('button[type="submit"]').click();
    cy.wait('@req1').its('response.statusCode').should('eq', 200);
  });

  it('TC-002: Username Salah', () => {
    cy.visit(loginUrl);
    cy.get('input[name="username"]').type('usersalah');
    cy.get('input[name="password"]').type('admin123');
    cy.intercept('POST', `${apiBase}/api/v2/auth/login`).as('req2');
    cy.get('button[type="submit"]').click();
    cy.wait('@req2');
  });

  it('TC-003: Password Salah', () => {
    cy.visit(loginUrl);
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('salah');
    cy.intercept('POST', `${apiBase}/api/v2/auth/login`).as('req3');
    cy.get('button[type="submit"]').click();
    cy.wait('@req3');
  });

  it('TC-004: Username Kosong', () => {
    cy.visit(loginUrl);
    cy.get('input[name="password"]').type('admin123');
    cy.intercept('GET', `${apiBase}/core/i18n/messages`).as('req4');
    cy.get('button[type="submit"]').click();
    cy.wait('@req4');
  });

  it('TC-005: Password Kosong', () => {
    cy.visit(loginUrl);
    cy.get('input[name="username"]').type('Admin');
    cy.intercept('GET', `${apiBase}/core/i18n/messages`).as('req5');
    cy.get('button[type="submit"]').click();
    cy.wait('@req5');
  });

  it('TC-006: Semua Kosong', () => {
    cy.visit(loginUrl);
    cy.intercept('GET', `${apiBase}/core/i18n/messages`).as('req6');
    cy.get('button[type="submit"]').click();
    cy.wait('@req6');
  });

  it('TC-007: Case Sensitivity', () => {
    cy.visit(loginUrl);
    cy.get('input[name="username"]').type('ADMIN123');
    cy.get('input[name="password"]').type('admin123');
    cy.intercept('POST', `${apiBase}/api/v2/auth/login`).as('req7');
    cy.get('button[type="submit"]').click();
    cy.wait('@req7');
  });

  it('TC-008: Visibilitas Password', () => {
    cy.visit(loginUrl);
    cy.get('input[name="password"]').type('admin123');
    cy.intercept('GET', `${apiBase}/web/images/orange.ico`).as('req8');
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');
    cy.wait('@req8');
  });

  it('TC-009: Forgot Password', () => {
    cy.visit(loginUrl);
    cy.intercept('GET', `${apiBase}/api/v2/auth/password/reset`).as('req9');
    cy.get('.orangehrm-login-forgot').click();
    cy.wait('@req9');
  });

  it('TC-010: Tombol Enter', () => {
    cy.visit(loginUrl);
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123{enter}');
    cy.intercept('POST', `${apiBase}/api/v2/auth/login`).as('req10');
    cy.wait('@req10');
  });

  it('TC-011: Copy-Paste', () => {
    cy.visit(loginUrl);
    cy.get('input[name="password"]').type('admin123');
    cy.intercept('GET', `${apiBase}/core/i18n/messages`).as('req11');
    cy.get('input[name="password"]').should('have.prop', 'value', 'admin123');
    cy.wait('@req11');
  });

  it('TC-012: Performa Login', () => {
    cy.visit(loginUrl);
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.intercept('POST', `${apiBase}/api/v2/auth/login`).as('req12');
    cy.get('button[type="submit"]').click();
    cy.wait('@req12');
  });
});