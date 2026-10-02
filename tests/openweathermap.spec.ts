import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { weatherSearchTestData } from '../data/testData';

test.describe('OpenWeatherMap Search Tests - Data Driven', () => {
  let homePage: HomePage;
  let resultsPage: SearchResultsPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    resultsPage = new SearchResultsPage(page);
  });

  weatherSearchTestData.forEach((testData) => {
    test(`${testData.description}`, async ({ page }) => {
      // Step 1: Navigate to page
      await homePage.navigateToWeatherMap();
      expect(page).toHaveURL(/openweathermap.org/);

      // Step 2: Scroll down to "Search city" field
      await homePage.scrollToSearchField();

      // Step 3: Type city name in the "Search city" field
      await homePage.searchCity(testData.cityName);

      // Step 4: Wait for city in search results
      await homePage.waitForCityInResults(testData.cityName, 10000);

      // Step 5: Select city from results and validate redirection
      await homePage.selectCityFromResults(testData.cityName);

      // Step 6: Validate user is redirected to results page
      //await resultsPage.validateRedirection(testData.cityName);

      // Step 7: Validate evening temperature is set
      const temperatureExists = await resultsPage.validateEveningTemperatureExists(
        testData.daysLater
      );
      expect(temperatureExists).toBe(true);

      console.log(`Evening temperature for ${testData.cityName}: ${temperatureExists}`);
    });
  });

  test('Search Dubai - Detailed validation', async ({ page }) => {
    // Specific test case for Dubai with detailed checks
    homePage = new HomePage(page);
    resultsPage = new SearchResultsPage(page);

    await homePage.navigateToWeatherMap();
    //await homePage.scrollToSearchField();
    await homePage.searchCity('Dubai');
    await homePage.waitForCityInResults('Dubai');
    await homePage.selectCityFromResults('Dubai');

    const dailyForecastButton = page.locator('div[class*="weather-daily-tabs-container"]').locator('button').nth(2);
    const buttonText = await dailyForecastButton.textContent();

    console.log(`Weather text for 2 days later: ${buttonText}`);

    // Validate evening temperature exists
    const temperature = await resultsPage.getEveningTemperature(2);
    expect(temperature).not.toBeNull();
    console.log(`Dubai evening temperature found: ${temperature}`);
  });
});
