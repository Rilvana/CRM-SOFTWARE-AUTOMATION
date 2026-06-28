import { expect, Page } from '@playwright/test';

export class PaymentPage {

    constructor(private page: Page) {}

    async openPayments() {
        await this.page.getByRole('link', { name: 'Payments' }).click();
        await expect(this.page.getByText('Payment List')).toBeVisible();
        await this.page.waitForLoadState('networkidle');
        await this.page.locator('.ant-spin-spinning').waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
    }

    async verifyPayment(customerName: string,amount: string,paymentMode: string = 'Default Payment') {
        await this.page.locator('.ant-spin-spinning').waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
        await this.page.waitForTimeout(1000);
        const row = this.page.locator('tbody tr:not(.ant-table-placeholder):not(.ant-table-measure-row)').filter({ hasText: customerName }).first();
        await expect(row).toBeVisible({ timeout: 15000 });
        await expect(row).toContainText(customerName);
        await expect(row).toContainText(`$ ${Number(amount).toLocaleString()}.00`);
        await expect(row).toContainText(paymentMode);
    }
}