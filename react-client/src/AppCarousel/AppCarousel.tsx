import { type ReactNode, useEffect, useState } from "react";
import useViewWidth from "../ContextProviders/ViewWidthProvider";
import Carousel from "react-bootstrap/Carousel";
import CarouselCss from "./Carousel.module.css";

//todo How to Replace the Bootstrap Carousel?
//todo One option is to render the representative img and if the array length > 1 then also render indicators
//todo THEN use those indicators on click to change the representative img by hiding the others underneath
//todo ONLY on initial view does each img load in, but all subsequent viewings no reload needed!
//todo ALTERNATIVE: Ditch Carousel all together for something different
//todo Examples: 1. Grid/Collage of images that on click scale up the chosen img
//todo 2. Dark background, jumbotron display rep img w/ minified imgs below. On click, scale down the rep img & scale up the chosen img
//todo 3. Deck of cards that swap out and around each other.
//todo Bonus: Display alt_text or a new description property in the foreground of the jumbotron'd rep img

type CarouselImage = { image_url: string, alt_text: string, caption?: string };
type CarouselProps = { children?: ReactNode, images?: CarouselImage[], ItemComponent?: (itemProps: CarouselItem) => JSX.Element, className?: string };

//! Bootstrap Carousel with defaults set - no control arrows or interval
const AppCarousel = ({ children, images, ItemComponent, className }: CarouselProps ) => {
  const viewWidth = useViewWidth();
  const [activeIndex, setActiveIndex] = useState(0);

  //? Disable unused-var since goToIndex() is typed with `e` to satisfy Carousel's onSelect
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const goToIndex = (newIndex: number, _e?: Record<string, unknown> | null) => { //? Add _ to `e` to disable the warning too
    setActiveIndex(newIndex);
  };

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
              <ItemComponent src={ image.image_url } alt_text={ image.alt_text } /> : 
              <DefaultItem src={ image.image_url } alt_text={ image.alt_text } viewWidth={ viewWidth } caption={image.caption} /> 
          }
        </Carousel.Item>
      )
    )
  )

  const classList = `${CarouselCss.full} ${className || ""} ${(usingHoverClass) ? "hovered-indicators" : ""}`.trim();
  return (
    <Carousel activeIndex={ activeIndex } onSelect={ goToIndex } controls={false}
      interval={null} data-testid="app-carousel" className={ classList }>
        { child }
    </Carousel>
  );
}

type CarouselItem = { src: string, alt_text: string };
type DefaultCarouselItem = CarouselItem & { caption?: string, viewWidth?: number };
const DefaultItem = ({ src, alt_text, caption, viewWidth = 0 }: DefaultCarouselItem) => {
  //? Set height/width to ensure good aspect ratio for images in the Carousel
  const height = (viewWidth > 991) ? 450 : (viewWidth > 767) ? 500 : (viewWidth > 575) ? 550 : 450;
  const width = (viewWidth > 767) ? 350 : (viewWidth > 575) ? 425 : (viewWidth > 359) ? 330 : 280;

  return (
    <>
      <img className={`img-fluid ${CarouselCss.slide}`} src={ src } alt={ alt_text } height={ height } width={ width } />
      { caption && <Carousel.Caption> <h3>{ caption }</h3> </Carousel.Caption> }
    </>
  )
}

export default AppCarousel;
