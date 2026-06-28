import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[type="email"], input[placeholder*="email" i], #email').first();
    this.passwordInput = page.locator('input[type="password"]').first();
    this.loginButton = page.getByRole('button', { name: "Log In"});
  }

  async goto() {
    await this.page.goto('/login');
    await this.page.waitForLoadState('networkidle');
  }

  async login(email: string, password: string) {
    await this.emailInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectRedirectToDashboard() {
    await expect(this.page).toHaveURL(/dashboard|cloud\.idurarapp\.com\/?$/, { timeout: 15000 });
  }

  async expectErrorVisible() {
    const error = this.page.locator('.ant-alert-message, .ant-form-item-explain-error').or(this.page.getByText(/invalid|incorrect|wrong|error|failed/i));
    await expect(error.first()).toBeVisible({ timeout: 8000 });
  }
}
