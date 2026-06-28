import { expect, Page } from '@playwright/test';

export class ProductCategoryPage {
  constructor(private page: Page) {}

  async openProductCategory() {
    await this.page.getByRole('link', { name: 'Products Category' }).click();
    await expect(this.page.getByText('Product Category List')).toBeVisible();
  }

  async clickAddProductCategory() {
    await this.page.getByRole('button', {name: 'Add New Product Category'}).click();
  }

  async createProductCategory() {
    const categoryName = `PW Category ${Date.now()}`;
    await this.page.locator('#name').fill(categoryName);
    await this.page.locator('#description').fill('Playwright Automation Category');
    await this.page.locator('#color').click();
    await this.page.locator('.ant-select-item-option-content').first().click();
    await this.page.getByRole('button', {name: 'Submit'}).click();
    await expect(this.page.locator('.ant-drawer-body')).toContainText(categoryName);
    await this.page.locator('button.ant-drawer-close').evaluate((el: HTMLButtonElement) => {el.click();});
    return categoryName;
  }

  async searchProductCategory(categoryName: string) {
    await expect(this.page.locator('.ant-drawer-body')).toContainText(categoryName);
    await this.page.locator('button.ant-drawer-close').evaluate((el: HTMLButtonElement) => {el.click();});
  }
}
