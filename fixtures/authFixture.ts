import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

type AuthFixture = {
  authPage: Page;
};

export const test = base.extend<AuthFixture>({
  authPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      process.env.USER_EMAIL!,
      process.env.USER_PASSWORD!
    );
    await loginPage.expectRedirectToDashboard();
    await use(page);
  },
});

export { expect } from '@playwright/test';
