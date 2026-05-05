import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders brand name in header", () => {
  render(<App />);
  const linkElement = screen.getByText(/NailArt Studio/i);
  expect(linkElement).toBeInTheDocument();
});
