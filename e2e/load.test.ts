import { test, expect } from '@playwright/test';
import { flowState } from './__assets__/localStorage';


test('should load nodes from local storage, fill the input correctly, and navigate to the map screen', async ({ page }) => {
  // Navigate to the app
  await page.goto('http://localhost:5173');

  // Set local storage
  await page.evaluate((data) => {
    localStorage.setItem('flowState', JSON.stringify(data));
  }, flowState);

  // Reload the page to ensure local storage is loaded
  await page.reload();

  // Click the button to load the state
  await page.click('[data-testid="load-state-button"]');

  // Verify that the nodes are loaded
  await page.waitForSelector('[data-testid="node-handler-source"]');
  await page.waitForSelector('[data-testid="node-handler-target"]');

  // Verify that the input is correctly filled
  const inputValue = await page.$eval('[data-testid="node-input"]', (input) => (input as HTMLInputElement).value);
  expect(inputValue).toBe('https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/geojson/vancouver-blocks.json');

  // Search for the text in the toast
  await page.waitForSelector('[role="status"]');
  const toastText = await page.$eval('[role="status"]', (toast) => toast.textContent);
  expect(toastText).toContain('successfully');

  // Wait 3 seconds to fetch the GeoJSON
  await page.waitForTimeout(3000);

  // Navigate to the map screen
  await page.click('[data-testid="map-icon"]');

  // Ensure the flow icon is visible, indicating the map screen is loaded
  await page.waitForSelector('[data-testid="flow-icon"]');

  await page.waitForSelector('[data-testid="deckgl-map"]');
});