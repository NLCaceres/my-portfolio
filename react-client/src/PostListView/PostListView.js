import React from "react";
import { Row, Col, Card, CardText, CardBody, CardTitle, Button } from "reactstrap";
import SimpleCarousel from "../SimpleCarousel/SimpleCarousel";
import CardImageModal from "../Modals/CardImageModal/CardImageModal";
import cnames from "classnames";
import PostlistCss from "./PostList.module.css";
//* 'Import' loads statically, so if grabbing json data from files in a particular dir, have to grab each file one by one
// import iOSProjects from "../TabPanelData/iOS.json";

//* Component: Lists posts, alternating left to right (May refactor for right start as an option)
class PostListView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      modal: false,
      modalProject: null,
      projectList: {
        majorProjects: [],
        minorProjects: []
      } //? Without initing all used state, will get errs
    };

    //? These days with ES6 classes, Not sure bind() is needed anymore BUT it does seem to 
    //? At the very least increase performance by ensuring funcs only created ONCE
    this.openModal = this.openModal.bind(this);
    this.fetchProjects = this.fetchProjects.bind(this);
  }

  async componentDidMount() {
    this.fetchProjects();
  }

  async componentDidUpdate(prevProps) { 
    //* If url changes should update project list (and ideally only then)
    if (this.props.location !== prevProps.location) {
      this.fetchProjects();
    }
  }

  async fetchProjects() {
    let qParams = (this.props.location.pathname === '/about-me') ? 'null' : this.props.location.pathname.slice(1).replace('-', '_'); 
    const httpResponse = await fetch(`/api/posts?project_type=${qParams}`, { headers: { "Accept": "application/json" } });
    const jsonResponse = await httpResponse.json();
    if (jsonResponse.status === 500 || jsonResponse.status === 404) return;

    const projectList = { ...this.state.projectList }; //* Common react pattern: Spread another obj into a new obj!

    if (Array.isArray(jsonResponse)) {
      projectList.majorProjects = jsonResponse.filter(project => project["project_size"] === "major_project");
      projectList.minorProjects = jsonResponse.filter(project => project["project_size"] === "small_project");
    } 
    else { projectList.majorProjects.unshift(jsonResponse); }
    
    this.setState({ projectList: projectList }); //* Shallow merge projectList to projectList key with rest of state 
  }

  openModal(project) {
    if (project === null) {
      this.setState(prevState => ({
        modal: !prevState.modal
      }));
    } else {
      if (this.props.viewWidth < 768) { return } //* No modal rendered for mobile so end func here
      this.setState(prevState => ({
        modal: !prevState.modal,
        modalProject: project
      }));
    }
  }

  render() {
    const titleArr = this.props.location.pathname.slice(1).split('-');
    let title; for (let word of titleArr) {
      if (word === 'iOS') { title = word; break; } //* Only case where no capital first letter needed
      title = (title ?? '') + ' ' + word.charAt(0).toUpperCase() + word.slice(1);
    }
    return (
      (this.state.projectList.majorProjects.length > 0 || this.state.projectList.minorProjects.length > 0) && 
      (
        <div>
          { this.props.viewWidth >= 768 && (
            <CardImageModal modalControl={ this.openModal } isModalOpen={ this.state.modal }
              project={ this.state.modalProject } viewWidth={ this.props.viewWidth } />
          )}
          <h1 className="ml-2 mb-0">{title.trim()}</h1>
          <ProjectList tabId={ this.props.tabId } projectList={ this.state.projectList }
            viewWidth={ this.props.viewWidth } modalControl={ this.openModal } />
        </div>
      )
    );
  }
}

const ProjectList = props => {
  //? CAN use nanoid, shortid, uuid pkgs for keys on lists or id on forms BUT often times obj/class properties are best
  return Object.values(props.projectList).map((projects, i) => {
    const projectSize = i === 0 ? "Major Projects" : "Small Projects";
    const aboutMeTitle = props.tabId === "About Me!" ? "Nicholas L. Caceres" : null;
    const projectSectionKey = props.tabId + " " + projectSize;
    return ( projects.length > 0 && (
        <div key={ projectSectionKey }>
          <h1 className="ml-2 my-1">{ aboutMeTitle || projectSize }</h1>
          <ProjectSection className="mx-sm-4" projects={ projects }
            viewWidth={ props.viewWidth } modalControl={ props.modalControl }/>
        </div>
      )
    );
  });
};

