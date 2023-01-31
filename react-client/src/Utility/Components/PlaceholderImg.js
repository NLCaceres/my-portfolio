import PlaceholderImgCss from "./PlaceholderImg.module.css";
import AppSpinner from "./AppSpinner";

//* Simple placeholder that displays text and spinner if used during a loading event
const PlaceholderImg = ({ className, children, loading }) => {
  return (
    <div className={`${PlaceholderImgCss.placeholderImg} ${className || ""}`}>
      { loading && <AppSpinner className="mb-2" color="secondary" /> }
      <h2 className={`${PlaceholderImgCss.placeholderText}`}>{ children || "Project" }</h2>
    </div>
  )
}

export default PlaceholderImg;