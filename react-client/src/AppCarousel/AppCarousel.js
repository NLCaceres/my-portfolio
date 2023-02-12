import React, { useEffect, useState } from "react";
import Carousel from 'react-bootstrap/Carousel';
import CarouselCss from "./Carousel.module.css";
import cnames from "classnames";

//! Bootstrap Carousel with defaults set - no control arrows or interval
const AppCarousel = ({ images, className, viewWidth }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  //? Set height/width to ensure good aspect ratio for images in the Carousel
  const height = (viewWidth > 991) ? 450 : (viewWidth > 767) ? 500 : (viewWidth > 575) ? 550 : 450;
  const width = (viewWidth > 767) ? 350 : (viewWidth > 575) ? 425 : (viewWidth > 359) ? 330 : 280;

  const goToIndex = (newIndex, e) => {
    setActiveIndex(newIndex);
  }

  const [usingHoverClass, setUsingHoverClass] = useState(false);
  useEffect(() => { //* At wider viewports (Large tablets + desktops), when mounting, fade the arrow icons in and out
    if (viewWidth >= 768) {
      let iterations = 0;
      const fadeEffectInterval = setInterval(() => {
        iterations++; //* 6 runs! On 6th we clear THEN hide by class removal
        //* 1st iteration = Show, 2nd = hide, so on and so forth
        if (iterations > 5) clearInterval(fadeEffectInterval); //* Able to clear itself!
        setUsingHoverClass(prevState => !prevState);
      }, 750)
      return () => { clearInterval(fadeEffectInterval) }
    }
  }, [viewWidth]);

  return (
    <Carousel activeIndex={ activeIndex } onSelect={ goToIndex } controls={false}
      interval={null} data-testid="app-carousel" className={ cnames(CarouselCss.full, `${className || ''}`, 
      {"hovered-indicators": usingHoverClass }) }>
        { //? React-bootstrap expects 'Carousel.Item's so abstracting this block to a Func component DOESN'T work
          images.map(image => { //* Create an array of Carousel.Items to display
            return (
              <Carousel.Item key={ image.image_url }>
                <img className={`img-fluid ${CarouselCss.slide}`} src={ image.image_url } alt={ image.alt_text } 
                  height={ height } width={ width } />
                { image.caption && <Carousel.Caption> <h3>{ image.caption }</h3> </Carousel.Caption> }
              </Carousel.Item>
            )}
          )
        }
    </Carousel>
  );
}

export default AppCarousel;
