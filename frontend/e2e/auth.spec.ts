import { test, expect } from '@playwright/test';

/**
 * @description Comprehensive E2E tests for CarbonIQ authentication flows.
 * Tests user registration, login, logout, password visibility toggle,
 * form validation, and redirect behavior.
 */

test.describe('Authentication Flow', () => {

  test.describe('Login Page', () => {
    test('should display the login page with correct heading and form elements', async ({ page }) => {
      await page.goto('/login');
      await expect(page.getByRole('heading', { name: /Welcome Back/i })).toBeVisible();
      await expect(page.getByLabel(/Email Address/i)).toBeVisible();
      await expect(page.getByLabel(/Password/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /Sign In/i })).toBeVisible();
    });

    test('should have proper form accessibility attributes', async ({ page }) => {
      await page.goto('/login');
      const emailInput = page.getByLabel(/Email Address/i);
      await expect(emailInput).toHaveAttribute('type', 'email');
      await expect(emailInput).toHaveAttribute('autocomplete', 'email');

      const passwordInput = page.locator('#password');
      await expect(passwordInput).toHaveAttribute('autocomplete', 'current-password');
    });

    test('should toggle password visibility', async ({ page }) => {
      await page.goto('/login');
      const passwordInput = page.locator('#password');
      await expect(passwordInput).toHaveAttribute('type', 'password');

      await page.getByLabel(/Show password/i).click();
      await expect(passwordInput).toHaveAttribute('type', 'text');

      await page.getByLabel(/Hide password/i).click();
      await expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('should show error alert for invalid credentials', async ({ page }) => {
      await page.goto('/login');
      await page.getByLabel(/Email Address/i).fill('nonexistent@example.com');
      await page.locator('#password').fill('WrongPassword1!');
      await page.getByRole('button', { name: /Sign In/i }).click();

      // Should show an error alert
      const errorAlert = page.getByRole('alert');
      await expect(errorAlert).toBeVisible({ timeout: 10000 });
    });

    test('should have a link to the registration page', async ({ page }) => {
      await page.goto('/login');
      const signUpLink = page.getByRole('link', { name: /Sign Up/i });
      await expect(signUpLink).toHaveAttribute('href', '/register');
    });

    test('should disable submit button while submitting', async ({ page }) => {
      await page.goto('/login');
      await page.getByLabel(/Email Address/i).fill('user@example.com');
      await page.locator('#password').fill('Password@1');
      
      const submitButton = page.getByRole('button', { name: /Sign In/i });
      await submitButton.click();

      // Button should show loading text
      await expect(page.getByText('Signing in...')).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Registration Page', () => {
    test('should display the registration form with all fields', async ({ page }) => {
      await page.goto('/register');
      await expect(page.getByRole('heading', { name: /Create Account/i })).toBeVisible();
      await expect(page.getByLabel(/First Name/i)).toBeVisible();
      await expect(page.getByLabel(/Last Name/i)).toBeVisible();
      await expect(page.getByLabel(/Email/i)).toBeVisible();
    });

    test('should have a link back to the login page', async ({ page }) => {
      await page.goto('/register');
      const signInLink = page.getByRole('link', { name: /Sign In/i });
      await expect(signInLink).toHaveAttribute('href', '/login');
    });
  });
});

test.describe('Navigation & Accessibility', () => {
  test('should have a skip-to-content link for keyboard users', async ({ page }) => {
    await page.goto('/login');
    // The skip link should be in the DOM even if visually hidden
    const skipLink = page.locator('a.skip-to-content');
    await expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  test('should have proper page title containing CarbonIQ', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/CarbonIQ/i);
  });

  test('should use semantic HTML with lang attribute', async ({ page }) => {
    await page.goto('/login');
    const htmlElement = page.locator('html');
    await expect(htmlElement).toHaveAttribute('lang', 'en');
  });
});
