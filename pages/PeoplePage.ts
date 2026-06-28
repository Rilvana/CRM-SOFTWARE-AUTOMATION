import { expect, Page } from '@playwright/test';

export class PeoplePage {

    constructor(private page: Page) {}

    async openPeoplePage() {
        await this.page.getByRole('link', { name: 'People' }).click();
        await expect(this.page.getByText('People List')).toBeVisible();
    }

    async clickAddNewPerson() {
        await this.page.getByRole('button', { name: 'Add New Person' }).click();
        await expect(this.page.locator('.collapseBoxHeader', { hasText: 'Add New Person' })).toBeVisible();
    }

    async createPerson() {
        const firstName = `PW${Date.now()}`;
        const lastName = 'Testing';
        await this.page.locator('#firstname').fill(firstName);
        await this.page.locator('#lastname').fill(lastName);
        await this.page.locator('#email').fill(`person${Date.now()}@gmail.com`);
        await this.page.getByRole('button', { name: 'Submit' }).click();
        return firstName;
    }

    async searchPerson(firstName: string) {
        await this.page.getByPlaceholder('search').fill(firstName);
        const row = this.page.locator('tbody tr').filter({hasText: firstName});
        await expect(row).toBeVisible();
        await this.page.locator('.ant-drawer-close').click();
    }
}