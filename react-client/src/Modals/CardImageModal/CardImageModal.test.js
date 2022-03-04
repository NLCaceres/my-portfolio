import React from 'react';
import CardImageModal from './CardImageModal';
import { render, screen, prettyDOM } from '@testing-library/react';
import ProjectFactory, { ProjectImageFactory } from "../../Utility/Functions/Tests/ProjectFactory";
import { averageTabletViewWidth } from '../../Utility/Constants/Viewports';
import { CleanAndKebabString } from '../../Utility/Functions/ComputedProps';

const voidFunc = () => 'void';
describe("renders modal using my simple-modal component to display project's title + image set", () => {
  test("displaying a project title + image set", () => {
    //* No project given = Empty modal (When modal waiting for a click event to be filled)
    const { rerender } = render(<CardImageModal viewWidth={averageTabletViewWidth} show={true} onHide={voidFunc}/>);
    const modalRoot = screen.getByRole('dialog');
    const modalBody = modalRoot.firstChild.firstChild.firstChild; //* Root -> modal-dialog -> modal-content -> modal-body
    expect(modalBody).toBeEmptyDOMElement();

    //* Project no imgs = Titled modal, empty body (Shouldn't happen in prod)
    const projectWithoutImgs = ProjectFactory.create();
    const expectedTitleKebab = CleanAndKebabString(projectWithoutImgs.title + ' modal');
    rerender(<CardImageModal project={projectWithoutImgs} viewWidth={averageTabletViewWidth} show={true} onHide={voidFunc}/>)
    const modalTitleTag = screen.getByRole('heading', { name: /foobar/i });
    expect(modalTitleTag.parentElement).toBeInTheDocument(); //* Header present + title present
    expect(modalTitleTag).toHaveAttribute('id', expectedTitleKebab);
    expect(modalRoot).toHaveAttribute('aria-labelledby', expectedTitleKebab);
    expect(modalBody).toBeEmptyDOMElement(); //* Can use same modalBody, still the same one, react's efficient it reuses what it can

    projectWithoutImgs.post_images = [ProjectImageFactory.create()]; //* Now 1 img. Still not enough, no carousel or click
    rerender(<CardImageModal project={projectWithoutImgs} viewWidth={averageTabletViewWidth} show={true} onHide={voidFunc}/>);
    expect(screen.queryByRole('img', { name: projectWithoutImgs.post_images[0].alt_text })).not.toBeInTheDocument();

    //* Now have multi imgs (>= 2), now carousel instead of direct img
    projectWithoutImgs.post_images = [ProjectImageFactory.create(), ProjectImageFactory.create()];
    rerender(<CardImageModal project={projectWithoutImgs} viewWidth={averageTabletViewWidth} show={true} onHide={voidFunc}/>);
    const imageCarouselTag = screen.getByTestId('simple-carousel');
    expect(imageCarouselTag).toBeInTheDocument();
    const carouselItems = imageCarouselTag.lastChild.childNodes; //* Carousel root -> carousel-inner -> 2 * carousel-items
    expect(carouselItems).toHaveLength(2); //* Counting the carousel-items rather than specifically the imgs inside of them
    expect(screen.getAllByRole('img')).toHaveLength(2); //* Counting the imgs inside carousel-items
  })
  test("calculating the right css classes", () => {
    const projectWithoutImgs = ProjectFactory.create(1);
    render(<CardImageModal project={projectWithoutImgs} viewWidth={averageTabletViewWidth} show={true} onHide={voidFunc}/>);
    const modalTitleTag = screen.getByText(/foobar/i);
    expect(modalTitleTag).toHaveClass('fw-bolder text-white');
    const modalHeader = modalTitleTag.parentElement;
    expect(modalHeader).toHaveClass('pt-2 pb-1');
    const modalBody = modalHeader.nextElementSibling;
    expect(modalBody).toHaveClass('pt-1');
  })
})