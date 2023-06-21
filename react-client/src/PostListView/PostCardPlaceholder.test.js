import { render, screen } from "@testing-library/react";
import PostCardPlaceholderList from "./PostCardPlaceholder";

describe("renders a placeholder for the post cards list", () => {
  test("variable num of placeholder cards with a default of 4", () => {
    const { rerender } = render(<PostCardPlaceholderList numPlaceholders={5} />);
    expect(screen.getAllByTestId("placeholder-row")).toHaveLength(5);

    rerender(<PostCardPlaceholderList />);
    expect(screen.getAllByTestId("placeholder-row")).toHaveLength(4);
  })
  //! Currently the individual PostCardPlaceholder is not exported so the only passed-in className is the PlaceholderList's hard-coded "mx-sm-4"
  test("calculating classNames based on class props for each placeholder card", () => {
    render(<PostCardPlaceholderList />);
    const rows = screen.getAllByTestId("placeholder-row");
    expect(rows[0]).toHaveClass("g-0 cardRow row", { exact: true });
    expect(rows[0].parentElement).toHaveClass("postCard postCard mx-sm-4 card", { exact: true });
  })
})