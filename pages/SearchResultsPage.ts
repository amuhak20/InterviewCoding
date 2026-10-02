import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchResultsPage extends BasePage {
  private readonly CITY_NAME_HEADING = '[class*="city-name"]';

  constructor(page: Page) {
    super(page);
  }

  async isOnResultsPage(expectedCity: string): Promise<boolean> {
    try {
      const heading = await this.getText(this.CITY_NAME_HEADING);
      return heading?.includes(expectedCity) || false;
    } catch {
      return false;
    }
  }

  async validateRedirection(expectedCity: string) {
    const url = await this.getUrl();
    expect(url).toContain('openweathermap.org');

    const isOnResults = await this.isOnResultsPage(expectedCity);
    expect(isOnResults).toBe(true);
  }

  async getEveningTemperature(daysLater: number): Promise<string | null> {
    try {
      await this.page.waitForLoadState('networkidle');

      let forecastItems = await this.page.locator('[class*="forecast-item"]').all();

      if (forecastItems.length === 0) {
        forecastItems = await this.page.locator('[class*="weather-item"]').all();
      }

      if (forecastItems.length === 0) {
        forecastItems = await this.page.locator('div[class*="item"]').all();
      }

      console.log(`Found ${forecastItems.length} forecast items`);

      if (forecastItems.length === 0) {
        console.log('No forecast items found with any selector');
        return null;
      }

      const orderedDailyTemperatures: string[] = [];
      const targetIndex = Math.max(0, Number(daysLater) || 0);

      for (const item of forecastItems) {
        const text = await item.textContent();
        if (!text) continue;

        const dayMatches = [...text.matchAll(/(?:Today|Sun|Mon|Tue|Wed|Thu|Fri|Sat)[^0-9-]*(-?\d+)\s*°/g)];
        for (const match of dayMatches) {
          orderedDailyTemperatures.push(`${match[1]}°`);
        }
      }

      if (orderedDailyTemperatures.length > 0) {
        const temperature = orderedDailyTemperatures[targetIndex] ?? orderedDailyTemperatures[orderedDailyTemperatures.length - 1];
        if (temperature) {
          console.log(`Found ${daysLater}-day forecast temperature: ${temperature}`);
          return temperature;
        }
      }

      for (const item of forecastItems) {
        const text = await item.textContent();
        console.log(`Checking item: ${text?.substring(0, 50)}`);

        if (text) {
          if (text.includes('20:') || text.includes('21:') || text.includes('22:') || text.includes('23:') || text.includes('PM')) {
            let temperatureMatch = text.match(/[-]?\d+°/);
            if (!temperatureMatch) {
              temperatureMatch = text.match(/[-]?\d+\s*°C/);
            }
            if (!temperatureMatch) {
              temperatureMatch = text.match(/[-]?\d+\s*°F/);
            }
            if (!temperatureMatch) {
              temperatureMatch = text.match(/[-]?\d+(?=\D|$)/);
            }

            if (temperatureMatch) {
              console.log(`Found evening temperature: ${temperatureMatch[0]}`);
              return temperatureMatch[0];
            }
          }
        }
      }

      console.log('No evening temperature found in forecast items');
      return null;
    } catch (error) {
      console.error('Error getting evening temperature:', error);
      return null;
    }
  }

  async validateEveningTemperatureExists(daysLater: number): Promise<boolean> {
    const temperature = await this.getEveningTemperature(daysLater);
    return temperature !== null;
  }
}
