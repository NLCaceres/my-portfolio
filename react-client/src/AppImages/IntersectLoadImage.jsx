import BackgroundLoadImage from "./BackgroundLoadImage";
import { useInView } from "@react-spring/web";

/*//* An image that begins loading once the user crosses a threshold of the element containing the BackgroundLoadingImage used  */
const IntersectLoadImage = ({ src, alt, placeholderText, onImgClick, className, imgClass }) => {
  const [ref, inView] = useInView({ threshold: 0.6, once: true }); //* ref attaches to element while inView simply notifies us when the threshold is crossed
  return (
    <BackgroundLoadImage src={inView ? src : ""} alt={alt} parentRef={ref} className={className}
      placeholderText={placeholderText} onImgClick={onImgClick} imgClass={imgClass} />
  )
}

export default IntersectLoadImage;