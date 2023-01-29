import React, { useEffect, useState } from "react";
import NotFoundCss from "./NotFoundPage.module.css"
import ConsoleLogger from "../Utility/Functions/LoggerFuncs";

//* NotFoundPage that renders a fun image on redirect/fallback from an unknown URL
const NotFoundPage = () => {
  //* Simplified approach to prevent rerenders that doesn't even need useLocation
  //* PLUS allows a slick loading transition into the image via setTimeout() on setImgSrc()
  const [imgSrc, setImgSrc] = useState(undefined);
  useEffect(() => {
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
    setImgSrc(randomImgSet[rand])
  }, []) //* No dependencies means this effect only runs onMount!

  return (
    <div className={`${NotFoundCss.container}`}>
      <h1>Sorry! Not Much to See Here!</h1>
      <img src={ imgSrc } alt="A Cute Pup!" className={ `${NotFoundCss.pupImage}` } />
      <h4 className={`${NotFoundCss.caption}`}>So Here's a Puppy to Make Up for It!</h4>
    </div>
  );
}

export default NotFoundPage