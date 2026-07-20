describe('Recruitment Feature Validation - OrangeHRM', () => {

  before(() => {
    Cypress.on('uncaught:exception', () => false);
    // Login dengan User-Agent agar tidak dianggap bot
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
    });
    cy.get('input[name="username"]', { timeout: 30000 }).type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 25000 }).should('include', '/dashboard');
  });

  // Helper function untuk memastikan tabel sudah ter-load
  const waitForTableData = () => {
    cy.get('.oxd-table-loader', { timeout: 20000 }).should('not.exist');
    cy.get('.oxd-table-card', { timeout: 20000 }).should('have.length.at.least', 1);
  };

  it('TC-REC-001: Akses menu Recruitment', () => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/recruitment/viewCandidates');
    cy.get('.oxd-table-header', { timeout: 25000 }).should('be.visible');
  });

  it('TC-REC-002: Add Candidate', () => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/recruitment/addCandidate');
    cy.get('input[name="firstName"]', { timeout: 25000 }).type('John');
    cy.get('input[name="lastName"]').type('Doe');
    cy.get('input[type="text"]').eq(2).type('john.doe@test.com');
    cy.get('button[type="submit"]').click();
    cy.contains('Successfully Saved', { timeout: 25000 }).should('be.visible');
  });

  it('TC-REC-003: Add Candidate tanpa nama', () => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/recruitment/addCandidate');
    cy.get('button[type="submit"]').click();
    cy.contains('Required', { timeout: 20000 }).should('be.visible');
  });

  it('TC-REC-004: Search Candidate Job', () => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/recruitment/viewCandidates');
    cy.get('.oxd-select-text').first().click();
    cy.get('.oxd-select-dropdown', { timeout: 20000 }).contains('IT Manager').click();
    cy.get('button[type="submit"]').click();
    waitForTableData();
  });

  it('TC-REC-005: Status Shortlist', () => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/recruitment/viewCandidates');
    waitForTableData();
    cy.get('.oxd-table-card').first().find('.oxd-table-cell').eq(1).click();
    cy.contains('Shortlist').click();
    cy.get('button[type="submit"]').click();
    cy.contains('Status: Shortlisted', { timeout: 20000 }).should('be.visible');
  });

  it('TC-REC-006: Jadwal Interview', () => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/recruitment/viewCandidates');
    waitForTableData();
    cy.get('.oxd-table-card').first().find('.oxd-table-cell').eq(1).click();
    cy.contains('Schedule Interview').click();
    cy.get('input[placeholder="Type for hints..."]').type('Admin');
    cy.get('.oxd-autocomplete-option', { timeout: 20000 }).first().click();
    cy.get('input[placeholder="yyyy-mm-dd"]').type('2026-07-18');
    cy.get('button[type="submit"]').click();
    cy.contains('Interview Scheduled', { timeout: 20000 }).should('be.visible');
  });

  it('TC-REC-007: Search by Status', () => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/recruitment/viewCandidates');
    cy.get('.oxd-select-text').eq(2).click();
    cy.get('.oxd-select-dropdown', { timeout: 20000 }).contains('Interview Scheduled').click();
    cy.get('button[type="submit"]').click();
    waitForTableData();
  });

  it('TC-REC-008: Hapus kandidat', () => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/recruitment/viewCandidates');
    waitForTableData();
    cy.get('.oxd-table-card').first().find('.bi-trash').click();
    cy.get('.oxd-button--label-danger', { timeout: 20000 }).click();
    cy.contains('Successfully Deleted', { timeout: 20000 }).should('be.visible');
  });
});