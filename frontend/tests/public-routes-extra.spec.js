import { expect, test } from "@playwright/test";

test.describe("Additional public route coverage", () => {
  test("shows registration form and can navigate back to login", async ({ page }) => {
    await page.goto("/register");

    await expect(page.getByRole("heading", { name: /create an account/i })).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();

    await page.getByRole("link", { name: /login here/i }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("heading", { name: /log in to your account/i })).toBeVisible();
  });

  test("shows forgot password page on direct navigation", async ({ page }) => {
    await page.goto("/forget-password");

    await expect(page.getByRole("heading", { name: /forgot password\?/i })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.getByRole("button", { name: /send otp/i })).toBeVisible();

    await page.getByRole("button", { name: /back to login/i }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("shows invalid token state on verify route without token", async ({ page }) => {
    await page.goto("/verify");

    await expect(page.getByText(/invalid verification token\./i)).toBeVisible();
    await expect(page.getByRole("button", { name: /resend verification email/i })).toBeVisible();
  });

  test("renders 403 page and go to login action works", async ({ page }) => {
    await page.goto("/403");

    await expect(page.getByRole("heading", { name: /403 - access denied/i })).toBeVisible();
    await page.getByRole("link", { name: /go to login/i }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("heading", { name: /log in to your account/i })).toBeVisible();
  });
});
