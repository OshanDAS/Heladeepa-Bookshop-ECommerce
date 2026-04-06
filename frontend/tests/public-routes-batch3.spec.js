import { expect, test } from "@playwright/test";

test.describe("Public routes batch 3", () => {
  test("verify page without token shows invalid token message", async ({ page }) => {
    await page.goto("/verify");
    await expect(page.getByText(/invalid verification token\./i)).toBeVisible();
  });

  test("verify page without token shows resend button", async ({ page }) => {
    await page.goto("/verify");
    await expect(page.getByRole("button", { name: /resend verification email/i })).toBeVisible();
  });

  test("verify page with email query still shows invalid token state", async ({ page }) => {
    await page.goto("/verify?email=qa@example.com");
    await expect(page.getByText(/invalid verification token\./i)).toBeVisible();
  });

  test("403 page main heading is visible", async ({ page }) => {
    await page.goto("/403");
    await expect(page.getByRole("heading", { name: /403 - access denied/i })).toBeVisible();
  });

  test("403 page reason text is visible", async ({ page }) => {
    await page.goto("/403");
    await expect(page.getByText(/you don't have permission to access this page\./i)).toBeVisible();
  });

  test("403 page why-section heading is visible", async ({ page }) => {
    await page.goto("/403");
    await expect(page.getByRole("heading", { name: /why am i seeing this\?/i })).toBeVisible();
  });

  test("403 page support guidance is visible", async ({ page }) => {
    await page.goto("/403");
    await expect(page.getByText(/contact support if you believe this is a mistake/i)).toBeVisible();
  });

  test("403 page includes go back button", async ({ page }) => {
    await page.goto("/403");
    await expect(page.getByRole("button", { name: /go back/i })).toBeVisible();
  });

  test("403 page includes go to login link", async ({ page }) => {
    await page.goto("/403");
    await expect(page.getByRole("link", { name: /go to login/i })).toBeVisible();
  });

  test("403 -> login navigation via link works", async ({ page }) => {
    await page.goto("/403");
    await page.getByRole("link", { name: /go to login/i }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("heading", { name: /log in to your account/i })).toBeVisible();
  });
});
