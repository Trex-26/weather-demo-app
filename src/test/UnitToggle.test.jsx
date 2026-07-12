import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import UnitToggle from "../components/UnitToggle";

describe("UnitToggle", () => {
  it("renders both unit labels", () => {
    render(<UnitToggle unit="C" onToggle={() => {}} />);
    expect(screen.getByText("°C")).toBeInTheDocument();
    expect(screen.getByText("°F")).toBeInTheDocument();
  });

  it("calls onToggle when clicked", () => {
    const onToggle = vi.fn();
    render(<UnitToggle unit="C" onToggle={onToggle} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("has correct aria-label for Celsius mode", () => {
    render(<UnitToggle unit="C" onToggle={() => {}} />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      "Switch to Fahrenheit"
    );
  });

  it("has correct aria-label for Fahrenheit mode", () => {
    render(<UnitToggle unit="F" onToggle={() => {}} />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      "Switch to Celsius"
    );
  });
});
