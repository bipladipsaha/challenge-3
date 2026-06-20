import { test, expect } from '@playwright/test';

test.describe('CarbonIQ Authentication Flow', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/CarbonIQ/);
    await expect(page.getByRole('heading', { name: /Welcome Back/i })).toBeVisible();
  });

  test('should show validation errors on empty submit', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /Sign In/i }).click();
    await expect(page.getByText(/Invalid email/i)).toBeVisible();
  });
});

test.describe('CarbonIQ Dashboard Navigation', () => {
  // Note: This requires a mocked auth state or a test user
  test.skip('should navigate through dashboard links', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check Sidebar
    const sidebar = page.getByRole('complementary', { name: /Sidebar navigation/i });
    await expect(sidebar).toBeVisible();

    // Navigate to Calculator
    await page.getByRole('link', { name: /Calculator/i }).click();
    await expect(page).toHaveURL(/.*\/calculator/);
  });
});
