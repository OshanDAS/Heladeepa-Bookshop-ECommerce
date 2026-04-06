import { expect, test } from "@playwright/test";

test.describe("Public authentication routes", () => {
  test("shows the login form on home route", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /log in to your account/i })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole("button", { name: /log in/i })).toBeVisible();
  });

  test("navigates from login to registration page", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: /don't have an account\? sign up/i }).click();
    await expect(page).toHaveURL(/\/register$/);
    await expect(page.getByRole("heading", { name: /create an account/i })).toBeVisible();
  });

  test("navigates from forgot-password flow back to login", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: /forgot password\?/i }).click();
    await expect(page).toHaveURL(/\/forget-password$/);
    await expect(page.getByRole("heading", { name: /forgot password\?/i })).toBeVisible();

    await page.getByRole("button", { name: /back to login/i }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("heading", { name: /log in to your account/i })).toBeVisible();
  });
});
