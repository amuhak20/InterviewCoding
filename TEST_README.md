# OpenWeatherMap Test Automation

This project implements automated tests for the OpenWeatherMap website using Playwright with Page Object Model (POM) and a data-driven testing approach.

## Project Structure

```
tests/
├── pages/
│   ├── BasePage.ts           # Base page class with common methods
│   ├── HomePage.ts           # OpenWeatherMap home page object
│   └── SearchResultsPage.ts  # Search results page object
├── data/
│   └── testData.ts           # Data-driven test cases
└── openweathermap.spec.ts    # Test specifications
```

## Technology Stack

- **Playwright**: Modern web automation framework
- **TypeScript**: Type-safe testing code
- **Page Object Model (POM)**: Maintainable test structure
- **Data-Driven Approach**: Tests parameterized with test data

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npx playwright test
```

### Run Specific Test
```bash
npx playwright test openweathermap.spec.ts
```

### Run Tests in Debug Mode
```bash
npx playwright test --debug
```

### Run Tests with UI Mode
```bash
npx playwright test --ui
```

### Run Tests in Headed Mode (See Browser)
```bash
npx playwright test --headed
```

### View Test Results
```bash
npx playwright show-report
```

## Test Scenarios

The test suite validates the following OpenWeatherMap functionality:

1. **Navigate to OpenWeatherMap** - User opens https://openweathermap.org/
2. **Scroll to Search Field** - User scrolls down to find the "Search city" field
3. **Search City** - User types a city name (e.g., "Dubai") in the search field
4. **Wait for Results** - Application displays city in search results
5. **Validate Redirection** - User is redirected to the city results page
6. **Validate Temperature Data** - Evening temperature data (after 8 PM) for 2 days later is available

## Data-Driven Testing

The test data is defined in `tests/data/testData.ts`:

```typescript
export const weatherSearchTestData: TestCase[] = [
  {
    cityName: 'Dubai',
    daysLater: 2,
    expectedUrl: 'find',
    description: 'Search for Dubai and validate evening temperature 2 days later'
  },
  // ... more test cases
];
```

Tests are executed for each data entry using `forEach()`, allowing easy addition of new cities without modifying test code.

## Page Object Model (POM) Pattern

### BasePage (`tests/pages/BasePage.ts`)
- Contains common methods used across all pages
- Methods: `goto()`, `fillInput()`, `click()`, `scrollToElement()`, `waitForElement()`, etc.

### HomePage (`tests/pages/HomePage.ts`)
- Extends BasePage
- Contains locators and methods specific to the home page
- Methods: `navigateToWeatherMap()`, `searchCity()`, `selectCityFromResults()`, etc.

### SearchResultsPage (`tests/pages/SearchResultsPage.ts`)
- Extends BasePage
- Contains locators and methods for the results page
- Methods: `validateRedirection()`, `getEveningTemperature()`, `validateEveningTemperatureExists()`, etc.

## Configuration

The Playwright configuration is defined in `playwright.config.ts`:

- **Browsers**: Chromium, Firefox, WebKit
- **Reporters**: HTML, List, JUnit XML
- **Screenshots**: Captured on failures
- **Videos**: Retained on failures
- **Traces**: Enabled on first retry

## Test Results

After running tests, results are available in:
- **HTML Report**: `playwright-report/index.html`
- **JUnit XML**: `test-results/junit.xml`

## Advantages of This Approach

1. **Maintainability**: Changes to UI selectors only need to be updated in page objects
2. **Reusability**: Common methods in BasePage can be used across multiple tests
3. **Scalability**: Adding new test cases only requires adding data to testData.ts
4. **Readability**: Test code reads like business logic
5. **Efficiency**: Parallel test execution across multiple browsers

## Troubleshooting

### Tests timing out
- Increase timeout in `waitForElement()` calls
- Check network connectivity to openweathermap.org
- Verify selectors match current page structure

### Selectors not found
- Use Playwright Inspector: `npx playwright test --debug`
- Verify selectors in browser DevTools
- Update locators in page object files

### Network issues
- Add `await page.waitForLoadState('networkidle')` for better stability
- Increase default timeout in playwright.config.ts
