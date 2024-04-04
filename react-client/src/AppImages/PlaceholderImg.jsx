import { animated } from "@react-spring/web"
import PlaceholderImgCss from "./PlaceholderImg.module.css";
import AppSpinner from "../AppSpinner/AppSpinner";
import IsString from "lodash/isString";

//* Simple placeholder that displays text and spinner if used during a loading event
const PlaceholderImg = ({ loading, children, className, style, textStyle }) => {
  const childElem = (children === undefined || IsString(children)) //* If a string, use the default h2 tag
    ? <animated.h2 className={`${PlaceholderImgCss.placeholderText}`} style={textStyle}>{ children || "Project" }</animated.h2>
    : children //* Otherwise, it's expected to be a JSX element so insert it into the DOM
  return (
    <animated.div className={`${PlaceholderImgCss.placeholderImg} ${className || ""}`} style={{ ...style }}>
      { loading && <AppSpinner className="mb-2" color="secondary" /> }
      { childElem }
    </animated.div>
  )
}

export default PlaceholderImg;