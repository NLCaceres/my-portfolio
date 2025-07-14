import { type PropsWithChildren } from "react";
import { animated } from "@react-spring/web";
import PlaceholderImgCss from "./PlaceholderImg.module.css";
import AppSpinner from "../AppSpinner/AppSpinner";
import { IsString } from "../Utility/Typings/TypePredicates";
import { type AnimatableStyle } from "../Utility/Typings/ReactSpringTypes";

//? Make all props optional to let the component set defaults as non-optional values
//? Making it possible to use the component as a simple `<PlaceholderImg />`
//? With no unexpected `undefined` props UNLESS explicitly set to `undefined`
type PlaceholderImgProps = {
  loading?: boolean, className?: string,
  style?: AnimatableStyle, textStyle?: AnimatableStyle
};

//* Simple placeholder that displays text and spinner if used during a loading event
const PlaceholderImg = ({
  loading = false, children, className = "", style = undefined, textStyle = undefined
}: PropsWithChildren<PlaceholderImgProps>) => {
  const childElem = (children === undefined || IsString(children)) ? // Need <h2> for strings
    <animated.h2 className={`${PlaceholderImgCss.placeholderText}`} style={{ ...textStyle }}>
      { children || "Project" }
    </animated.h2>
    : children; //* OR it must be any old JSX Element that should just be inserted normally
  return (
    <animated.div className={`${PlaceholderImgCss.placeholderImg} ${className}`.trim()}
                  style={{ ...style }}>
      { loading && <AppSpinner className="mb-2" color="secondary" /> }
      { childElem }
    </animated.div>
  );
};

export default animated(PlaceholderImg);
