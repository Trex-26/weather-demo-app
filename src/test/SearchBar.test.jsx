import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "../components/SearchBar";

const cities = ["New York", "London", "Tokyo", "Paris"];

describe("SearchBar", () => {
  it("renders search input with placeholder", () => {
    render(<SearchBar onSearch={() => {}} suggestions={cities} />);
    expect(screen.getByPlaceholderText(/Search city/)).toBeInTheDocument();
  });

  it("renders search button", () => {
    render(<SearchBar onSearch={() => {}} suggestions={cities} />);
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("calls onSearch with query when form is submitted", async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} suggestions={cities} />);
    const input = screen.getByPlaceholderText(/Search city/);

    fireEvent.change(input, { target: { value: "Tokyo" } });
    fireEvent.submit(input.closest("form"));

    expect(onSearch).toHaveBeenCalledWith("Tokyo");
  });

  it("shows suggestions when typing", async () => {
    render(<SearchBar onSearch={() => {}} suggestions={cities} />);
    const input = screen.getByPlaceholderText(/Search city/);

    fireEvent.change(input, { target: { value: "Lon" } });

    expect(screen.getByText("London")).toBeInTheDocument();
  });

  it("filters suggestions based on input", async () => {
    render(<SearchBar onSearch={() => {}} suggestions={cities} />);
    const input = screen.getByPlaceholderText(/Search city/);

    fireEvent.change(input, { target: { value: "Tok" } });

    expect(screen.getByText("Tokyo")).toBeInTheDocument();
    expect(screen.queryByText("London")).not.toBeInTheDocument();
  });

  it("does not call onSearch with empty query", async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} suggestions={cities} />);
    const form = screen.getByPlaceholderText(/Search city/).closest("form");

    fireEvent.submit(form);

    expect(onSearch).not.toHaveBeenCalled();
  });
});
