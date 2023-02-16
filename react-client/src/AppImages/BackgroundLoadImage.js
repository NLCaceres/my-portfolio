import React, { useEffect, useState, useRef } from "react";
import { animated, config, useResize, useSpring } from "@react-spring/web"
import PlaceholderImg from "./PlaceholderImg";
import BackgroundLoadImageCss from "./BackgroundLoadImage.module.css";
import ConsoleLogger from "../Utility/Functions/LoggerFuncs";

//* Creates a cover via PlaceholderImg, allowing image to load behind it, then remove the cover once the image's onLoad says it has completed
//* Therefore many of these params are needed to make the unveiling feel natural
//@params "Src" + "alt" are common to all images. W/out them, there's no image nor description to load!
//@params onLoad fires a parent assigned callback in both successful and failed image loads 
//@params The "placeholder" & "img" are fairly identical in terms of height & width CSS to ensure they cover each other
//@params backgroundImg container CSS below uses position: relative and flex ensuring BOTH the absolute div placeholder AND the img fill it
//@params So the "placeholder" & "img" CSS use min-height:100% and min-width:100% to stretch to the container's size
//@params Currently the container css should limit the placeholder & img to around 400 wide by 250 tall
//@params Meanwhile parent elements can pass a class that sets a max-width and max-height to maintain aspect-ratio. 
//@params If a container "className" prop is used then larger images can be displayed by setting new 'max-width/height !important'
const BackgroundLoadImage = ({src, alt, placeholderText, onImgClick, onLoad, className, placeholderClass, placeholderTextStyle, imgClass, parentRef}) => {
  //! Animation Setup
  //? Height/width in useResize snap to window dimensions if the user changes the window's size (like when tilting the phone to landscape)
  const { height, width } = useResize({ config: config.molasses }); //? Use a default tension/friction setting to control animation speed
  const [fadeOutSpring, fadeOutAPI] = useSpring(() => ({ from: { opacity: 1 } })); //* Setup the spring to use later
  const [fadeInSpring, fadeInAPI] = useSpring(() => ({ from: { opacity: 0 } })); //? Always use the start state BUT no 'to' key yet!
  const resizeAnimations = () => { height.start(500); width.start(500) } //* Begin resizing container
  const successAnimations = () => {
    resizeAnimations();
    const slowestSpring = { tension: 260 , friction: 260 };
    fadeInAPI.start({ from: { opacity: 0 }, to: { opacity: 1 }, config: slowestSpring }); //* Fade in the img tag
    //* ALSO fade out the placeholder THEN once it has faded out, unmount it by setLoading to false
    fadeOutAPI.start({ from: { opacity: 1 }, to: { opacity: 0 }, config: slowestSpring, onRest: () => setLoading(false) })
  }
  //! Actual state
  const [loading, setLoading] = useState(false);
  const [successfulLoad, setSuccessfulLoad] = useState(false);
  //! Lifecycle functions - useEffect called onMount + unmount. loadFinished called when img is ready. loadFailed called when an error occurs
  useEffect(() => { setLoading(true) }, [src]); //? Only perform onMount, unmount or if img src changes
  const loadFinished = () => { //* event param not needed but can add in future if needed
    setSuccessfulLoad(true); //* If loadFinished runs, we should have a visible image, so mark it and remove placeholder cover
    successAnimations();
    if (onLoad) { onLoad(true) } //* Run parent's callback with success flag
  }
  const loadFailed = () => {
    if (src !== "") { resizeAnimations() } //* Just resize the placeholder IF fail isn't a result of a bad URL aka empty string ""
    setLoading(false); //* Let the hidden failed image behind it unmount, completely unseen
    if (onLoad) { onLoad(false) } //* Run parent's callback with fail flag
  }

  return (
    <animated.div className={`${BackgroundLoadImageCss.container} ${className || ""}`} ref={parentRef} style={{ height, width }}>
      { (loading || !successfulLoad) && /*//* Cover img tag when loading and display as backup if load failed or threw errors */
        <PlaceholderImg loading={loading} className={`${BackgroundLoadImageCss.placeholder} ${placeholderClass || ""}`} 
          style={fadeOutSpring} textStyle={placeholderTextStyle}> 
            { placeholderText }
        </PlaceholderImg>
      }
      { (loading || successfulLoad) && /*//* Once loading is set true, let the image load! If the src url fails, then remove the img! */
        <animated.img src={src} alt={alt} onClick={onImgClick} onLoad={loadFinished} onError={loadFailed} 
          className={`${BackgroundLoadImageCss.photo} ${imgClass || ""}`} style={fadeInSpring} />
      }
    </animated.div>
  )
}

export default BackgroundLoadImage;