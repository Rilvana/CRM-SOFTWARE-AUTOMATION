import { expect, Page } from "@playwright/test";

export class InvoicePage {

    constructor(private page: Page) {}

    async openInvoice() {
        await this.page.getByRole('link', { name: 'Invoices', exact: true }).click();
        await expect(this.page.getByText('Invoice List')).toBeVisible();
    }

    async clickAddInvoice() {
        await this.page.getByRole('button', { name: 'Add New Invoice' }).click();
    }

    async createInvoice(customerName: string) {
        const clientInput = this.page.locator('label[for="client"]').locator('xpath=../following-sibling::div//input');
        await clientInput.click();
        await clientInput.fill(customerName);
        await this.page.waitForSelector('.ant-select-item-option-content');
        await this.page.locator('.ant-select-item-option-content').filter({ hasText: customerName }).first().click();
        await expect(this.page.getByPlaceholder('Item Name')).toBeVisible();
        await this.page.getByPlaceholder('Item Name').fill('Laptop');
        await this.page.getByPlaceholder('description Name').fill('Playwright Invoice');
        await this.page.locator('#items_0_quantity').fill('1');
        await this.page.locator('#items_0_price').fill('1000');
        const taxInput = this.page.locator('input[role="combobox"]').last();
        await taxInput.click();
        await this.page.locator('.ant-select-item-option-content').filter({ hasText: 'Tax 0%' }).click();
        await this.page.getByRole('button', { name: 'Save' }).last().click();
        await expect(this.page.getByRole('button', { name: 'Edit' })).toBeVisible();
    }

    async verifyInvoice(customerName: string) {
        await expect(this.page.getByText(`Client : ${customerName}`)).toBeVisible();
        await this.page.locator('[aria-label="back"]').click({ force: true });
        await expect(this.page.getByText('Invoice List')).toBeVisible();
        const invoiceRow = this.page.locator('tbody tr:not(.ant-table-measure-row)').filter({ hasText: customerName });
        await expect(invoiceRow).toBeVisible();
        await expect(invoiceRow).toContainText('Draft');
        await expect(invoiceRow).toContainText('Unpaid');
    }

    async recordPayment(customerName: string, amount: string) {
        const invoiceRow = this.page.locator('tbody tr:not(.ant-table-measure-row)').filter({ hasText: customerName });
        await expect(invoiceRow).toBeVisible();
        await invoiceRow.locator('.ant-dropdown-trigger').click();
        await this.page.getByRole('menuitem', { name: 'Record Payment' }).click();
        await expect(this.page.getByText('Record Payment for Invoice')).toBeVisible();
        await this.page.locator('#amount').fill(amount);
        const paymentMode = this.page.locator('input[role="combobox"]').last();
        await paymentMode.click();
        await this.page.locator('.ant-select-item-option-content').filter({ hasText: 'Default Payment' }).click();
        await this.page.locator('#ref').fill('PWREF001');
        await this.page.locator('#description').fill('Playwright Payment');
        await this.page.getByRole('button', { name: 'Record Payment' }).click();
        await expect(this.page.getByText('Payment Invoice created successfully')).toBeVisible();
        await this.page.locator('.ant-spin-spinning').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
        await expect(this.page.getByText('Invoice List')).toBeVisible();
        const updatedRow = this.page.locator('tbody tr:not(.ant-table-measure-row)').filter({ hasText: customerName });
        await expect(updatedRow).toBeVisible();
        if (Number(amount) >= 1000) {
        await expect(updatedRow).toContainText('Paid');
        } else {
        await expect(updatedRow).toContainText('Partially');
        }
    }

}