const ProjectSection = props => {
  const projects = props.projects;
  if (Array.isArray(projects)) {
    return projects.map((project, i) => {
      if (i % 2 === 0 || props.viewWidth < 768) {
        return (
          <LeftSidedCardPost className={`${props.className}`} project={ project }
            key={ project.title } modalControl={ props.modalControl } 
            viewWidth={ props.viewWidth } />
        );
      } else {
        return (
          <RightSidedCardPost className={`${props.className}`} project={ project }
            key={ project.title } modalControl={ props.modalControl } 
            viewWidth={ props.viewWidth } />
        );
      }
    });
  } else {
    return (
      <LeftSidedCardPost className={`${props.className}`} key={ projects.name }
        project={ projects } viewWidth={ props.viewWidth } />
    );
  }
};

const LeftSidedCardPost = props => {
  const project = props.project;
  const postImagesLength = project.post_images.length;
  const imageSrc = postImagesLength > 0 ? project.post_images["0"].image_url : "No img";
  const imageAlt = postImagesLength > 0 ? project.post_images["0"].alt_text : "Placeholder";
  const backupImgCheck =
    imageSrc === "https://via.placeholder.com/350.png?text=Profile" ||
    imageSrc === "https://via.placeholder.com/350.png?text=Project";
  const aboutMeTitleCheck = project.title !== "Aspiring Jack of All Trades";
  return (
    <>
      <Card className={`${PostlistCss.postCard} ${props.className}`}>
        <Row noGutters>
          <Col xs="12" md="2" className="d-flex justify-content-center">
            { props.viewWidth >= 768 || postImagesLength <= 1 ? (
              <img className={ cnames(`align-self-center ${ (backupImgCheck) ?
                  PostlistCss.cardImgBackupStyle : PostlistCss.cardImg }`,
                  { [PostlistCss.clickable]: props.viewWidth >= 992 && aboutMeTitleCheck && postImagesLength > 1 }
                )}
                src={ imageSrc || project.post_images } alt={ imageAlt }
                onClick={ () => { if (aboutMeTitleCheck && postImagesLength > 1) props.modalControl(project) }}
                onError={ e => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/350.png?text=Project";
                  e.target.style.height = "100%";
                }}
              />
            ) : (<SimpleCarousel images={ project.post_images } viewWidth={ props.viewWidth } />)
            }
          </Col>
          <Col xs="12" md="10">
            <CardBody>
              <CardTitle tag="h5" className="ml-2 font-weight-bold">
                { project.title }
              </CardTitle>
              <CardText className={ cnames(PostlistCss.cardText) }>
                { project.description }
              </CardText>
              <Button href={ project.github_url }
                className={ cnames(PostlistCss.githubLink, PostlistCss.blockButton,
                  "font-weight-bold", { "d-block": props.viewWidth >= 992 }
                )}>
                  Github Page
              </Button>
              { project.homepage_url != null && (
                <Button className={`font-weight-bold ${PostlistCss.blockButton} ${(props.viewWidth < 992) ? 
                  'ml-4' : 'd-block mt-4'} ${PostlistCss.pageLink}`} href={ project.homepage_url }>
                    Home Page
                </Button>
              )}
            </CardBody>
          </Col>
        </Row>
      </Card>
    </>
  );
};

const RightSidedCardPost = props => {
  const project = props.project;
  const postImagesLength = project.post_images.length;
  const imageSrc = postImagesLength > 0 ? project.post_images["0"].image_url : "No img";
  const imageAlt = postImagesLength > 0 ? project.post_images["0"].alt_text : "Placeholder";
  return (
    <>
      <Card className={`${PostlistCss.postCard} ${props.className}`}>
        <Row noGutters>
          <Col xs="12" md="10">
            <CardBody>
              <CardTitle tag="h5" className="ml-2 font-weight-bold">
                { project.title }
              </CardTitle>
              <CardText className="">{ project.description }</CardText>
              <Button href={ project.github_url } 
                className={ cnames(PostlistCss.githubLink, PostlistCss.blockButton,
                  "font-weight-bold", { "d-block": props.viewWidth >= 992 }
                )}>
                  Github Page
              </Button>
              { project.homepage_url != null && (
                <Button className={`font-weight-bold ${PostlistCss.blockButton} ${(props.viewWidth < 992) ? 
                  'ml-4' : 'd-block mt-4'} ${PostlistCss.pageLink}`} href={ project.homepage_url }>
                    Home Page
                </Button>
              )}
            </CardBody>
          </Col>
          <Col xs="12" md="2" className="d-flex justify-content-center">
            <img className={ cnames("align-self-center", PostlistCss.cardImg, {
                [PostlistCss.clickable]: props.viewWidth >= 768 && postImagesLength > 1
              })}
              src={ imageSrc } alt={ imageAlt }
              onClick={ () => { if (postImagesLength > 1) props.modalControl(project) }}
              onError={ e => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/350.png?text=Project";
                e.target.style.height = "100%";
              }}
            />
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default PostListView;
