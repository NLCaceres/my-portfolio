import React from 'react';
import { render, screen } from '@testing-library/react';
import PostCardListPlaceholder from './PostCardPlaceholder';
import { averageTabletViewWidth, smallTabletHighEndWidth } from "../Utility/Constants/Viewports"

describe("renders a placeholder for the post cards list", () => {
  test("zigzag'ing placeholder cards at higher viewport widths", () => {
    const { rerender } = render(<PostCardListPlaceholder viewWidth={averageTabletViewWidth} />);
    const rows = screen.getAllByTestId('placeholder-row');
    for (let i = 0; i < rows.length; i++) (i % 2 === 0) ?
      expect(rows[i]).not.toHaveClass('flex-row-reverse') : expect(rows[i]).toHaveClass('flex-row-reverse');

    rerender(<PostCardListPlaceholder viewWidth={smallTabletHighEndWidth} />); //* No zigzag at < 768
    for (const row of rows) expect(row).not.toHaveClass('flex-row-reverse');
  })
  test("variable num of placeholder cards with default of 4", () => {
    const { rerender } = render(<PostCardListPlaceholder viewWidth={smallTabletHighEndWidth} numPlaceholders={5} />);
    expect(screen.getAllByTestId('placeholder-row')).toHaveLength(5);

    rerender(<PostCardListPlaceholder viewWidth={smallTabletHighEndWidth} />);
    expect(screen.getAllByTestId('placeholder-row')).toHaveLength(4);
  })
  test("calculating classNames based on class props for each placeholder card", () => {
    render(<PostCardListPlaceholder viewWidth={averageTabletViewWidth} />);
    const rows = screen.getAllByTestId('placeholder-row');
    expect(rows[0]).toHaveClass('g-0 cardRow row', { exact: true });
    expect(rows[1]).toHaveClass('g-0 cardRow row flex-row-reverse', { exact: true });
    expect(rows[0].parentElement).toHaveClass('postCard postCard mx-sm-4 card', { exact: true });
  })
})