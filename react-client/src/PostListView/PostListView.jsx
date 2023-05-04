import React, { useCallback, useState } from "react";
import { useLocation } from "react-router-dom";
import useViewWidth from "../ContextProviders/ViewWidthProvider";
import PostCard from "./PostCard";
import CardImageModal from "../Modals/CardImageModal";
import PostCardPlaceholderList from "./PostCardPlaceholder";
import UseNullableAsync from "../Hooks/UseAsync";
import GetPostList from "../Api/ProjectAPI";
import { CamelCaseToUppercasePhrase, KebabToUppercasePhrase } from "../Utility/Functions/ComputedProps";
import ConsoleLogger from "../Utility/Functions/LoggerFuncs";
//* "Import" loads statically, so if grabbing json data from files in a particular dir, have to grab each file one by one
// import iOSProjects from "../TabPanelData/iOS.json";

//* Component: Lists posts, alternating left to right (May refactor for right start as an option)
const PostListView = () => {
  //! React-Router hooks + its computed props
  const location = useLocation(); //? Grab pathname & slice() off trailing slashes or just grab the whole path ("/foo/bar/" vs "/foo/bar")
  if (location.pathname === "/") { window.history.replaceState(null, "", "/portfolio/about-me") }
  const path = (location.pathname === "/") ? "/portfolio/about-me" : //* Handle coming from "/" route. Else handle trailing "/portfolio/foo/"
    (location.pathname.slice(-1) === "/") ? location.pathname.slice(0, -1) : location.pathname; //* Else all other "/portfolio/foo" routes
  const splitUrlPath = path.split("/") ?? [""]; //* Should split into 3 ["", "portfolio", "tab-name"]
  const projectType = splitUrlPath[splitUrlPath.length - 1]; //* Split on "/" from url to get last section, i.e. "iOS", "front-end", etc.
  const title = KebabToUppercasePhrase(projectType);

  //! Computed Props of this component
  const viewWidth = useViewWidth();

  //! State of this component: ModalState + ProjectList
  const [projectList, setProjectList] = useState({ majorProjects: [], minorProjects: [] });
  const [modalState, setModalState] = useState({ showModal: false, modalProject: null });
  const openModal = (newProject) => {
    if (viewWidth < 768) { return } //* No modal rendered for mobile so end func here
    setModalState(prevState => ({ showModal: !prevState.showModal, modalProject: newProject }));
  }
  
  UseNullableAsync(useCallback(async () => { //? useCallback is important AND if wanted, can be a separate "const" var like openModal
    const qParams = (projectType === "about-me") ? "null" : projectType.replace("-", "_");
    return GetPostList(qParams);
  }, [projectType]), setProjectList);

  return (
    (projectList?.majorProjects?.length > 0 || projectList?.minorProjects?.length > 0) ?
    (
      <div>
        { viewWidth >= 768 && ( //? ImageModal is completely unmounted until img click mounts it then injects project images list
          <CardImageModal onHide={ () => openModal(null) } show={ modalState.showModal } project={ modalState.modalProject } />
        )}
        { title && <h1 className={`ms-2 mb-0 fw-normal ${(viewWidth > 768) ? "display-3" : "display-2"}`}>{ title }</h1> }
        <ProjectList projectType={ projectType } projectList={ projectList } viewWidth={ viewWidth } modalControl={ openModal } />
      </div>
    )
    : <PostCardPlaceholderList />
  );
}

//* ProjectList always returns an array of 2, the major projects list + the small projects list
//* EXCEPT in the case of the AboutMe page where it's the 1 section & gets a special header
const ProjectList = ({ modalControl, projectList, projectType, viewWidth }) => {
  return Object.keys(projectList).map((projectKey) => {
    const projectSize = CamelCaseToUppercasePhrase((projectKey === "minorProjects") ? "smallProjects" : projectKey);
    const aboutMeTitle = projectType === "about-me" ? "Nicholas L. Caceres" : null;

    //? CAN use nanoid, shortid, uuid pkgs for keys on lists or id on forms BUT obj/class props = best
    return ( projectList[projectKey].length > 0 && (
        <div key={`${projectType} ${projectSize}`}>
          <h1 className={`ms-2 my-1 fw-normal ${(viewWidth > 768) ? "display-3" : "display-2"}`}>{ aboutMeTitle || projectSize }</h1>
          <ProjectSection postCardClasses="mx-sm-4" projects={ projectList[projectKey] } viewWidth={ viewWidth } modalControl={ modalControl } />
        </div>
      )
    );
  });
};

//* Project Section returns the list of either major or small projects
//* On small screens the cards are always setup left to right. On big screens, they zig-zag (left to right / right to left)
//* If no posts are returned from the server, a fallback Not Found Component will render
const ProjectSection = ({ modalControl, projects, viewWidth, postCardClasses }) => {
  return (Array.isArray(projects) && projects?.length > 0) && //* Rails will ALWAYS return array (even if only 1 post returned)
    projects.map((project) => {
      const modalRendered = (viewWidth >= 768 && project.post_images?.length > 1);
      return <PostCard key={ project.title } className={ postCardClasses } 
        project={ project } onImgClick={ () => { if (modalRendered) modalControl(project) } } />
    }
  );
};

export default PostListView;
