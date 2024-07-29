import { test, expect } from '@playwright/test';

test('should open drawer, drag a source node and a layer node, join together, fill the input and navigate to the map', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Open the drawer
  await page.click('[data-testid="menu-icon"]');
  await page.waitForSelector('[data-testid="sidebar-item-sourceNode"]');

  // Drag and drop the source node
  const sourceNode = await page.locator('[data-testid="sidebar-item-sourceNode"]');
  await sourceNode.dragTo(page.locator('[data-testid="flow-main"]'));

  // Drag and drop the layer node
  const layerNode = await page.locator('[data-testid="sidebar-item-layerNode"]');
  await layerNode.dragTo(page.locator('[data-testid="flow-main"]'));

  // Wait for nodes to be rendered
  await page.waitForSelector('[data-testid="node-handler-source"]');
  await page.waitForSelector('[data-testid="node-handler-target"]');

  // Get the position of the source and target handles
  const sourceHandle = await page.locator('[data-testid="node-handler-source"]');
  const targetHandle = await page.locator('[data-testid="node-handler-target"]');

  // Drag from source handle to target handle
  const sourceHandleBox = await sourceHandle.boundingBox();
  const targetHandleBox = await targetHandle.boundingBox();

  if (sourceHandleBox && targetHandleBox) {
    await page.mouse.move(
      sourceHandleBox.x + sourceHandleBox.width / 2,
      sourceHandleBox.y + sourceHandleBox.height / 2
    );
    await page.mouse.down();
    await page.mouse.move(
      targetHandleBox.x + targetHandleBox.width / 2,
      targetHandleBox.y + targetHandleBox.height / 2
    );
    await page.mouse.up();
  }

  // Fill the input
  const input = await page.waitForSelector('[data-testid="node-input"]');
  await input.fill('https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/geojson/vancouver-blocks.json');

  // Navigate to the map
  await page.click('[data-testid="map-icon"]');

  // Ensure the flow icon is visible
  await page.waitForSelector('[data-testid="flow-icon"]');

  await page.waitForSelector('[data-testid="deckgl-map"]');

});