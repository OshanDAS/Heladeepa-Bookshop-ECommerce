import { expect, test } from "@playwright/test";

test.describe("Public routes batch 2", () => {
  test("register page password field has masked placeholder", async ({ page }) => {
    await page.goto("/register");
    await expect(page.locator('input[name="password"]')).toHaveAttribute("placeholder", "••••••••");
  });

  test("register page create-account button is enabled", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByRole("button", { name: /create an account/i })).toBeEnabled();
  });

  test("register page typing updates name value", async ({ page }) => {
    await page.goto("/register");
    const input = page.locator('input[name="name"]');
    await input.fill("QA User");
    await expect(input).toHaveValue("QA User");
  });

  test("register page typing updates email value", async ({ page }) => {
    await page.goto("/register");
    const input = page.locator('input[name="email"]');
    await input.fill("qa@example.com");
    await expect(input).toHaveValue("qa@example.com");
  });

  test("forgot-password page heading appears", async ({ page }) => {
    await page.goto("/forget-password");
    await expect(page.getByRole("heading", { name: /forgot password\?/i })).toBeVisible();
  });

  test("forgot-password page helper text appears", async ({ page }) => {
    await page.goto("/forget-password");
    await expect(page.getByText(/enter your email to receive a verification code\./i)).toBeVisible();
  });

  test("forgot-password email placeholder appears", async ({ page }) => {
    await page.goto("/forget-password");
    await expect(page.locator('input[type="email"]')).toHaveAttribute("placeholder", "name@company.com");
  });

  test("forgot-password back to login control is visible", async ({ page }) => {
    await page.goto("/forget-password");
    await expect(page.getByRole("button", { name: /back to login/i })).toBeVisible();
  });

  test("forgot-password send otp button is enabled", async ({ page }) => {
    await page.goto("/forget-password");
    await expect(page.getByRole("button", { name: /send otp/i })).toBeEnabled();
  });

  test("login -> forgot-password route transition works", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /forgot password\?/i }).click();
    await expect(page).toHaveURL(/\/forget-password$/);
  });
});
