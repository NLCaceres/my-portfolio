import React, { useEffect, useState } from "react";
import PlaceholderImg from "./PlaceholderImg";
import BackgroundLoadImageCss from "./BackgroundLoadImage.module.css";
import ConsoleLogger from "../Functions/LoggerFuncs";

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
const BackgroundLoadImage = ({src, alt, placeholderText, onLoad, className, placeholderClass, imgClass}) => {
  const [loading, setLoading] = useState(false);
  const [successfulLoad, setSuccessfulLoad] = useState(false)

  useEffect(() => {
    setLoading(true);
  }, []);
  const loadFinished = () => { //* event param not needed but can add in future if needed
    setSuccessfulLoad(true); //* If loadFinished runs, we should have a visible image, so mark it and remove placeholder cover
    setLoading(false); //* Loading completed
    if (onLoad) { onLoad(true) }
  }
  const loadFailed = () => { 
    setLoading(false);
    if (onLoad) { onLoad(false) }
  }

  return (
    <div className={`${BackgroundLoadImageCss.container} ${className || ""}`}>
      { (loading || !successfulLoad) && /*//* Cover img tag when loading and display as backup if load failed or threw errors */
        <PlaceholderImg loading={loading} className={`${BackgroundLoadImageCss.placeholder} ${placeholderClass || ""}`}> 
          { placeholderText }
        </PlaceholderImg>
      }
      { (loading || successfulLoad) && /*//* Once loading, let the image load! If the src url fails, then remove the img! */
        <img src={src} alt={alt} onLoad={loadFinished} onError={loadFailed} className={`${BackgroundLoadImageCss.photo} ${imgClass || ""}`} />
      }
    </div>
  )
}

export default BackgroundLoadImage;