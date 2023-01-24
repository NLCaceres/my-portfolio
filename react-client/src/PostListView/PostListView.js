import React from "react";
import PostCard from "./PostCard";
import CardImageModal from "../Modals/CardImageModal/CardImageModal";
import GetPostList from "../Api/ProjectAPI";
import { CamelCaseToUppercasePhrase, KebabToUppercasePhrase } from "../Utility/Functions/ComputedProps";
import PostCardListPlaceholder from "./PostCardPlaceholder";
import ConsoleLogger from "../Utility/Functions/LoggerFuncs";
//* 'Import' loads statically, so if grabbing json data from files in a particular dir, have to grab each file one by one
// import iOSProjects from "../TabPanelData/iOS.json";

//* Component: Lists posts, alternating left to right (May refactor for right start as an option)
class PostListView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      showModal: false,
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

  componentDidMount() {
    this.fetchProjects();
  }

  async componentDidUpdate(prevProps) { 
    //* If url changes should update project list (and ideally only then)
    if (this.props.location !== prevProps.location) {
      this.fetchProjects();
    }
  }

  async fetchProjects() {
    const splitUrlPath = this.props.location?.pathname?.split('/') ?? ['']; //* Should split into 3 ['','portfolio','tab-name']
    let qParams = (splitUrlPath[splitUrlPath.length - 1] === 'about-me') ? 'null' : splitUrlPath[splitUrlPath.length - 1].replace('-', '_');
    const projectList = await GetPostList(qParams);
    this.setState({ projectList: projectList }); //* Shallow merge projectList to projectList key with rest of state
  }

  openModal(project) {
    if (this.props.viewWidth < 768) { return } //* No modal rendered for mobile so end func here
    this.setState(prevState => ({
      showModal: !prevState.showModal,
      modalProject: project
    }));
  }

  render() {
    const splitUrlPath = this.props.location?.pathname?.split('/') ?? [''];
    const projectType = splitUrlPath[splitUrlPath.length - 1]; //* Split on '/' from url to get 3rd section, i.e. 'iOS', 'front-end', etc.
    const title = KebabToUppercasePhrase(projectType);

    return (
      (this.state.projectList?.majorProjects?.length > 0 || this.state.projectList?.minorProjects?.length > 0) ?
      (
        <div>
          { this.props.viewWidth >= 768 && (
            <CardImageModal onHide={ () => this.openModal(null) } show={ this.state.showModal }
              project={ this.state.modalProject } viewWidth={ this.props.viewWidth } />
          )}
          { title && <h1 className={`ms-2 mb-0 fw-normal ${(this.props.viewWidth > 768) ? 'display-3' : 'display-2'}`}>{ title }</h1> }
          <ProjectList projectType={ projectType } projectList={ this.state.projectList }
            viewWidth={ this.props.viewWidth } modalControl={ this.openModal } />
        </div>
      ) 
      : <PostCardListPlaceholder viewWidth={ this.props.viewWidth } />
    );
  }
}

//* ProjectList always returns an array of 2, the major projects list + the small projects list
//* EXCEPT in the case of the AboutMe page where it's the 1 section & gets a special header
const ProjectList = props => {
  return Object.keys(props.projectList).map((projectKey) => {
    const projectSize = CamelCaseToUppercasePhrase((projectKey === 'minorProjects') ? 'smallProjects' : projectKey);
    const aboutMeTitle = props.projectType === "about-me" ? "Nicholas L. Caceres" : null;

    //? CAN use nanoid, shortid, uuid pkgs for keys on lists or id on forms BUT obj/class props = best
    return ( props.projectList[projectKey].length > 0 && (
        <div key={`${props.projectType} ${projectSize}`}>
          <h1 className={`ms-2 my-1 fw-normal ${(props.viewWidth > 768) ? 'display-3' : 'display-2'}`}>{ aboutMeTitle || projectSize }</h1>
          <ProjectSection postCardClasses="mx-sm-4" projects={ props.projectList[projectKey] }
            viewWidth={ props.viewWidth } modalControl={ props.modalControl }/>
        </div>
      )
    );
  });
};

//* Project Section returns the list of either major or small projects 
//* On small screens the cards are always setup left to right. On big screens, they zig-zag (left to right / right to left)
//* If no posts are returned from the server, a fallback Not Found Component will render
const ProjectSection = props => {
  return (Array.isArray(props.projects) && props.projects?.length > 0) && //* Rails will ALWAYS return array (even if only 1 post returned)
    props.projects.map((project, i) => {
      const reversed = (props.viewWidth < 768 || i % 2 === 0) ? '' : 'flex-row-reverse';
      const modalRendered = (props.viewWidth >= 768 && project.post_images?.length > 1);
      return <PostCard className={ props.postCardClasses } rowClasses={ reversed }
        project={ project } viewWidth={ props.viewWidth } key={ project.title } 
        handleImgClick={ () => { if (modalRendered) props.modalControl(project) } } />
    }
  )
};

export default PostListView;
