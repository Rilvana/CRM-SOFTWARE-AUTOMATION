import { expect, Page } from '@playwright/test';

export class ProductPage {

    constructor(private page: Page) {}

    async openProducts() {
        await this.page.getByRole('link', { name: 'Products', exact: true }).click();
        await expect(this.page.getByText('Product List')).toBeVisible();
    }

    async clickAddProduct() {
        await this.page.getByRole('button', { name: 'Add New Product' }).click();
        await expect(this.page.locator('.collapseBoxHeader', { hasText: 'Add New Product' })).toBeVisible();
    }

    async createProduct(categoryName: string) {
        const productName = `PW Product ${Date.now()}`;
        await this.page.locator('#name').fill(productName);
        const category = this.page.locator('label[for="productCategory"]').locator('xpath=../following-sibling::div');
        await category.click();
        await this.page.locator('.ant-select-dropdown').waitFor();
        const option = this.page.getByText(categoryName, { exact: true });
        await expect(option).toBeVisible();
        await option.click({ force: true });
        await this.page.locator('#price').fill('500');
        await this.page.locator('#description').fill('Playwright Automation Product');
        await this.page.locator('#file').setInputFiles('test-data/productPW.jpg');
        await this.page.getByRole('button', { name: 'Submit' }).click();
        await this.page.locator('button.ant-drawer-close').evaluate((el: HTMLButtonElement) => {el.click();})
        return productName;
    }

    async searchProduct(productName: string) {
        await this.page.getByPlaceholder('search').fill(productName);
        await expect(this.page.locator('tbody')).toContainText(productName);
        await this.page.locator('button.ant-drawer-close').evaluate((el: HTMLButtonElement) => {el.click();});
    }

}