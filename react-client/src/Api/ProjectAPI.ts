import IsPlainObject from "lodash/isPlainObject";
import GetData from "./Utility";

type PostImage = {
  image_url: string,
  alt_text: string
}

type Post = {
  id: number,
  title: string,
  description: string,
  github_url?: string, // Most but not sure all posts have a github
  homepage_url?: string, // Only web posts have a homepage
  post_images?: PostImage[] // Not all posts currently have images
  project_size?: string, // About me is the only one that doesn't have a size or type
  project_type?: string
}

//* API that calls to Rails Backend and gets Projects in a format that can be turned into Posts
//* qParams should probably be required BUT for now default to 'null' which returns aboutMe
export default async function GetPostList(qParams = 'null') {
  const jsonResponse: Post | Post[] = await GetData(`/api/posts?project_type=${qParams}`)

  const projectList: { majorProjects: Post[], minorProjects: Post[] } = { majorProjects: [], minorProjects: [] };
  if (Array.isArray(jsonResponse)) { //* Rails SHOULD always return an [] (even if empty) but best to be safe
    projectList.majorProjects = jsonResponse.filter(project => project["project_size"] === "major_project");
    projectList.minorProjects = jsonResponse.filter(project => project["project_size"] === "small_project");
  }
  else if (IsPlainObject(jsonResponse)) { // Based on TS, should be a Post BUT as a double check, use lodash to verify we get an "object"
    const majorProjSizeCheck = jsonResponse.project_size && jsonResponse.project_size === "major_project";
    const minorProjSizeCheck = jsonResponse.project_size && jsonResponse.project_size === "small_project";
    const idCheck = jsonResponse.id && jsonResponse.id.toString() === process.env.REACT_APP_ABOUT_ME_ID;
    
    if (majorProjSizeCheck || idCheck) { projectList.majorProjects.unshift(jsonResponse) }
    else if (minorProjSizeCheck) { projectList.minorProjects.unshift(jsonResponse) }
  }

  return projectList;
}