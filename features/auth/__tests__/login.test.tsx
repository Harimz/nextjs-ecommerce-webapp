import { expect, test, vi, it, describe, afterEach, beforeEach } from "vitest";
import {
  cleanup,
  render,
  renderHook,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import { LoginCard } from "../components/login-card";
import { TestQueryClientProvider } from "@/utils/testQueryClient";
import { signIn, SignInResponse } from "next-auth/react";
import { useLogin } from "../api/use-login";
import { toast } from "sonner";

afterEach(() => {
  cleanup();
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("Login Component - Rendering", () => {
  it("renders login title", () => {
    render(
      <TestQueryClientProvider>
        <LoginCard />
      </TestQueryClientProvider>
    );

    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
  });

  it("renders input fields and Google login button", () => {
    render(
      <TestQueryClientProvider>
        <LoginCard />
      </TestQueryClientProvider>
    );

    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Login with Google/i })
    ).toBeInTheDocument();
  });
});

describe("Login Card - Behavior", () => {
  it("should call use hook to login user with credentials", async () => {
    vi.mocked(signIn).mockResolvedValue({
      ok: true,
      status: 200,
    } as SignInResponse);

    const { result } = renderHook(useLogin, {
      wrapper: TestQueryClientProvider,
    });

    result.current.mutate({
      email: "test@example.com",
      password: "password123",
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(signIn).toHaveBeenCalledWith("credentials", {
      redirect: false,
      email: "test@example.com",
      password: "password123",
    });
  });

  it("should allow user to login by pressing the loggin button", async () => {
    vi.mocked(signIn).mockResolvedValue({
      ok: true,
      status: 200,
    } as SignInResponse);

    render(
      <TestQueryClientProvider>
        <LoginCard />
      </TestQueryClientProvider>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole("button", { name: "Login" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        redirect: false,
        email: "test@example.com",
        password: "password123",
      });
    });

    expect(toast.success).toHaveBeenCalledWith("Logged in successfully");
  });

  it("should return an error if the user has invalid credentials", async () => {
    vi.mocked(signIn).mockResolvedValue({
      ok: false,
      status: 401,
      error: "CredentialsSignin",
    } as SignInResponse);

    render(
      <TestQueryClientProvider>
        <LoginCard />
      </TestQueryClientProvider>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole("button", { name: "Login" });

    fireEvent.change(emailInput, { target: { value: "wrong@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        redirect: false,
        email: "wrong@example.com",
        password: "wrongpassword",
      });
    });

    expect(toast.error).toHaveBeenCalledWith("Email or password was incorrect");
  });
});
