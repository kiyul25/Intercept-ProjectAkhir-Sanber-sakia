describe('Login Functionality Validation - OrangeHRM', () => {

  beforeEach(() => {
    // Membuka halaman login sebelum menjalankan setiap test case
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  });

  // TC-LOG-001: Login dengan data valid
  it('TC-LOG-001: Login dengan data valid', () => {
    // Intercept request ke dashboard untuk memastikan halaman termuat
    cy.intercept('GET', '**/dashboard/**').as('getDashboard');

    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    // Tunggu proses pemuatan dashboard selesai
    cy.wait('@getDashboard');
    
    // Asersi bahwa user berhasil masuk ke dashboard
    cy.url().should('include', '/dashboard');
    cy.contains('Dashboard').should('be.visible');
  });

  // TC-LOG-002: Login dengan username kosong
  it('TC-LOG-002: Login dengan username kosong', () => {
    // Mengosongkan username, hanya mengisi password
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    // Asersi muncul pesan Required pada field username
    cy.get('.oxd-input-group__message').should('contain', 'Required');
  });

  // TC-LOG-003: Login dengan password kosong
  it('TC-LOG-003: Login dengan password kosong', () => {
    // Hanya mengisi username, mengosongkan password
    cy.get('input[name="username"]').type('Admin');
    cy.get('button[type="submit"]').click();

    // Asersi muncul pesan Required pada field password
    cy.get('.oxd-input-group__message').should('contain', 'Required');
  });

  // TC-LOG-004: Login dengan username salah
  it('TC-LOG-004: Login dengan username salah', () => {
    // Intercept API validasi login
    cy.intercept('POST', '**/auth/validate').as('validateLogin');

    cy.get('input[name="username"]').type('SalahUsername');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    cy.wait('@validateLogin');

    // Asersi muncul pesan Invalid credentials
    cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials');
  });

  // TC-LOG-005: Login dengan password salah
  it('TC-LOG-005: Login dengan password salah', () => {
    cy.intercept('POST', '**/auth/validate').as('validateLogin');

    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('salahpassword');
    cy.get('button[type="submit"]').click();

    cy.wait('@validateLogin');

    // Asersi muncul pesan Invalid credentials
    cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials');
  });

  // TC-LOG-006: Login case sensitive password
  it('TC-LOG-006: Login case sensitive password', () => {
    cy.intercept('POST', '**/auth/validate').as('validateLogin');

    // Mengisi password dengan huruf kapital (ADMIN123)
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('ADMIN123');
    cy.get('button[type="submit"]').click();

    cy.wait('@validateLogin');

    // Asersi muncul pesan Invalid credentials karena password case sensitive
    cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials');
  });

  // TC-LOG-007: Forgot Password link
  it('TC-LOG-007: Forgot Password link', () => {
    cy.contains('Forgot your password?').click();

    // Asersi halaman reset password tampil
    cy.url().should('include', '/auth/requestPasswordResetCode');
    cy.contains('Reset Password').should('be.visible');
  });

  it('TC-LOG-008: Logout dari sistem', () => {
    
    // Mencegah Cypress menggagalkan test karena error bawaan aplikasi (OrangeHRM)
    Cypress.on('uncaught:exception', (err, runnable) => {
      // Mengembalikan false agar Cypress mengabaikan error ini
      return false;
    });

    // Prasyarat: User harus login terlebih dahulu
    cy.intercept('GET', '**/dashboard/**').as('getDashboard');
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    
    // Tunggu dashboard termuat
    cy.wait('@getDashboard');

    // Klik menu profil (dropdown di kanan atas)
    cy.get('.oxd-userdropdown-tab').click();
    
    // Klik opsi Logout
    cy.contains('Logout').click();

    // Asersi user kembali ke halaman login
    cy.url().should('include', '/auth/login');
    cy.contains('Login').should('be.visible');
  });

});