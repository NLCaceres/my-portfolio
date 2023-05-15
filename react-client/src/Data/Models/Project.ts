//* Easy exports for types related to Project info
//* Particularly useful for the API and components
//todo Check out Zod for the added benefit of built-in validation
//* BUT ALSO this file can provide helpful functions related to the type, like a sorting function

export type ProjectImage = {
  image_url: string,
  alt_text: string,
  importance: number
}

//? On JS Sort performance: For arrays of length < 2 (i.e. 1 or 0), they are instantly sorted, no compare func is run
//? PLUS as usual, each browser has a different implementation for sort(), i.e. one browser may MergeSort while another QuickSorts!
export function SortProjectImagesByImportance(projectImages: ProjectImage[]) {
  return [...projectImages].sort((a,b) => a.importance - b.importance)
}

type Project = {
  id: number,
  title: string,
  description: string,
  github_url?: string, // Most but unlikely that all projects have a github
  homepage_url?: string, // Only web projects have a homepage
  post_images?: ProjectImage[] // Not all projects currently have images
  project_size?: string, // About me is the only one that doesn't have a size or type
  project_type?: string,
  importance: number,
  start_date?: string
}

//! Most recent projects come first BUT if something has high importance (0 == highest value) then make it come first despite recency
export function SortProjects(projects: Project[]) {
  const dateSortedProjects = projects.sort((a,b) => {
    const dateB = Date.parse(b.start_date ?? ''); //* If date is not valid or in a parsable format for the browser, NaN is returned
    const dateA = Date.parse(a.start_date ?? ''); //* "YYYY-MM-DDTHH:mm:ss.sssZ" is the ONLY guaranteed format across browsers
    if (isNaN(dateB)) { return -1 }
    else if (isNaN(dateA)) { return 1 }
    else { return dateB - dateA } //? Descending order: Most recent to oldest
  })

  //? Javascript sort() mutates arrays, in-place (no extra memory) and stable (positions remain the same if sorted)
  //? BUT this means sort() just returns the same array back to you, so it actually isn't necessary to set new variables
  //? Since they all point to the same object, BUT making new variables is very readable 
  //? so I think it's beneficial to make new variables that will die anyway when the function completes
  const importanceSortedProjects = dateSortedProjects.sort((a,b) => a.importance - b.importance);
  return importanceSortedProjects;
}

export default Project
