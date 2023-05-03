import React from "react";

//! Lesson on Higher Order Components
//? Render function names passed into a prop are different than passing in "<SomeComponent />"
//? i.e. if you have "const ChildComponent = ({name}) => (<div>{name || 'Default'}</div>)"
//? THEN use it as "<ParentComponent foo={childComponent}" vs "<ParentComponent foo={<ChildComponent name="Barfoo" />}"
//? The left renders ChildComponent using its name prop's default value. The right renders it with the name "Barfoo"
//? So why bother doing the left? Well the right is locked in to whatever value you set in the parent
//? BUT the left can be modified by and receive props from both the parent AND the child
//* Real Example: PostCard makes a specific type of carousel where the item isn't just a basic image BUT an IntersectLoadImage
//* Problem: Carousel uses map() to array-render its Carousel.Items, injecting into each Item, 1 img src + alt, each loop
//* If I used the "right-side" approach, AppCarousel couldn't inject the src or alt, it would just get the className but the img would never load
//? Also worth noting the "right-side" approach require AppCarousel to acknowledge it's receiving a React.element! AND 
//? inject it like so "<Carousel.Item>{itemContent}<Carousel.Item/>"
//? Using the "left-side" approach, a render function is what's being passed down, meaning it can be used as Component() OR <Component />
//? Taking it as a render function means I can pass the render func prop to a higher-order func for modification
//? In this case "Component" is a render func, and "className" is the prop I want to make sure renders at the end
//? The HOC function therefore must return another render func! BUT that returned render func must accept any props further downstream
//* Or else when AppCarousel uses the render func as the "ItemComponent" prop then injecting src or alt would have no effect!
//! There is 1 last quirk! because className is a commonly used prop, what happens when AppCarousel wants to add its own classes?
//* Therefore we must account for this in the HOC. The returned render func can split its props via destructuring to combine 
//* the IntersectLoadCarousel's desired classes with AppCarousel's desired class list.
//? Because AppCarousel would likely run "<ItemComponent className="AppCarouselCss.foobar" />", we can rename the prop while destructuring
//? A prop named className can be renamed like so ---> "const { className: newName } = { className: 'some-class' }" OR in a func's args as seen below
//@params: Component is a render function allowing for endless HOCs to be passed in
//@params: className is the focus, enabling composition of a func component passed into a prop in render func form
const withClassName = (Component, className) => 
  ( ({ className: otherClasses, ...props }) => <Component className={`${className} ${otherClasses || ""}`.trim()} {...props} /> )

//! Example of using "withClassName"
//! <AppCarousel images={ images } className={ className } ItemComponent={ withClassName(IntersectLoadImage, imgClassName) } />

//! There is a somewhat simpler way to accomplish my goal in this case though!
//* What if instead of passing AppCarousel a customized component for Carousel.Item's map() to use,
//* I pass an array of Carousel.Items made via a map() into the 'children' prop of AppCarousel
//* Instead of passing AppCarousel an 'images' prop, I take that images array I'd normally pass into the prop and 
//* map() over the array to make an Array<React.Element> to use like this "<Carousel> { items } </Carousel>"
//* Letting AppCarousel check if a 'children' prop was passed in and render it, and if no 'children' prop, fallback to the 'images' prop

export default withClassName;