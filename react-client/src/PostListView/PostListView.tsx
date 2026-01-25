//import { useCallback, useEffect, /*useState*/ } from "react";
import useViewWidth from "../ContextProviders/ViewWidthProvider";
import PostCard from "./PostCard";
import PostCardPlaceholderList from "./PostCardPlaceholder";
//import UseNullableAsync from "../Hooks/UseAsync";
//import GetPostList from "../Data/Api/ProjectAPI";
import { CamelCaseToTitleCase, KebabCaseToTitleCase, KebabCaseToKebabTitleCase } from "../Utility/Functions/ComputedProps";
import Project, { SortProjectImagesByImportance, SortProjects } from "../Data/Models/Project";
import useDialog from "../ContextProviders/DialogProvider";
import AppCarousel from "../AppCarousel/AppCarousel";
import { portfolioRoutesAPI } from "../Routing/RouteList";

//! Helpful types for PostListView useState
type SplitProjectList = { majorProjects: Project[], minorProjects: Project[] };
type ProjectTitleAndImage = Pick<Project, "title" | "post_images">;

//* Component: Lists posts, alternating left to right (May refactor for right start as an option)
const PostListView = () => {
  //! React-Router hooks + its computed props
  //const location = useLocation(); //? Grab pathname & slice() off trailing slashes or just grab the whole path ("/foo/bar/" vs "/foo/bar")
  //if (location.pathname === "/") { window.history.replaceState(null, "", "/portfolio/about-me"); }
  //const path = (location.pathname === "/") ? "/portfolio/about-me" : //* Handle coming from "/" route. Else handle trailing "/portfolio/foo/"
    //(location.pathname.slice(-1) === "/") ? location.pathname.slice(0, -1) : location.pathname; //* Else all other "/portfolio/foo" routes
  //const splitUrlPath = path.split("/") ?? [""]; //* Should split into 3 ["", "portfolio", "tab-name"]
  //const projectType = splitUrlPath[splitUrlPath.length - 1]; //* Split on "/" from url to get last section, i.e. "iOS", "front-end", etc.
  const { postId: projectType } = portfolioRoutesAPI.useParams();
  const title = (projectType === "front-end" || projectType === "back-end")
    ? KebabCaseToKebabTitleCase(projectType) : KebabCaseToTitleCase(projectType);

  //! State + Computed Props of the component
  const { showDialog } = useDialog();
  const openModal = (newProject?: ProjectTitleAndImage) => {
    if (viewWidth < 768 || !newProject || !newProject.post_images || newProject.post_images.length <= 1) {
      showDialog && showDialog(false);
      return;
    } //* No modal rendered for mobile so end func here
    showDialog && showDialog({
      title: newProject?.title,
      children: <AppCarousel key={newProject.title} className="px-4 mt-3"
                             images={SortProjectImagesByImportance(newProject.post_images)} />
    });
  };

  const viewWidth = useViewWidth();
  //const [projectList, setProjectList] = useState<SplitProjectList>({ majorProjects: [], minorProjects: [] });
  const projects = portfolioRoutesAPI.useLoaderData();
  //const sortingCallback = useCallback((projectList?: SplitProjectList) => {
  //  const sortedMajorProjects = SortProjects(projectList?.majorProjects ?? []).map(project => {
  //    project.post_images = SortProjectImagesByImportance(project.post_images ?? []);
  //    return project;
  //  });
  //  const sortedSmallProjects = SortProjects(projectList?.minorProjects ?? []).map(project => {
  //    project.post_images = SortProjectImagesByImportance(project.post_images ?? []);
  //    return project;
  //  });
  //  //setProjectList({ majorProjects: sortedMajorProjects, minorProjects: sortedSmallProjects });
  //  if (projectList) {
  //    projectList.majorProjects = sortedMajorProjects;
  //    projectList.minorProjects = sortedSmallProjects;
  //  }
  //}, []); //* Empty ensures the sort is ONLY called once

  //UseNullableAsync(useCallback(async () => { //? useCallback is important AND if wanted, can be a separate "const" var like openModal
  //  const qParams = (projectType === "about-me") ? "null" : projectType.replace("-", "_");
  //  return GetPostList(qParams);
  //}, [projectType]), sortingCallback);
  return (
    (projects?.majorProjects?.length > 0 || projects?.minorProjects?.length > 0) ?
      (
        <div>
          { title && <h1 className={`ms-2 mb-0 fw-normal ${(viewWidth > 768) ? "display-3" : "display-2"}`}>{ title }</h1> }
          <ProjectList projectList={ projects } projectType={ projectType } viewWidth={ viewWidth } modalControl={ openModal } />
        </div>
      )
      : <PostCardPlaceholderList />
  );
};

//* ProjectList always returns an array of 2, the major projects list + the small projects list
//* EXCEPT in the case of the AboutMe page where it's the 1 section & gets a special header
type ProjectListProps = { projectList: SplitProjectList, projectType: string, viewWidth: number, modalControl: (project: Project) => void };
const ProjectList = ({ projectList, projectType, viewWidth, modalControl }: ProjectListProps) => {
  return Object.entries(projectList).map(([projectSize, projects]) => {
    const properSize = CamelCaseToTitleCase((projectSize === "minorProjects") ? "smallProjects" : projectSize);
    const aboutMeTitle = projectType === "about-me" ? "Nicholas L. Caceres" : null;

    if (projects.length === 0) { return; }

    return (
      <div key={`${projectType} ${properSize}`}>
        <h1 className={`ms-2 my-1 fw-normal ${(viewWidth > 768) ? "display-3" : "display-2"}`}>{ aboutMeTitle || properSize }</h1>
        <ProjectSection postCardClasses="mx-sm-4" projects={ projects } modalControl={ modalControl } />
      </div>
    );
  });
};

//* Project Section returns the list of either major or small projects
//* On small screens the cards are always setup left to right. On big screens, they zig-zag (left to right / right to left)
//* If no posts are returned from the server, a fallback Not Found Component will render
type ProjectSectionProps = {
  projects: Project[], postCardClasses?: string, modalControl: (project: Project) => void
};
const ProjectSection = ({ projects, postCardClasses, modalControl }: ProjectSectionProps) => {
  return (Array.isArray(projects) && projects?.length > 0) ?
    SortProjects(projects).map((project) =>
      <PostCard key={ project.title } className={ postCardClasses }
                project={ project } onImgClick={ () => { modalControl(project); } } />
    ) : undefined;
};

export default PostListView;
