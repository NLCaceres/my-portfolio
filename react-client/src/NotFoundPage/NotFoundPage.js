import React from "react";
import NotFoundCss from "./NotFoundPage.module.css"

//? Using react.memo allows shouldComponentUpdate like optimizing (see callback below)
const NotFoundPage = React.memo(() => {
  const randomImgSet = [
    "https://imgur.com/uclpvfT.png",
    "https://imgur.com/lNcHO0e.png",
    "https://imgur.com/Of0gAOd.png",
    "https://imgur.com/2EEuwzP.png",
    "https://imgur.com/wkdXneC.png",
    "https://imgur.com/DnGZrfn.png",
    "https://imgur.com/UYxIDEk.png",
    "https://imgur.com/KXnbSAi.png",
    "https://imgur.com/Ow4Vn9x.png"
  ];
  const rand = Math.floor(Math.random() * 9);
  const imgSrc = randomImgSet[rand];
  
  return (
    <div className="flex-grow-1" style={{ paddingLeft: "10px", paddingRight: "10px" }}>
      <h1>Sorry! Not Much to See Here!</h1>
      <img src={ imgSrc } alt="A Cute Pup!" className={ `${NotFoundCss['img-thumbnail']}` } />
      <h4 style={{ marginTop: "10px" }}>So Here's a Puppy to Make Up for It!</h4>
    </div>
  );
}, function (prevProps, nextProps) { //* Essentially an areEqual overriden function
  //* Since no other props change, observe page url to prevent rerendering/img change when a modal appears
  return prevProps.location?.pathname === nextProps.location?.pathname; //* Return true means props equal don't rerender
});

export default NotFoundPage