import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private getSearchCityInput() {
    return this.page.getByRole('textbox', { name: 'Search City' });
  }

  private getSearchResultButton(cityName: string) {
    return this.page.getByRole('button').filter({ hasText: cityName }).first();
  }

  async navigateToWeatherMap() {
    await this.goto('https://openweathermap.org/');
    await this.page.waitForLoadState('networkidle');
  }

  async scrollToSearchField() {
    for (let i = 0; i < 5; i++) {
      try {
        await this.getSearchCityInput().scrollIntoViewIfNeeded();
        await this.getSearchCityInput().click();
        return;
      } catch {
        await this.page.evaluate(() => window.scrollBy(0, 600));
        await this.page.waitForTimeout(500);
      }
    }
    throw new Error('Search field not found after scrolling');
  }

  async searchCity(cityName: string) {
    await this.getSearchCityInput().click();
    await this.getSearchCityInput().fill(cityName);
    await this.getSearchResultButton(cityName).first().waitFor({ state: 'visible', timeout: 5000 });
  }

  async selectCityFromResults(cityName: string) {
    const resultButton = this.getSearchResultButton(cityName);
    await resultButton.waitFor({ state: 'visible' });
    await resultButton.click();
    await this.page.waitForNavigation({ waitUntil: 'networkidle' });
  }

  async waitForCityInResults(cityName: string, timeout = 10000) {
    await this.getSearchResultButton(cityName).waitFor({ state: 'visible', timeout });
  }
}
