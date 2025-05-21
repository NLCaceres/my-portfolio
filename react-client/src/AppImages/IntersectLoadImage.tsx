import { type ReactNode } from "react";
import BackgroundLoadImage from "./BackgroundLoadImage";
import { useInView } from "@react-spring/web";

type IntersectLoadImageProps = {
  src: string, alt: string, placeholderText?: ReactNode,
	onImgClick?: () => void, className?: string, imgClass?: string
};

/** An <img> that loads once the user crosses a percentage-based threshold of the component
 * @param {IntersectLoadImageProps} props IntersectLoadImage properties to handle:
 * Setting up the <img> src, alt text, and click listening as well as styling via
 * className and imgClass. Additionally, since the <img> won't begin loading until
 * on-screen, the placeholderText property is displayed while the <img> loads underneath */
const IntersectLoadImage = ({ src, alt, placeholderText, onImgClick, className, imgClass }: IntersectLoadImageProps) => {
	//* Use ref to attach to element and inView var to check if element threshold passed
  const [ref, inView] = useInView({ amount: 0.6, once: true });
  return (
    <BackgroundLoadImage src={inView ? src : ""} alt={alt} parentRef={ref}
                         className={className} placeholderText={placeholderText}
                         onImgClick={onImgClick} imgClass={imgClass} />
  );
};

export default IntersectLoadImage;
