import React from "react";
import Placeholder from "react-bootstrap/Placeholder"
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PostCardCss from "./PostCard.module.css";
import PlaceholderCss from "./PostCardPlaceholder.module.css";
import PlaceholderImg from "../AppImages/PlaceholderImg";

// @params: NumPlaceholders: Default is 4 cards rendered. Creates 4 item array + uses its indexes to map over
const PostCardPlaceholderList = ({ numPlaceholders = 4 }) => {
  return (
    <> {/*//! Starts with title and subtitle placeholders then renders "n" # of PlaceholderCards */}
      <Placeholder className="ms-2 my-2" animation="glow" as="div">
        <Placeholder xs={5} md={4} as="h1" className={`${PlaceholderCss.header}`}  />
      </Placeholder>
      <Placeholder className="ms-2 mb-2" animation="glow" as="div"> 
        <Placeholder xs={9} md={6} as="h1" className={`${PlaceholderCss.header}`} />
      </Placeholder>
      {/* No stable ID so use index for the following Placeholder Cards, should always render the same anyway */}
      { [...Array(numPlaceholders)].map((_, i) => <PostCardPlaceholder className={"mx-sm-4"} key={i} />) }
    </>
  );
}

const PostCardPlaceholder = ({ className, rowClasses }) => {
  return (
    <Card className={`${PostCardCss.postCard} ${PlaceholderCss.postCard} ${className || ""}`.trim()}>
      <Row className={`g-0 ${PlaceholderCss.cardRow} ${rowClasses || ""}`.trim()} data-testid="placeholder-row">
        <Col xs="12" md="3" lg="2" className="d-flex justify-content-center align-self-center"> 
          <PlaceholderImg /> 
        </Col>
        <Col xs="12" md="9" lg="10">
          <Card.Body className="px-4 px-md-3">
            <Placeholder as={Card.Title} animation="glow" className="ms-2">
              <Placeholder xs={8} className={`${PlaceholderCss.smallHeader}`} />
            </Placeholder>
            <Placeholder as={Card.Text} animation="glow">
              <Placeholder xs={6} /> <Placeholder xs={5} />
              <Placeholder xs={4} /> <Placeholder xs={6} /> <Placeholder xs={1} />
              <Placeholder xs={8} /> <Placeholder xs={3} />
              <Placeholder xs={8} />
            </Placeholder>
            <Placeholder animation="wave" as="div" className="ms-4 ms-md-3 mt-4 mt-md-5">
              <Placeholder.Button className={`${PostCardCss.githubLink} ${PostCardCss.blockButton} fw-bold`} xs={6}>
                Github Page
              </Placeholder.Button>
            </Placeholder>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
}

export default PostCardPlaceholderList;