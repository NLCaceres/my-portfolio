import useSWR from "swr";
import GetPostList from "../Data/Api/ProjectAPI";
import { portfolioRoutesAPI } from "../Routing/RouteList";

function usePostList(projectType: string) {
  const { data: posts } = useSWR(
    `/api/posts/${projectType}`,
    () => GetPostList((projectType === "about-me") ? "null" : projectType.replace("-", "_")),
    { fallbackData: portfolioRoutesAPI.useLoaderData() }
  );
  return posts;
}

export default usePostList;
