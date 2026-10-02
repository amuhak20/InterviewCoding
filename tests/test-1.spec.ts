import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {

  await page.goto('https://openweathermap.org/');
  await page.getByRole('textbox', { name: 'Search City' }).click();
  await page.getByRole('textbox', { name: 'Search City' }).fill('Dubai');
  await page.getByRole('button', { name: 'Dubai, Dubai 25.26,' }).click();
  await page.getByRole('button', { name: 'Sun 33° clear sky' }).click();
});