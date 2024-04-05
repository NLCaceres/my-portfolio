import { type SpringValue } from "@react-spring/web";
import { CSSProperties } from "react";

//* React-Spring provides the animated() HOC func to apply its SpringValue animations to any component that accepts a style prop
//* Ex: const AnimatedPlaceholderImg = animated(PlaceholderImg) from const PlaceholderImg = ({ style }) => <div style={{ ...style }}> </div>
//* Ex: <AnimatedPlaceholderImg style={springValues} /> where style can now accept regular CSSProperties OR SpringValues
//* On the other hand, the following won't work: const SomeStylelessComponent = () => <div>Hello World</div>
//* used like const AnimatedSomeComponent = animated(SomeStylelessComponent) would NOT be animated since no style prop is applied anywhere

//* BUT what if there are multiple style props, i.e. `style` applies to the root while `textStyle` applies to an inner <p>
//* THEN React-Spring will just apply the animatable SpringValues to the root, completely missing the <p> tag
//* So how do you type out `textStyle`?
//* SpringValues<{ x: SpringValue<number>, transform: SpringValue<transform>}> --> Too complicated and difficult to re-use
//* CSSProperties --> SpringValues are technically just that right? NOPE! React-Spring expands React's style definition to allow it to handle SpringValues

//* One possible option seems to be to create a whole new target for React-Spring, so I can enhance the animated() HOC func
//* BUT this seems like overkill since it handles the ReactRenderer directly, not your Components themselves, even if setAttribute() might allow this

//* Instead, it's simpler and probably smarter to leverage Typescript's Record utility type to catch the most common SpringValue<T> types
//* SINCE most of React-Spring's hooks seem to return an object filled with symbol keys tied to SpringValues
//* SO GENERALLY, SpringValues can be the following, containing either a number or a string - SpringValue<number> or SpringValue<string>
export type CommonSpringValueDict = SpringValueDict<string | number>;

//* BUT in case there's some other SpringValue type I haven't seen returned yet, a generic version under the hood is useful!
export type SpringValueDict <T> = Record<symbol, SpringValue<T>>;

//* AND since React-Spring just expands the style prop definition, I can use a union to do similar
export type AnimatableStyle = CSSProperties | CommonSpringValueDict;
//* WHICH solves the problem of passing down React-Spring's hook SpringValue style values
//* through my components until they reach a React-Spring's animated components
//* Ex: <PlaceholderImg textStyle={{ color: "red" }} /> - No problem passing common style directly
//* Ex: <PlaceholderImage textStyle={springStyle} /> - where springStyle == { height: SpringValue<number>, width: SpringValue<number> }
//* So inside <PlaceholderImage> you can use <animated.div style={{...style}}>Hello World!</div>
//* CAVEAT: The union makes it a choice, either pass an animated SpringValue-based style object or normal CSS style object, no mix/matching