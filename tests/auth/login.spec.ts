import { test, expect } from "@playwright/test";

test.describe("Login Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/login");
  });
  test("should render correct elements", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Login with Google/i })
    ).toBeVisible();
    await expect(page.getByPlaceholder("Enter email address")).toBeVisible();
    await expect(page.getByPlaceholder("Enter password")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Login" }).nth(1)
    ).toBeVisible();
  });

  test("should login on button click and redirect to home page", async ({
    page,
  }) => {
    await page
      .getByPlaceholder("Enter email address")
      .fill("harimzermeno@gmail.com");
    await page.getByPlaceholder("Enter password").fill("damaris123");

    await page.getByRole("button", { name: "Login" }).nth(1).click();

    await page.waitForURL("http://localhost:3000/");
    await expect(page).toHaveURL("http://localhost:3000/");
  });
});
