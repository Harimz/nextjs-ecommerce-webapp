import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/example");
  });

  test("should have correct metadata and elements", async ({ page }) => {
    await expect(page).toHaveTitle("Phancy");
    await expect(
      page.getByRole("heading", { name: "Home Page" })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "form" })).toBeVisible();
  });

  test("should redirect to form page on click", async ({ page }) => {
    await page.getByRole("link", { name: "form" }).click();

    await expect(page.getByRole("heading", { name: "Form" })).toBeVisible();
  });
});

test.describe("Form Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/example/form");
  });

  test("should have correct metadata and elements", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Form" })).toBeVisible();
    await expect(page.getByPlaceholder("Enter item")).toBeVisible();
    await expect(page.getByRole("button", { name: "Add" })).toBeVisible();
  });

  test("should have empty items list on start", async ({ page }) => {
    const itemsList = page.getByTestId("items-list");

    await expect(itemsList).toBeEmpty();
  });

  test("should add item to list", async ({ page }) => {
    const input = page.getByPlaceholder("Enter item");

    await input.fill("Item 1");

    await page.getByRole("button", { name: "Add" }).click();

    const item = page.getByTestId("item").nth(0);

    await expect(item).toHaveText("Item 1");

    await expect(input).toBeEmpty();
  });
});
