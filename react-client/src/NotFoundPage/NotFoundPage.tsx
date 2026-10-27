import { useState } from "react";
import { useSpring } from "@react-spring/web";
import NotFoundCss from "./NotFoundPage.module.css";
import BackgroundLoadImage from "../AppImages/BackgroundLoadImage";
import { createLazyRoute } from "@tanstack/react-router";

//* NotFoundPage that renders a fun image on redirect/fallback from an unknown URL
const NotFoundPage = () => { //* Simplified approach to prevent rerenders and no need for useLocation
  const [imgSrc] = useState(RandomImg);
  const [placeholderText, setPlaceholderText] = useState("One Cute Puppy Incoming!");
  const [containerCSS, setContainerCSS] = useState(`${NotFoundCss.container} will-change-contents`);

  //! PuppyLoaded is called regardless if image successfully loads or fails
  const [flingSpring, flingAPI] = useSpring(() => ({ from: { x: "0%", transform: "rotate(0deg)" }}));
  const puppyLoaded = (successful: boolean) => {
    const flingSteps = [{ x: "-50%", transform: "rotate(-40deg)" }, { x: "150%", transform: "rotate(350deg)" }];
    if (successful) { flingSteps.shift(); } //* If image loads correctly, animate fling w/out windup
    const delay = (successful) ? 0 : 500;
    //? Could use promise.all() BUT with these particular animation config props, only 1 item ends up in returned array
    Promise.race(flingAPI.start({ //? So race() returns that 1 val as soon as the animation completes
      delay, config: { tension: 200, friction: 25 }, //* Not too bouncy + transitions from 1st 'to' step to 2nd step quickly
      from: { x: "0", transform: "rotate(0deg)" }, to: flingSteps //? Using 'x' avoids "transform-origin" issue when doing "rotate() translateX()"
    })).then(() => { //? "x" seems to become translate3d() under the hood
      if (successful) { setContainerCSS(`${NotFoundCss.container}`); return; }

      setPlaceholderText("Sorry! That Puppy is Tough to Fetch!"); // AND start frame animations
      void flingAPI.start({ //? Starts at prev `rotate(-40deg)` so MUST return to 0deg in this `to` prop
        config: { tension: 175, friction: 15 }, from: { x: "-50%" }, to: { x: "0%", transform: "rotate(0deg)" }
      });
      setContainerCSS(`${NotFoundCss.container}`);
    }).catch(() => { console.error("Puppy loading animation failed"); });
  };

  return (
    <div className={containerCSS}>
      <h1>Sorry! Not Much to See Here!</h1>
      <BackgroundLoadImage src={imgSrc} alt="A Cute Pup!" onLoad={puppyLoaded} className={`${NotFoundCss.backgroundContainer}`}
                           placeholderClass={`${NotFoundCss.image}`} placeholderText={placeholderText}
                           placeholderTextStyle={flingSpring} imgClass={`${NotFoundCss.image}`} />
      <h4 className={`${NotFoundCss.caption}`}>{"So Here's a Puppy to Make Up for It!"}</h4>
    </div>
  );
};

function RandomImg() {
  const randomImgSet = [
    "https://imgur.com/uclpvfT.png", "https://imgur.com/lNcHO0e.png", "https://imgur.com/Of0gAOd.png",
    "https://imgur.com/2EEuwzP.png", "https://imgur.com/wkdXneC.png", "https://imgur.com/DnGZrfn.png",
    "https://imgur.com/UYxIDEk.png", "https://imgur.com/KXnbSAi.png", "https://imgur.com/Ow4Vn9x.png"
  ];
  return randomImgSet[Math.floor(Math.random() * randomImgSet.length)];
}

export default NotFoundPage;

export const lazyNotFoundRoute = createLazyRoute("/not-found")({ component: NotFoundPage });
