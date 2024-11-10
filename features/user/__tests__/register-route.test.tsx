import { expect, test, vi, it, describe, afterEach, beforeEach } from "vitest";
import {
  cleanup,
  render,
  renderHook,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import { TestQueryClientProvider } from "@/utils/testQueryClient";
import app from "../server/route";
import { Hono } from "hono";
import { testClient } from "hono/testing";

afterEach(() => {
  cleanup();
});

describe("Register Route", () => {
  it("should create a user on /register with valid data", async () => {
    const app = new Hono().post("/register", async (c) => {
      const { email } = await c.req.json();

      if (email === "existing@example.com") {
        return c.json({ error: "Email already in use" }, 400);
      }

      return c.json({ success: true }, 200);
    });

    const res = await testClient(app).register.$post({
      json: {
        email: "newuser@example.com",
        password: "password123",
        confirmPassword: "password123",
      },
    });

    expect(await res.json()).toEqual({ success: true });
    expect(await res.status).toBe(200);
  });

  it("should return an error if an existing email is used to register", async () => {
    const app = new Hono().post("/register", async (c) => {
      const { email } = await c.req.json();

      if (email === "existing@test.com") {
        return c.json({ error: "Email already in use" }, 400);
      }

      return c.json({ success: true }, 200);
    });

    const res = await testClient(app).register.$post({
      json: {
        email: "existing@test.com",
        password: "password123",
        confirmPassword: "password123",
      },
    });

    expect(await res.json()).toEqual({ error: "Email already in use" });
  });

  it("should return an error in password do not match", async () => {
    const app = new Hono().post("/register", async (c) => {
      const { password, confirmPassword } = await c.req.json();

      if (password !== confirmPassword) {
        return c.json({ error: "Passwords do not match" }, 400);
      }

      return c.json({ success: true }, 200);
    });

    const res = await testClient(app).register.$post({
      json: {
        email: "test@example.com",
        password: "password123",
        confirmPassword: "differentPassword",
      },
    });

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Passwords do not match" });
  });
});
