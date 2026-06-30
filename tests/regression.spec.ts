 //App   : https://github.com/idurar/idurar-erp-crm  
 //Run   : npx playwright test

import { test, expect } from '../fixtures/authFixture';
import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { CompanyPage } from '../pages/CompanyPage';
import { PeoplePage } from '../pages/PeoplePage';
import { CustomerPage } from '../pages/CustomerPage';
import { ProductCategoryPage } from '../pages/ProductCategoryPage';
import {ProductPage} from '../pages/ProductPage';
import {InvoicePage} from '../pages/InvoicePage';
import {PaymentPage} from '../pages/PaymentPage';
import { LanguagePage } from '../pages/LanguagePage';


let companyName!: string;
let personName!: string;
let categoryName!: string;
let productName!: string;

// TC-01  LOGIN MODULE

baseTest.describe('TC-01: Login Module', () => {
  let loginPage: LoginPage;
  baseTest.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  baseTest('TC-01a: Verify valid login', async ({ page }) => {
    await loginPage.login(
      process.env.USER_EMAIL!,
      process.env.USER_PASSWORD!
    );
    await expect(page).not.toHaveURL(/login/);
    await expect(page.getByRole('heading', { name: 'Paid Invoice' , exact: true})).toBeVisible();
  });

  baseTest('TC-01b: Verify invalid login', async ({ page }) => {
    await loginPage.login('wrong@test.com', 'WrongPass123!');
    await expect(page).toHaveURL(/login/);
    await loginPage.expectErrorVisible();
  });

  baseTest('TC-01c: Verify empty login validation', async () => {
    await loginPage.loginButton.click();
    await expect(loginPage.page.locator('.ant-form-item-explain-error').first()).toBeVisible();
  });
});
  // TC-02 DASHBOARD MODULE

  test('TC-02 Dashboard',async ({ authPage }) => {
    const dashboard = new DashboardPage(authPage);
    await dashboard.openDashboard();
    await dashboard.verifySummaryCards();
    await dashboard.verifyInvoiceSummary();
    await dashboard.verifyCustomerSummary();
    await dashboard.verifyRecentSections();
  });

   // TC-03 LANGUAGE MODULE

  test('TC-03 Language',async ({ authPage }) => {
    const language = new LanguagePage(authPage);
    // English -> Chinese
    await language.changeLanguage("Chinese");
    await language.verifyChinese();
    // Chinese -> English
    await language.changeLanguage("English");
    await language.verifyEnglish();
  })

   test('End-to-End Regression', async ({ authPage }) => {

  // dashboard Invoice amount
    const dashboard = new DashboardPage(authPage);
    await dashboard.openDashboard();
    const paidBefore = await dashboard.getPaidInvoiceAmount();
    const unpaidBefore = await dashboard.getUnpaidInvoiceAmount();

  // TC-04 COMPANY MODULE

    const company = new CompanyPage(authPage);
    await company.openCompanyPage();
    await company.clickAddNewCompany();
    companyName = await company.createCompany();
    await company.searchCompany(companyName);

   // TC-05 PEOPLE MODULE

    const people = new PeoplePage(authPage);
    await people.openPeoplePage();
    await people.clickAddNewPerson();
    personName = await people.createPerson();
    await people.searchPerson(personName);

   // TC-06 CUSTOMER MODULE

    const customer = new CustomerPage(authPage);
    await customer.openCustomers();
    await customer.clickAddCustomer();
    await customer.addPersonAsCustomer(personName);
    await customer.verifyCustomer(personName);

  // TC-07 PRODUCT CATEGORY MODULE

    const category = new ProductCategoryPage(authPage);
    await category.openProductCategory();
    await category.clickAddProductCategory();
    categoryName = await category.createProductCategory();

  // TC-08 PRODUCT MODULE

    const product = new ProductPage(authPage);
    await product.openProducts();
    await product.clickAddProduct();
    productName = await product.createProduct(categoryName);

  // TC-09a INVOICE MODULE - COMPANY

    const invoice = new InvoicePage(authPage);
    await invoice.openInvoice();
    await invoice.clickAddInvoice();
    await invoice.createInvoice(companyName);
    await invoice.verifyInvoice(companyName); 

  // TC-09b INVOICE MODULE - PERSON

    await invoice.clickAddInvoice();
    await invoice.createInvoice(personName);
    await invoice.verifyInvoice(personName); 

  // TC-10 RECORD PAYMENT MODULE

    await invoice.recordPayment(personName, '1000');
    const payment = new PaymentPage(authPage);
    await payment.openPayments();
    await payment.verifyPayment(personName, '1000');


  //TC-12 DASHBOARD UPDATE - verify dashboard got updated
  
    await dashboard.verifyDashboardUpdated(paidBefore,unpaidBefore);

});


