import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import UnavailableFeatureAlert from './AlertUnavailableFeature';

describe("renders a Bootstrap alert specifically for unavailable features", () => {
  describe("with a parent container", () => {
    test("styled with a 'floatingAlert' css module + BS danger + dismissable classes", () => {
      render(<UnavailableFeatureAlert />);
      const alertHeader = screen.getByText(/Feature is currently unavailable/i);
      const alertParentContainer = alertHeader.parentElement;
      expect(alertParentContainer).toHaveClass('fade floatingAlert alert alert-danger alert-dismissible');  
    })
    test("passes along 'show' prop to react-bootstrap", async () => {
      //* The Show prop defaults to true (Appearing does seem to be instant if following done in reverse)
      const { rerender } = render(<UnavailableFeatureAlert show={true} />);
      const alertHeader = screen.getByText(/Feature is currently unavailable/i);
      expect(alertHeader).toBeInTheDocument();
      rerender(<UnavailableFeatureAlert show={false} />)
      await waitFor(() => { //* Disappearing not instant so waitFor will retry until it does! 
        expect(screen.queryByText(/Feature is currently unavailable/i)).not.toBeInTheDocument()
      })
    })
  })
  test("has specific heading & 'p' tags", () => {
    //* Feature unavailable header
    render(<UnavailableFeatureAlert />);
    const alertHeader = screen.getByText(/Feature is currently unavailable/i);
    expect(alertHeader).toBeInTheDocument();

    //* Paragraph tag - 'Try again later. Enjoy the rest'
    const alertMessage = screen.getByText(/enjoy the rest of my portfolio/i);
    expect(alertMessage).toBeInTheDocument();
  })
})
