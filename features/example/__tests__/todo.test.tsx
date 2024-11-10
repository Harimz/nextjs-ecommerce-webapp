import { expect, test } from "vitest";
import { Todo } from "../components/todo";
import { render, screen } from "@testing-library/react";

test("Example", () => {
  render(<Todo />);
  expect(screen.getByRole("button")).toBeDefined();
});
