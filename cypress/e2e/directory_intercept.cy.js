describe('Directory Feature Validation - OrangeHRM', () => {

  before(() => {
    cy.session('loginSession', () => {
      cy.visit('https://opensource-demo.orangehrmlive.com/');
      cy.get('input[name="username"]').type('Admin');
      cy.get('input[name="password"]').type('admin123');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/dashboard');
    });
  });

  beforeEach(() => {
    cy.visit('/web/index.php/directory/viewDirectory');
    // Pastikan halaman benar-benar dimuat
    cy.get('.oxd-topbar-header-breadcrumb').should('contain', 'Directory');
  });

  it('TC-DIR-001: Akses menu Directory', () => {
    cy.get('.oxd-directory-card').should('have.length.at.least', 1);
  });

  it('TC-DIR-002: Pencarian by Nama', () => {
    cy.get('input[placeholder="Type for hints..."]').type('John');
    cy.get('.oxd-autocomplete-dropdown', { timeout: 10000 }).contains('John').click();
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-directory-card').should('contain', 'John');
  });

  it('TC-DIR-003: Pencarian by Job Title', () => {
    cy.get('.oxd-select-text').eq(0).click();
    // Gunakan contain untuk memilih dropdown dengan lebih stabil
    cy.get('.oxd-select-dropdown').contains('QA Engineer').click();
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-directory-card').should('be.visible');
  });

  it('TC-DIR-004: Pencarian by Location', () => {
    cy.get('.oxd-select-text').eq(1).click();
    cy.get('.oxd-select-dropdown').contains('Texas').click();
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-directory-card').should('be.visible');
  });

  it('TC-DIR-005: Pencarian data tidak ada', () => {
    cy.get('input[placeholder="Type for hints..."]').type('DataTidakAda123');
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-text--toast-message, .oxd-alert-content').should('exist');
    // Jika OrangeHRM menampilkan teks "No Records Found" di dalam kontainer
    cy.contains('No Records Found', { timeout: 10000 }).should('be.visible');
  });

  it('TC-DIR-006: Reset filter', () => {
    cy.get('input[placeholder="Type for hints..."]').type('John');
    cy.get('button[type="reset"]').click();
    cy.get('input[placeholder="Type for hints..."]').should('have.value', '');
  });

  it('TC-DIR-007: Lihat detail karyawan', () => {
    cy.get('input[placeholder="Type for hints..."]').type('John');
    cy.get('.oxd-autocomplete-dropdown').contains('John').click();
    cy.get('button[type="submit"]').click();
    // Klik tombol view/profile jika ada, atau klik kartu
    cy.get('.oxd-directory-card').first().find('p.orangehrm-directory-card-header--name').click();
    cy.url().should('include', '/pim/viewPersonalDetails');
  });
});