import { expect, test } from "@playwright/test";

test.describe("More public route validations", () => {
  test("login page has required email and password fields", async ({ page }) => {
    await page.goto("/");

    const email = page.locator('input[type="email"]');
    const password = page.locator('input[type="password"]');

    await expect(email).toBeVisible();
    await expect(email).toHaveAttribute("required", "");
    await expect(password).toBeVisible();
    await expect(password).toHaveAttribute("required", "");
  });

  test("login page shows forgot password and sign up actions", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("button", { name: /forgot password\?/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /don't have an account\? sign up/i })).toBeVisible();
  });

  test("register page has required name email and password fields", async ({ page }) => {
    await page.goto("/register");

    await expect(page.locator('input[name="name"]')).toHaveAttribute("required", "");
    await expect(page.locator('input[name="email"]')).toHaveAttribute("required", "");
    await expect(page.locator('input[name="password"]')).toHaveAttribute("required", "");
  });

  test("register page create account submit button is visible", async ({ page }) => {
    await page.goto("/register");

    await expect(page.getByRole("button", { name: /create an account/i })).toBeVisible();
  });

  test("forgot-password page has required email input and submit button", async ({ page }) => {
    await page.goto("/forget-password");

    const email = page.locator('input[type="email"]');
    await expect(email).toBeVisible();
    await expect(email).toHaveAttribute("required", "");
    await expect(page.getByRole("button", { name: /send otp/i })).toBeVisible();
  });

  test("forgot-password page supports typing into email input", async ({ page }) => {
    await page.goto("/forget-password");

    const email = page.locator('input[type="email"]');
    await email.fill("user@example.com");
    await expect(email).toHaveValue("user@example.com");
  });

  test("verify route with email query still shows invalid token message without token", async ({ page }) => {
    await page.goto("/verify?email=test@example.com");

    await expect(page.getByText(/invalid verification token\./i)).toBeVisible();
    await expect(page.getByRole("button", { name: /resend verification email/i })).toBeVisible();
  });

  test("403 page shows explanation section", async ({ page }) => {
    await page.goto("/403");

    await expect(page.getByRole("heading", { name: /why am i seeing this\?/i })).toBeVisible();
    await expect(page.getByText(/requires specific permissions/i)).toBeVisible();
  });

  test("403 page shows what can you do guidance", async ({ page }) => {
    await page.goto("/403");

    await expect(page.getByRole("heading", { name: /what can you do\?/i })).toBeVisible();
    await expect(page.getByText(/check if you're logged in with the correct account/i)).toBeVisible();
  });

  test("403 page includes go back action button", async ({ page }) => {
    await page.goto("/403");

    await expect(page.getByRole("button", { name: /go back/i })).toBeVisible();
  });
});
