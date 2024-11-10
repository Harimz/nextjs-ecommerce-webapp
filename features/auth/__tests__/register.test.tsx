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
import { RegisterCard } from "../components/register-card";
import { useRegister } from "@/features/user/api/use-register";
import { Hono } from "hono";
import { testClient } from "hono/testing";
import { getUserByEmail } from "../queries";
import { toast } from "sonner";
import { MutateOptions } from "@tanstack/react-query";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/features/user/api/use-register", async () => {
  return {
    useRegister: vi.fn(() => ({
      mutate: vi.fn(),
      isLoading: false,
    })),
  };
});

afterEach(() => {
  cleanup();
});

describe("Register Card - Rendering", () => {
  it("should render the sign up heading", () => {
    render(
      <TestQueryClientProvider>
        <RegisterCard />
      </TestQueryClientProvider>
    );

    expect(
      screen.getByRole("heading", { name: "Sign Up" })
    ).toBeInTheDocument();
  });

  it("should render the input elements", () => {
    render(
      <TestQueryClientProvider>
        <RegisterCard />
      </TestQueryClientProvider>
    );

    expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter email address")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm password")).toBeInTheDocument();
  });
});

describe("Register Card - Behavior", () => {
  it("should allow user to create an account with valid credentials", async () => {
    const mockMutate = vi.fn();
    vi.mocked(useRegister).mockReturnValue({
      mutate: mockMutate,
    } as any);

    render(
      <TestQueryClientProvider>
        <RegisterCard />
      </TestQueryClientProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter your name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter email address"), {
      target: { value: "example@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        name: "John Doe",
        email: "example@test.com",
        password: "password123",
        confirmPassword: "password123",
      });
    });
  });
});
