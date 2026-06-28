import { Page, expect } from '@playwright/test';

export class CompanyPage {
    constructor(private page: Page) {}

    async openCompanyPage() {
        await this.page.goto('/company');
        await expect(this.page.getByText('Company List')).toBeVisible();
    }

    async clickAddNewCompany() {
        await this.page.getByRole('button', { name: 'Add New Company' }).click();
        await expect(this.page.locator('.collapseBoxHeader', { hasText: 'Add New Company' })).toBeVisible();
    }

    async createCompany() {
        const companyName = `PW Company ${Date.now()}`;
        await this.page.locator('#name').fill(companyName);
        await this.page.locator('#country').click();
        await this.page.locator('#country').pressSequentially('India');
        await this.page.keyboard.press('Enter');
        await this.page.locator('#email').fill(`company${Date.now()}@gmail.com`);
        await this.page.getByRole('button', { name: 'Submit' }).click();
        return companyName;
    }

    async searchCompany(companyName: string) {
        await this.page.getByPlaceholder('search').fill(companyName);
        await expect(this.page.getByRole('cell', { name: companyName })).toBeVisible();
        await this.page.locator('.ant-drawer-close').click();
    }
}