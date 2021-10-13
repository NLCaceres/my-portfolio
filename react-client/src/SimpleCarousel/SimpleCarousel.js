import React, { Component } from "react";
import { Carousel, CarouselItem, CarouselCaption, CarouselIndicators } from "reactstrap";
import CarouselCss from "./Carousel.module.css";
import "./Carousel.css";
import cnames from "classnames";
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
    const nextIndex = this.state.activeIndex === images.length - 1 ? 0 : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === 0 ? 
      images.length - 1 : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }

  render() {
    const { activeIndex } = this.state;
    const projectImgs = this.props.images;
    
    const slides = projectImgs.map(image => {
      return (
        <CarouselItem key={ image.image_url }>
          <img className={ cnames("img-fluid", this.props.viewWidth >= 768 ? CarouselCss.slide : CarouselCss.mobileSlide) }
            src={ image.image_url } alt={ image.alt_text } />
          <CarouselCaption captionText="" />
        </CarouselItem>
      );
    });

    return (
      <Carousel pause={false} next={ this.next } previous={ this.previous }
        activeIndex={ activeIndex } ride="carousel" interval={false}
        className={ cnames(CarouselCss.full, "px-4 mt-3") }>
          <CarouselIndicators items={ projectImgs } className="mx-4 mt-3 mb-0"
            activeIndex={ activeIndex } onClickHandler={ this.goToIndex } />
          {slides}
      </Carousel>
    );
  }
}

export default SimpleCarousel;
