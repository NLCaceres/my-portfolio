import React, { Component } from "react";
import { Carousel, CarouselItem, CarouselCaption, CarouselIndicators } from "reactstrap";
import carousel from "./Carousel.module.css";
import cnames from "classnames";
import ConsoleLogger from "../Utility/LoggerFuncs";
// const util = require("util"); //? Can help debug JS objects and more! -> Obj example below... May not matter with improved browser tools though

let images = []; //? Reactstrap carousel requires image array prop
//@params Also required: Src (useful as React list key) and alt text

class SimpleCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0
    };
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
  }

  //? Required to start carousel animation
  next() {
    if (this.animating) return;
    const nextIndex =
      this.state.activeIndex === images.length - 1
        ? 0
        : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous() {
    if (this.animating) return;
    const nextIndex =
      this.state.activeIndex === 0
        ? images.length - 1
        : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }

  render() {
    const { activeIndex } = this.state;
    const projectImgs = this.props.images;
    // ConsoleLogger("Here are the carousel images");
    // ConsoleLogger(util.inspect(projectImgs, false, null, true));
    ConsoleLogger("Current viewWidth: " + this.props.viewWidth);
    const slides = projectImgs.map(image => {
      return (
        <CarouselItem key={image.image_url}>
          <img
            className={cnames(
              "img-fluid",
              this.props.viewWidth >= 768
                ? carousel.slide
                : carousel.mobileSlide
            )}
            src={image.image_url}
            alt={image.alt_text}
          />
          <CarouselCaption captionText="" />
        </CarouselItem>
      );
    });

    return (
      <Carousel
        activeIndex={activeIndex}
        next={this.next}
        previous={this.previous}
        pause={false}
        ride="carousel"
        interval={false}
        className={cnames(carousel.full, "px-4 mt-3")}
      >
        <CarouselIndicators
          className="mx-4 mt-3 mb-0"
          items={projectImgs}
          activeIndex={activeIndex}
          onClickHandler={this.goToIndex}
        />
        {slides}
      </Carousel>
    );
  }
}

export default SimpleCarousel;
