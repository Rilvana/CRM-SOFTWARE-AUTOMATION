import { Page, expect } from '@playwright/test';

export class CustomerPage {
  constructor(private page: Page) {}

  async openCustomers() {
    await this.page.getByRole('link', { name: 'Customers' }).click();
    await expect(this.page.getByText('Customer List')).toBeVisible();
  }

  async clickAddCustomer() {
    await this.page.getByRole('button', { name: 'Add New Customer' }).click();
    await expect(this.page.locator('.collapseBoxHeader', { hasText: 'Add New Customer' })).toBeVisible();
  }

  async addPersonAsCustomer(firstName: string) {
    await this.page.locator('#type').click();
    await this.page.locator('.ant-select-dropdown .ant-select-item-option-content').filter({ hasText: 'People' }).click();
    const peopleInput = this.page.locator('label[for="people"]').locator('xpath=../following-sibling::div//input[contains(@class,"ant-select-input")]');
    await peopleInput.fill(firstName);
    await this.page.waitForSelector('.ant-select-item-option-content');
    await this.page.locator('.ant-select-item-option-content').filter({ hasText: firstName }).first().click();
    await this.page.getByRole('button', { name: 'Submit' }).click();
  }

  async verifyCustomer(firstName: string) {
    const row = this.page.locator('tbody tr').filter({hasText: firstName});
    await expect(row).toBeVisible();
    await this.page.locator('.ant-drawer-close').click();
  }
}