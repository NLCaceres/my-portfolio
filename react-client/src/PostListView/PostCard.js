import cnames from "classnames";
import PostCardCss from './PostCard.module.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PlaceHolderImg from "../Utility/Components/PlaceholderImg";
import SimpleCarousel from "../SimpleCarousel/SimpleCarousel";

//@params: Following = Expected Props - className (root element classes)
//@params: rowClasses (Row container classes), viewWidth (helps add responsive behavior in children)
//@params: project (a data prop), handleImgClick (img elem click hook)
const PostCard = props => {
  return (
    //? data-testid = simple data attributes used in tests. Can remove via babel BUT no harm in being left in prod
    <Card className={`${PostCardCss.postCard} ${props.className || ''}`.trim()} data-testid="post-card">
      <Row className={`no-gutters ${props.rowClasses || ''}`.trim()} data-testid="post-card-row">
        <Col xs="12" md="3" lg="2" className="d-flex justify-content-center">
          <CardImage project={ props.project } viewWidth={ props.viewWidth } handleClick={ props.handleImgClick }/>
        </Col>
        <Col xs="12" md="9" lg="10">
          <CardDetails project={ props.project } viewWidth={ props.viewWidth } />
        </Col>
      </Row>
    </Card>
  );
};

//@params: Passed down props - project, viewWidth, handleImgClick
const CardImage = props => {
  const { project, viewWidth, handleClick } = props; //* Rather than 'const project = props.project'. Destructure!
  let imageType; 
  if (Array.isArray(project.post_images) && project.post_images.length > 0) { //* Rails should ALWAYS send Arr but safer to check
    //* If multiple images (above) + small screen, then carousel. 
    //* Else big screen OR single image, then single (possibly clickable) image
    imageType = (viewWidth < 768 && project.post_images.length > 1) ? 
      <SimpleCarousel images={ project.post_images } viewWidth={ viewWidth } /> :
      <img className={ cnames(`align-self-center ${ PostCardCss.cardImg }`,
          { [PostCardCss.clickable]: viewWidth >= 992 && project.post_images.length > 1 }
        )} onClick={ handleClick }
        src={ project.post_images[0].image_url } alt={ project.post_images[0].alt_text } />
  } 
  else { imageType = <PlaceHolderImg /> } //* If no images then render placeholder

  return imageType;
}

//@params: Passed down props - project, viewWidth
const CardDetails = props => {
  const { project, viewWidth } = props; 

  return (
    <Card.Body>
      <Card.Title as="h5" className="ms-2 fw-bold">
        { project.title }
      </Card.Title>
      <Card.Text className={ cnames(PostCardCss.cardText) }>
        { project.description }
      </Card.Text>
      <Button href={ project.github_url }
        className={ cnames(PostCardCss.githubLink, PostCardCss.blockButton,
          "fw-bold", { "d-block": viewWidth >= 992 }
        )}>
          Github Page
      </Button>
      { project.homepage_url && (
        <Button className={`fw-bold ${PostCardCss.blockButton} ${(viewWidth < 992) ? 
          'ms-4' : 'd-block mt-4'} ${PostCardCss.pageLink}`} href={ project.homepage_url }>
            Home Page
        </Button>
      )}
    </Card.Body>
  )
}

export default PostCard;