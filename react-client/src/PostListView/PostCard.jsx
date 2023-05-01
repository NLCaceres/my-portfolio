import PostCardCss from "./PostCard.module.css";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PlaceholderImg from "../AppImages/PlaceholderImg";
import AppCarousel from "../AppCarousel/AppCarousel";
import IntersectLoadImage from "../AppImages/IntersectLoadImage";
import ConsoleLogger from "../Utility/Functions/LoggerFuncs";

//@params: Following = Expected Props - className (root element classes)
//@params: rowClasses (Row container classes), viewWidth (helps add responsive behavior in children)
//@params: project (a data prop), onImgClick (img elem click hook)
const PostCard = ({ project, onImgClick, className, rowClasses, viewWidth }) => {
  return (
    //? data-testid = simple data attributes used in tests. Can remove via babel BUT no harm in being left in prod
    <Card className={`${PostCardCss.postCard} ${className || ""}`.trim()} data-testid="post-card">
      <Row className={`g-0 ${rowClasses || ""}`.trim()} data-testid="post-card-row">
        <Col xs="12" md="3" lg="2" className="d-flex justify-content-center">
          <CardImage project={ project } viewWidth={ viewWidth } onImgClick={ onImgClick }/>
        </Col>
        <Col xs="12" md="9" lg="10" className="px-1">
          <CardDetails project={ project } />
        </Col>
      </Row>
    </Card>
  );
};

//@params: Passed down props - project, viewWidth, onImgClick
const CardImage = ({ project, viewWidth, onImgClick }) => { //* Save a line & destructure props param in the func call!
  const placeholderText = (project.id?.toString() === process.env.REACT_APP_ABOUT_ME_ID) ? "My Photo" : "Project Photo"
  //* If receiving an empty array or no images in the array then render placeholder (Likely Rails will always send at least an empty [])
  if (!Array.isArray(project.post_images) || project.post_images.length === 0) { return <PlaceholderImg children={placeholderText} /> }

  if (viewWidth < 768 && project.post_images.length > 1) { //* If received multiple images + small screen, then just render a carousel
    return (
      <AppCarousel className={ PostCardCss.imgTopMargin }> 
        { project.post_images.map(image => {
          return (
            <div className="carousel-item" key={ image.image_url }> 
              <IntersectLoadImage src={ image.image_url } alt={ image.alt_text } placeholderText={ placeholderText }
                className={`${PostCardCss.cardImgContainer} mx-auto`} /> 
            </div>
          )
        })}
      </AppCarousel>
    )
  }

  let classString = `${PostCardCss.cardImgContainer} ${PostCardCss.imgTopMargin}`; //* Base classList
  if (viewWidth >= 992 && project.post_images.length > 1) { classString += ` ${PostCardCss.clickable}` } //* Add in CSS at specific viewport width
  return ( //* At desktop sizes, render a single image that can open a modal if the project has multiple imgs
    <IntersectLoadImage src={ project.post_images[0].image_url } alt={ project.post_images[0].alt_text }
      placeholderText={ placeholderText } onImgClick={onImgClick} className={classString} />
  )
}

//@params: Passed down props - project
const CardDetails = ({ project }) => {
  return (
    <Card.Body>
      <Card.Title as="h5" className="ms-2 fw-bold">
        { project.title }
      </Card.Title>
      <Card.Text className={ PostCardCss.cardText }>
        { project.description }
      </Card.Text>
      <Button href={ project.github_url } className={`${PostCardCss.githubLink} ${PostCardCss.blockButton}
        fw-bold ms-4 ms-md-3 mt-3 mt-md-4`}> { /* "mt-3" used to resemble postCardPlaceholder's margins */}
          Github Page
      </Button>
      { project.homepage_url && (
        <Button className={`${PostCardCss.blockButton} ${PostCardCss.pageLink}
          fw-bold ms-2 ms-md-4 mt-3 mt-md-4`} href={ project.homepage_url }>
            Home Page
        </Button>
      )}
    </Card.Body>
  )
}

export default PostCard;