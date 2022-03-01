//* qParams should probably be required BUT for now default to 'null' which returns aboutMe
export default async function GetPostList(qParams = 'null') {
  const httpResponse = await fetch(`/api/posts?project_type=${qParams}`, { headers: { "Accept": "application/json" } });
  const jsonResponse = await httpResponse.json();
  if (jsonResponse.status === 500 || jsonResponse.status === 404) return; //* Maybe throw?

  const projectList = { majorProjects: [], minorProjects: [] };
  if (Array.isArray(jsonResponse)) { //* Rails SHOULD always return an [] (even if empty) but best to be safe
    projectList.majorProjects = jsonResponse.filter(project => project["project_size"] === "major_project");
    projectList.minorProjects = jsonResponse.filter(project => project["project_size"] === "small_project");
  } 
  else { projectList.majorProjects.unshift(jsonResponse); }
  return projectList;
}

export async function VerifyRecaptcha() {
  return 0.0; // By default declare everyone a computer (so no letting anyone pass yet)
}