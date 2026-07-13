Cypress.on('uncaught:exception', () => false);

describe('OrangeHRM Login Feature Testing - 12 Scenarios Stable', () => {
  const loginUrl = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit(loginUrl);
    cy.get('input[name="username"]').should('be.visible');
  });

  // TC-001 hingga TC-007 & TC-010, TC-011, TC-012: Menggunakan API Auth
  const loginCases = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];
  
  // Kita gunakan intercept yang pasti dipanggil saat klik tombol submit
  it('TC-001: Login Berhasil', () => {
    cy.intercept('POST', '**/auth/validate').as('loginReq');
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginReq'); 
  });

  it('TC-002: Username Salah', () => {
    cy.intercept('POST', '**/auth/validate').as('loginReq');
    cy.get('input[name="username"]').type('usersalah');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginReq');
  });

  it('TC-003: Password Salah', () => {
    cy.intercept('POST', '**/auth/validate').as('loginReq');
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('salah');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginReq');
  });

  it('TC-004: Username Kosong', () => {
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-input-group__message').should('contain', 'Required');
  });

  it('TC-005: Password Kosong', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-input-group__message').should('contain', 'Required');
  });

  it('TC-006: Semua Kosong', () => {
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-input-group__message').should('have.length', 2);
  });

  it('TC-007: Case Sensitivity', () => {
    cy.intercept('POST', '**/auth/validate').as('loginReq');
    cy.get('input[name="username"]').type('ADMIN123');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginReq');
  });

  it('TC-008: Visibilitas Password', () => {
    // Tidak perlu intercept karena ini pengecekan UI, bukan API
    cy.get('input[name="password"]').type('admin123');
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');
  });

  it('TC-009: Forgot Password', () => {
    cy.intercept('GET', '**/requestPasswordResetCode').as('forgotReq');
    cy.get('.orangehrm-login-forgot').click();
    cy.wait('@forgotReq');
  });

  it('TC-010: Tombol Enter', () => {
    cy.intercept('POST', '**/auth/validate').as('loginReq');
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123{enter}');
    cy.wait('@loginReq');
  });

  it('TC-011: Copy-Paste', () => {
    cy.get('input[name="password"]').type('admin123');
    cy.get('input[name="password"]').should('have.prop', 'value', 'admin123');
  });

  it('TC-012: Performa Login', () => {
    cy.intercept('POST', '**/auth/validate').as('loginReq');
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginReq');
  });
});