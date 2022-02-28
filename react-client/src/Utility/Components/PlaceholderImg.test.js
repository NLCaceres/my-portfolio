import React from 'react';
import { render, screen } from '@testing-library/react';
import PlaceHolderImg from './PlaceholderImg';

describe("renders a div that looks like a placeholder img", () => {
  test("using a lookalike header tag in a container div", () => {
    render(<PlaceHolderImg />)
    const headerTag = screen.getByRole('heading');
    expect(headerTag).toBeInTheDocument();
    expect(headerTag).toHaveClass('placeholderText');
    expect(headerTag.parentElement).toHaveClass('placeholderImg');
  })
})