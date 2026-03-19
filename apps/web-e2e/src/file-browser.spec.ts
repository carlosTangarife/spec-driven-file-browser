import { test, expect } from '@playwright/test';

test.describe('File browser', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders main sections and preview placeholder before a file is selected', async ({
    page,
  }, testInfo) => {
    const isMobileProject = testInfo.project.name === 'Mobile Chrome';
    await expect(
      page.getByRole('heading', { name: 'File browser' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Tree' })).toBeVisible();
    if (!isMobileProject) {
      await expect(page.getByRole('heading', { name: 'Preview' })).toBeVisible();
      await expect(
        page.getByText('Select a file in the tree to preview its contents.'),
      ).toBeVisible();
    }
    await expect(page.getByRole('textbox', { name: 'Path' })).toBeVisible();
  });

  test('loads the tree from the API and lists a root file', async ({ page }) => {
    await expect(page.getByRole('tree')).toBeVisible({ timeout: 20_000 });
    await expect(
      page.getByRole('button', { name: /package\.json/ }),
    ).toBeVisible({ timeout: 20_000 });
  });

  test('shows text preview after selecting a root file', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: /package\.json/ }),
    ).toBeVisible({ timeout: 20_000 });

    await page.getByRole('button', { name: /package\.json/ }).click();

    await expect(page.locator('pre')).toContainText('"name"');
  });

  test('expands a directory and shows nested folders', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: /📁 apps/ }),
    ).toBeVisible({ timeout: 20_000 });

    await page.getByRole('button', { name: /📁 apps/ }).click();

    await expect(
      page.getByRole('button', { name: '📁 web', exact: true }),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('double-clicking a folder sets the path field with a trailing slash', async ({
    page,
  }) => {
    await expect(
      page.getByRole('button', { name: /📁 apps/ }),
    ).toBeVisible({ timeout: 20_000 });

    await page.getByRole('button', { name: /📁 apps/ }).dblclick();

    await expect(page.getByRole('textbox', { name: 'Path' })).toHaveValue(
      'apps/',
    );
  });

  test('path input + Enter navigates the tree; selecting a nested file previews it', async ({
    page,
  }) => {
    const pathInput = page.getByRole('textbox', { name: 'Path' });
    await pathInput.fill('apps/web');
    await pathInput.press('Enter');

    await expect(
      page.getByRole('button', { name: /project\.json/ }),
    ).toBeVisible({ timeout: 20_000 });

    await page.getByRole('button', { name: /project\.json/ }).click();

    await expect(page.locator('pre')).toContainText('"name"');
    await expect(page.locator('pre')).toContainText('"web"');
  });

  test('mobile: file preview opens in a dialog with overlay and closes', async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'Mobile Chrome',
      'narrow viewports use the modal preview flow',
    );

    await expect(
      page.getByRole('button', { name: /package\.json/ }),
    ).toBeVisible({ timeout: 20_000 });

    await page.getByRole('button', { name: /package\.json/ }).click();

    const dialog = page.getByRole('dialog', {
      name: /Preview: package\.json/,
    });
    await expect(dialog).toBeVisible({ timeout: 15_000 });
    await expect(dialog.locator('pre')).toContainText('"name"');

    await page.getByRole('button', { name: 'Close preview' }).click();
    await expect(dialog).toBeHidden();
  });
});
