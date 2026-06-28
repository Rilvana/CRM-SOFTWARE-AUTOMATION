import { expect, Page } from '@playwright/test';

export class LanguagePage {

    constructor(private page: Page) {}

    async changeLanguage(language: string) {
        await this.page.locator('[role="combobox"]').nth(2).click();
        await this.page.locator('.ant-select-item-option').filter({ hasText: language }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async verifyLanguage(language: string) {
        switch (language) {
            case 'English':
                await expect(this.page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
                break;
            case 'French':
                await expect(this.page.getByText('Tableau de bord')).toBeVisible();
                break;
            case 'Spanish':
                await expect(this.page.getByText('Panel')).toBeVisible();
                break;
            case 'Chinese':
                await expect(this.page.getByText('仪表板')).toBeVisible();
                break;
        }
    }

     async verifyChinese() {
        await expect(this.page.getByRole('link', { name: '仪表盘', exact: true })).toBeVisible();
        await expect(this.page.getByRole('link', { name: '发票' , exact: true})).toBeVisible();
        await expect(this.page.getByRole('link', { name: '付款' , exact: true})).toBeVisible();
        await expect(this.page.getByRole('link', { name: '客户' ,exact: true})).toBeVisible();
        await expect(this.page.getByRole('link', { name: '产品' , exact: true})).toBeVisible();
    }

    async verifyEnglish() {
        await expect(this.page.getByRole('link', { name: 'Dashboard', exact: true })).toBeVisible();
        await expect(this.page.getByRole('link', { name: 'Invoices', exact: true })).toBeVisible();
        await expect(this.page.getByRole('link', { name: 'Payments' , exact: true })).toBeVisible();
        await expect(this.page.getByRole('link', { name: 'Customers' , exact: true})).toBeVisible();
        await expect(this.page.getByRole('link', { name: 'Products' , exact: true})).toBeVisible();
    }
}