import useViewWidth from "../ContextProviders/ViewWidthProvider";
import PostCard from "./PostCard";
import PostCardPlaceholderList from "./PostCardPlaceholder";
import { CamelCaseToTitleCase, KebabCaseToTitleCase, KebabCaseToKebabTitleCase } from "../Utility/Functions/ComputedProps";
import Project, { SortProjectImagesByImportance, SortProjects } from "../Data/Models/Project";
import useDialog from "../ContextProviders/DialogProvider";
import AppCarousel from "../AppCarousel/AppCarousel";
import { portfolioRoutesAPI } from "../Routing/RouteList";


//* Component: Lists posts, alternating left to right (May refactor for right start as an option)
const PostListView = () => {
  const { postId: projectType } = portfolioRoutesAPI.useParams();
  const title = (projectType === "front-end" || projectType === "back-end")
    ? KebabCaseToKebabTitleCase(projectType) : KebabCaseToTitleCase(projectType);

  //! State + Computed Props of the component
  const { showDialog } = useDialog();
  const openModal = (newProject?: Pick<Project, "title" | "post_images">) => {
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
  const projects = portfolioRoutesAPI.useLoaderData();
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

//* ProjectList always returns an array containing 2 Project[], the major + small lists
//* EXCEPT for "/about-me" which gets 1 "major" section + a special header
type ProjectListProps = {
  projectList: { majorProjects: Project[], minorProjects: Project[] },
  projectType: string, viewWidth: number, modalControl: (project: Project) => void
};
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
