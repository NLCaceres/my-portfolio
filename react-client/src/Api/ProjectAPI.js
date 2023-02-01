import IsPlainObject from "lodash/isPlainObject";
import GetData from "./Utility";

//* API that calls to Rails Backend and gets Projects in a format that can be turned into Posts
//* qParams should probably be required BUT for now default to 'null' which returns aboutMe
export default async function GetPostList(qParams = 'null') {
  const jsonResponse = await GetData(`/api/posts?project_type=${qParams}`)

  const projectList = { majorProjects: [], minorProjects: [] };
  if (Array.isArray(jsonResponse)) { //* Rails SHOULD always return an [] (even if empty) but best to be safe
    projectList.majorProjects = jsonResponse.filter(project => project["project_size"] === "major_project");
    projectList.minorProjects = jsonResponse.filter(project => project["project_size"] === "small_project");
  } 
  else if (IsPlainObject(jsonResponse)) { 
    const majorProjSizeCheck = jsonResponse.project_size && jsonResponse.project_size === "major_project";
    const minorProjSizeCheck = jsonResponse.project_size && jsonResponse.project_size === "small_project";
    const idCheck = jsonResponse.id && jsonResponse.id.toString() === process.env.REACT_APP_ABOUT_ME_ID;
    
    if (majorProjSizeCheck || idCheck) { projectList.majorProjects.unshift(jsonResponse) }
    else if (minorProjSizeCheck) { projectList.minorProjects.unshift(jsonResponse) }
  }

  return projectList;
}