import { Page } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  async scrollToElement(selector: string) {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  async fillInput(selector: string, text: string) {
    await this.page.fill(selector, text);
  }

  async click(selector: string) {
    await this.page.click(selector);
  }

  async waitForElement(selector: string, timeout = 5000) {
    await this.page.waitForSelector(selector, { timeout });
  }

  async getText(selector: string) {
    return await this.page.textContent(selector);
  }

  async isElementVisible(selector: string) {
    return await this.page.isVisible(selector);
  }

  async getUrl() {
    return this.page.url();
  }
}
