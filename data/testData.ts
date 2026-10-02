export interface TestCase {
  cityName: string;
  daysLater: number;
  expectedUrl: string;
  description: string;
}

export const weatherSearchTestData: TestCase[] = [
  {
    cityName: 'Dubai',
    daysLater: 2,
    expectedUrl: 'find',
    description: 'Search for Dubai and validate evening temperature 2 days later'
  },
  {
    cityName: 'London',
    daysLater: 2,
    expectedUrl: 'find',
    description: 'Search for London and validate evening temperature 2 days later'
  },
  {
    cityName: 'New York',
    daysLater: 2,
    expectedUrl: 'find',
    description: 'Search for New York and validate evening temperature 2 days later'
  },
  {
    cityName: 'Tokyo',
    daysLater: 2,
    expectedUrl: 'find',
    description: 'Search for Tokyo and validate evening temperature 2 days later'
  },
  {
    cityName: 'Paris',
    daysLater: 2,
    expectedUrl: 'find',
    description: 'Search for Paris and validate evening temperature 2 days later'
  }
];
