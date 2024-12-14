import { type PropsWithChildren } from "react";
import { animated } from "@react-spring/web";
import PlaceholderImgCss from "./PlaceholderImg.module.css";
import AppSpinner from "../AppSpinner/AppSpinner";
import { IsString } from "../Utility/Typings/TypePredicates";
import { type AnimatableStyle } from "../Utility/Typings/ReactSpringTypes";

//? Making all props optional allows the Func Component to set each prop's defaults to non-optional values,
//? WHICH makes it possible to just use the component like `<PlaceholderImg />`
//? WITHOUT worrying much about getting `undefined` unless you explicitly set a prop to `undefined`
type PlaceholderImgProps = { loading?: boolean, className?: string, style?: AnimatableStyle, textStyle?: AnimatableStyle };

//* Simple placeholder that displays text and spinner if used during a loading event
const PlaceholderImg = ({ loading = false, children, className = "", style = undefined, textStyle = undefined }: PropsWithChildren<PlaceholderImgProps>) => {
  const childElem = (children === undefined || IsString(children)) //* If a string, use the default h2 tag
    // @ts-expect-error React-Spring needs to update to React 19 types
    ? <animated.h2 className={`${PlaceholderImgCss.placeholderText}`} style={textStyle}>{ children || "Project" }</animated.h2>
    : children; //* Otherwise, it's expected to be a JSX element so insert it into the DOM
  return ( // @ts-expect-error React-Spring needs to update to React 19 types
    <animated.div className={`${PlaceholderImgCss.placeholderImg} ${className}`.trim()} style={{ ...style }}>
      { loading && <AppSpinner className="mb-2" color="secondary" /> }
      { childElem }
    </animated.div>
  );
};

export default animated(PlaceholderImg);
