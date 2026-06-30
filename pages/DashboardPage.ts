import { expect, Page } from "@playwright/test";

export class DashboardPage {

    constructor(private page: Page) {}

    async openDashboard() {
        await this.page.getByRole('link', { name: 'Dashboard' }).click();
        await expect(this.page.getByRole('heading', { name: 'Paid Invoice', exact: true })).toBeVisible();
    }

    // TC-02a
    async verifySummaryCards() {
        await expect(this.page.getByRole('heading', { name: 'Paid Invoice', exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: 'Unpaid Invoice', exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: 'Quote', exact: true })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: 'Offer', exact: true })).toBeVisible();
        const fromBeginning = this.page.getByRole('button', { name: /From Begin/i });
        await expect(fromBeginning).toHaveCount(4);
    }

    // Capture Paid Invoice amount
    async getPaidInvoiceAmount(): Promise<number> {
        const amount = this.page.getByRole('heading', { name: 'Paid Invoice', exact: true }).locator('..').locator('.ant-tag');
        await expect(amount).not.toHaveText('', { timeout: 30000 });
        await expect(amount).toContainText('$', { timeout: 30000 });
        const text = await amount.textContent();
        return Number(text!.replace('$', '').replace(/,/g, '').trim());
    }

    async getUnpaidInvoiceAmount(): Promise<number> {
    const text = await this.page.getByRole('heading', { name: 'Unpaid Invoice', exact: true }).locator('..').locator('.ant-tag').textContent();
    return Number(text!.replace('$', '').replace(/,/g, '').trim());
    }



    // TC-02b
    async verifyInvoiceSummary() {
        await expect(this.page.getByRole('heading', { name: 'Invoices', exact: true })).toBeVisible();
        await expect(this.page.getByText('Draft').first()).toBeVisible();
        await expect(this.page.getByText('Pending').first()).toBeVisible();
        await expect(this.page.getByText('Sent').first()).toBeVisible();
        await expect(this.page.getByText('Paid').first()).toBeVisible();
        await expect(this.page.getByText('Unpaid').first()).toBeVisible();
        await expect(this.page.getByText('Partially').first()).toBeVisible();
        await expect(this.page.getByRole('heading', { name: 'Quotes For Customers' })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: 'Quotes For Leads' })).toBeVisible();
    }

    // TC-02c
    async verifyCustomerSummary() {
        const customerCard = this.page.locator('.whiteBox').filter({has: this.page.getByRole('heading', {name: 'Customers', exact: true})});
        await expect(customerCard.getByText('Last Month')).toBeVisible();
        await expect(customerCard.getByText('Total')).toBeVisible();
        await expect(customerCard.getByRole('progressbar')).toBeVisible();
    }

    // TC-02d
    async verifyRecentSections() {
        await expect(this.page.getByRole('heading', { name: 'Recent Invoices' })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: 'Recent Quotes' })).toBeVisible();
        const tableRows = this.page.locator('tbody tr:not(.ant-table-placeholder):not(.ant-table-measure-row)');
        if (await tableRows.count()) {
            await expect(tableRows.first()).toBeVisible();
        }
    }

    // DASHBOARD UPDATE VALIDATION
    async verifyDashboardUpdated(paidBefore: number, unpaidBefore: number) {
        await this.openDashboard();
        const paidAfter = await this.getPaidInvoiceAmount();
        const unpaidAfter = await this.getUnpaidInvoiceAmount();
    
        console.log(`Paid Before : ${paidBefore}`);
        console.log(`Paid After : ${paidAfter}`);
        console.log(`Unpaid Before : ${unpaidBefore}`);
        console.log(`Unpaid After : ${unpaidAfter}`);
     
        expect(paidAfter).toBeGreaterThan(paidBefore);
        expect(unpaidAfter).toBeGreaterThan(unpaidBefore);

         console.log("Dashboard validation completed");
       
    }
}