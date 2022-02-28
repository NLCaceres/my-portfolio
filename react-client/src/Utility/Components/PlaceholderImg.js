import PlaceHolderImgCss from "./PlaceholderImg.module.css";

//* Goal: Use placeholder with a lazy loading effect
const PlaceHolderImg = props => {
  return (
    <div className={`${PlaceHolderImgCss.placeholderImg}`}>
      <h2 className={`${PlaceHolderImgCss.placeholderText}`}>Project</h2>
    </div>
  )
}

export default PlaceHolderImg;