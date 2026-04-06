import { expect, test } from "@playwright/test";

test.describe("Public routes batch 1", () => {
  test("login page shows main heading", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /log in to your account/i })).toBeVisible();
  });

  test("login page email input has expected placeholder", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('input[type="email"]')).toHaveAttribute("placeholder", "name@company.com");
  });

  test("login page password input has masked placeholder", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('input[type="password"]')).toHaveAttribute("placeholder", "••••••••");
  });

  test("login page submit button is enabled initially", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: /log in/i })).toBeEnabled();
  });

  test("login page forgot password button is visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: /forgot password\?/i })).toBeVisible();
  });

  test("login page sign-up button is visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: /don't have an account\? sign up/i })).toBeVisible();
  });

  test("register page shows expected heading", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByRole("heading", { name: /create an account/i })).toBeVisible();
  });

  test("register page name field placeholder is shown", async ({ page }) => {
    await page.goto("/register");
    await expect(page.locator('input[name="name"]')).toHaveAttribute("placeholder", "John Doe");
  });

  test("register page email field placeholder is shown", async ({ page }) => {
    await page.goto("/register");
    await expect(page.locator('input[name="email"]')).toHaveAttribute("placeholder", "name@company.com");
  });

  test("register page login-here link exists", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByRole("link", { name: /login here/i })).toBeVisible();
  });
});
