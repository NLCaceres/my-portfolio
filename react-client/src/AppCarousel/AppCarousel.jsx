import React, { useEffect, useState } from "react";
import useViewWidth from "../ContextProviders/ViewWidthProvider";
import Carousel from "react-bootstrap/Carousel";
import CarouselCss from "./Carousel.module.css";
import cnames from "classnames";
import ConsoleLogger from "../Utility/Functions/LoggerFuncs";

//! Bootstrap Carousel with defaults set - no control arrows or interval
const AppCarousel = ({ children, images, ItemComponent, className }) => {
  const viewWidth = useViewWidth();
  const [activeIndex, setActiveIndex] = useState(0);

  const goToIndex = (newIndex, e) => {
    setActiveIndex(newIndex);
  }

  const [usingHoverClass, setUsingHoverClass] = useState(false);
  useEffect(() => { //* At wider viewports (Large tablets + desktops), when mounting, fade the arrow icons in and out
    if (viewWidth < 768) { return }
    let iterations = 0;
    const fadeEffectInterval = setInterval(() => {
      iterations++; //* 6 runs! On 6th we clear THEN hide by class removal
      //* 1st iteration = Show, 2nd = hide, so on and so forth
      if (iterations > 5) clearInterval(fadeEffectInterval); //* Able to clear itself!
      setUsingHoverClass(prevState => !prevState);
    }, 750)
    return () => { clearInterval(fadeEffectInterval) }
  }, [viewWidth]);

  const child = ( //* Either take the passed in "children" OR create a list based on the "images" prop
    children ||
    images?.map(image => //* List of Carousel.Items to display
      (
        <Carousel.Item key={ image.image_url }>
          { (ItemComponent) ?
              <ItemComponent src={ image.image_url } alt={ image.alt_text } /> : 
              <DefaultItem src={ image.image_url } alt={ image.alt_text } viewWidth={ viewWidth } caption={image.caption} /> 
          }
        </Carousel.Item>
      )
    )
  )

  return (
    <Carousel activeIndex={ activeIndex } onSelect={ goToIndex } controls={false}
      interval={null} data-testid="app-carousel" className={ cnames(CarouselCss.full, `${className || ""}`, 
      { "hovered-indicators": usingHoverClass }) }> 
        { child }
    </Carousel>
  );
}

const DefaultItem = ({ src, alt, caption, viewWidth }) => {
  //? Set height/width to ensure good aspect ratio for images in the Carousel
  const height = (viewWidth > 991) ? 450 : (viewWidth > 767) ? 500 : (viewWidth > 575) ? 550 : 450;
  const width = (viewWidth > 767) ? 350 : (viewWidth > 575) ? 425 : (viewWidth > 359) ? 330 : 280;

  return (
    <>
      <img className={`img-fluid ${CarouselCss.slide}`} src={ src } alt={ alt } height={ height } width={ width } />
      { caption && <Carousel.Caption> <h3>{ caption }</h3> </Carousel.Caption> }
    </>
  )
}

export default AppCarousel;
