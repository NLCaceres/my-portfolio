import PostCardCss from "./PostCard.module.css";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PlaceholderImg from "../AppImages/PlaceholderImg";
import AppCarousel from "../AppCarousel/AppCarousel";
import IntersectLoadImage from "../AppImages/IntersectLoadImage";
import useViewWidth from "../ContextProviders/ViewWidthProvider";
import type Project from "../Data/Models/Project";

//? Type Intersection is a nice alternative to typical interface based inheritance/extension
type BasePostCardProps = {
  project: Project
};
//? One slight issue is how VSCode sees the type hint
type PostCardWithImgProps = BasePostCardProps & {
  onImgClick: () => void
};
type StyledImgPostCardProps = PostCardWithImgProps & {
  className?: string,
  rowClasses?: string
};
//? The other actual issue is Type Intersections allow name conflicts on declaration BUT will forbid explicit creation
//? Interfaces will display an error on declaration AND, of course, not be creatable

//@params: Following = Expected Props -  project (a data prop)
//@params: onImgClick (img elem click hook)
//@params: className (root element classes), rowClasses (Row container classes)
const PostCard = ({ project, onImgClick, className, rowClasses }: StyledImgPostCardProps) => {
  return (
    //? data-testid = simple data attributes used in tests. Can remove via babel BUT no harm in being left in prod
    <Card className={`${PostCardCss.postCard} ${className || ""}`.trim()} data-testid="post-card">
      <Row className={`g-0 ${rowClasses || ""}`.trim()} data-testid="post-card-row">
        <Col xs="12" md="3" lg="2" className="d-flex justify-content-center">
          <CardImage project={ project } onImgClick={ onImgClick }/>
        </Col>
        <Col xs="12" md="9" lg="10" className="px-1">
          <CardDetails project={ project } />
        </Col>
      </Row>
    </Card>
  );
};

//@params: Passed down props - project, onImgClick
const CardImage = ({ project, onImgClick }: PostCardWithImgProps) => { //* Save a line & destructure props param in the func call!
  const viewWidth = useViewWidth();
  const postImages = project.post_images ?? [];
  const placeholderText = (project.id?.toString() === import.meta.env.VITE_ABOUT_ME_ID) ? "My Photo" : "Project Photo";
  //* If receiving an empty array or no images in the array then render placeholder (Likely Rails will always send at least an empty [])
  if (postImages.length === 0) { return <PlaceholderImg>{ placeholderText }</PlaceholderImg>; }

  //* One small issue with the following: onRender, you either get a Carousel or an IntersectLoadImg
  //* BUT what happens with a mobile phone going from vertical to horizontal?
  //* Posts with more than 1 image, flip from a Carousel to a single representative IntersectLoadImg!
  //* WHICH means completely reloading the rep img every single time the viewWidth changes
  //? Fix? useMemo on the rep child? Or finally drop Bootstrap's carousel and write my own implementation? (See "AppCarousel.jsx")
  if (viewWidth < 768 && postImages.length > 1) { //* If received multiple images + small screen, then just render a carousel
    return (
      <AppCarousel className={ PostCardCss.imgTopMargin }>
        { postImages.map(image => {
          return (
            <div className="carousel-item" key={ image.image_url }>
              <IntersectLoadImage src={ image.image_url } alt={ image.alt_text } placeholderText={ placeholderText }
                className={`${PostCardCss.cardImgContainer} mx-auto`} />
            </div>
          );
        })}
      </AppCarousel>
    );
  }

  let classString = `${PostCardCss.cardImgContainer} ${PostCardCss.imgTopMargin}`; //* Base classList
  if (viewWidth >= 992 && postImages.length > 1) { classString += ` ${PostCardCss.clickable}`; } //* Add in CSS at specific viewport width
  return ( //* At desktop sizes, render a single image that can open a modal if the project has multiple imgs
    <IntersectLoadImage src={ postImages[0].image_url } alt={ postImages[0].alt_text }
      placeholderText={ placeholderText } onImgClick={ onImgClick } className={ classString } />
  );
};

//@params: Passed down props - project
const CardDetails = ({ project }: BasePostCardProps) => {
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
  );
};

export default PostCard;