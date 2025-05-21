import { useEffect, useState, type ReactNode, type RefObject } from "react";
import { animated, config, useResize, useSpring } from "@react-spring/web";
import PlaceholderImg from "./PlaceholderImg";
import BackgroundLoadImageCss from "./BackgroundLoadImage.module.css";
import { type AnimatableStyle } from "../Utility/Typings/ReactSpringTypes";

type BackgroundImageProps = {
  src: string, alt: string, placeholderText?: ReactNode, onImgClick?: () => void,
  onLoad?: (didLoad: boolean) => void, className?: string, placeholderClass?: string,
  placeholderTextStyle?: AnimatableStyle, imgClass?: string, parentRef?: RefObject<HTMLDivElement | null>
};

/** Creates a PlaceholderImg, covering a loading <img>, uncovering it on success and removing it on fail
 * @param {BackgroundImageProps} props BackgroundLoadImage properties to craft a natural UX:
 * "src" + "alt" are common to <img>. Similarly, onLoad fires on img load, successfully or not
 * onImgClick fires on user click of the <img>
 * placeHolderText accepts a wide variety of types to use as a temporary descriptive text of the img
 * className, placeholderClass, and imgClass define the CSS for their respective HTML tags
 * They should avoid altering height, width, and position, uncovering the img
 * parentRef should be used to target and manipulate the component container */
const BackgroundLoadImage = (
  { src, alt, placeholderText = "", onImgClick, onLoad, className, placeholderClass, placeholderTextStyle, imgClass, parentRef }: BackgroundImageProps) => {
  //! Animation Setup
	//? useResize height/width fits to window size even if user alters the size, e.g. phone tilting
  const { height, width } = useResize({ config: config.molasses }); //? Use a default tension/friction setting to control animation speed
  const [fadeOutSpring, fadeOutAPI] = useSpring(() => ({ from: { opacity: 1 } })); //* Setup the spring to use later
  const [fadeInSpring, fadeInAPI] = useSpring(() => ({ from: { opacity: 0 } })); //? Always use the start state BUT no 'to' key yet!
  const resizeAnimations = () => { height.start(500); width.start(500); }; //* Start on container
  const successAnimations = () => {
    resizeAnimations();
    const slowestSpring = { tension: 260 , friction: 260 };
    fadeInAPI.start({ from: { opacity: 0 }, to: { opacity: 1 }, config: slowestSpring });
    //* ALSO fade out the placeholder THEN once faded out, unmount it by setLoading(false)
    fadeOutAPI.start({ from: { opacity: 1 }, to: { opacity: 0 }, config: slowestSpring, onRest: () => setLoading(false) });
  };
  //! Actual state
  const [loading, setLoading] = useState(false);
  const [successfulLoad, setSuccessfulLoad] = useState(false);
  //! Lifecycle functions - useEffect called onMount + unmount
  useEffect(() => { setLoading(true); }, [src]); //? Call again if src changes
  const loadFinished = () => { //* event param not needed but can add in future if needed
    setSuccessfulLoad(true); //* Mark successful img load & remove placeholder
    successAnimations();
    if (onLoad) { onLoad(true); } //* Run parent's callback with success flag
  };
  const loadFailed = () => {
    if (src !== "") { resizeAnimations(); } // Resize placeholder if fail not due to bad URL
    setLoading(false); //* Let the hidden failed image behind it unmount, completely unseen
    if (onLoad) { onLoad(false); } //* Run parent's callback with fail flag
  };

  return (
    <animated.div className={`${BackgroundLoadImageCss.container} ${className || ""}`}
                  ref={parentRef} style={{ height, width }}>
      { (loading || !successfulLoad) && /* If loading, cover <img> or use as backup on fail */
        <PlaceholderImg loading={loading} className={`${BackgroundLoadImageCss.placeholder} ${placeholderClass || ""}`.trim()}
                        style={fadeOutSpring} textStyle={placeholderTextStyle}>
          { placeholderText }
        </PlaceholderImg>
      }
      { (loading || successfulLoad) && /* Let <img> load & show on success, else remove on fail */
        <animated.img src={(src == "") ? undefined : src} alt={alt} onClick={onImgClick}
                      onLoad={loadFinished} onError={loadFailed} style={fadeInSpring}
                      className={`${BackgroundLoadImageCss.photo} ${imgClass || ""}`.trim()} />
      }
    </animated.div>
  );
};

export default BackgroundLoadImage;
