import GetPostList from "./ProjectAPI";
import * as GetData from "./Utility";

const originalEnv = process.env;

describe("sending a GET request to receive Post list", () => {
  let GetDataSpy: jest.SpyInstance;
  beforeEach(() => {
    GetDataSpy = jest.spyOn(GetData, "default").mockImplementation(() => Promise.resolve([]));
  });
  afterEach(() => { GetDataSpy.mockRestore(); }); //* Reset mocks
  test("query argument affects request url", async () => {
    await GetPostList(); //* Return value unnecessary for this test
    expect(GetDataSpy).lastCalledWith("/api/posts?project_type=null"); //* Default param properly interpolated

    await GetPostList("project");
    expect(GetDataSpy).lastCalledWith("/api/posts?project_type=project"); //* Inserted param properly interpolated
  });
  test("prevent body from receiving incorrect values, only adding in expected project types", async () => {
    //* Basic reply each with a single major and minor project
    GetDataSpy.mockImplementationOnce(() => [{ project_size: "major_project" }, { project_size: "small_project" }]);
    const filledResponse = await GetPostList();
    expect(filledResponse.majorProjects).toHaveLength(1); //* 1 object added to each final generated JSON key
    expect(filledResponse.minorProjects).toHaveLength(1);

    GetDataSpy.mockImplementationOnce(() => { return { project_size: "major_project" }; });
    const singleMajorResponse = await GetPostList(); //* Single major project
    expect(singleMajorResponse.majorProjects).toHaveLength(1); //* 1 object added
    expect(singleMajorResponse.minorProjects).toHaveLength(0); //* No small projects to add so empty array

    GetDataSpy.mockImplementationOnce(() => { return { project_size: "small_project" }; });
    const singleMinorResponse = await GetPostList(); //* Single small project
    expect(singleMinorResponse.majorProjects).toHaveLength(0); //* No major project added to array
    expect(singleMinorResponse.minorProjects).toHaveLength(1); //* 1 small project objected added

    GetDataSpy.mockImplementationOnce(() => "unexpected!");
    const singleBadTypeResponse = await GetPostList(); //* MUST be an object type to be added into either array
    expect(singleBadTypeResponse.majorProjects).toHaveLength(0); //* Empty for both
    expect(singleBadTypeResponse.minorProjects).toHaveLength(0);

    GetDataSpy.mockImplementationOnce(() => { return { project_size: "bad_project" }; });
    const singleBadObjectResponse = await GetPostList(); //* Must also have valid value set in project_size prop
    expect(singleBadObjectResponse.majorProjects).toHaveLength(0); //* Empty arrays for both again
    expect(singleBadObjectResponse.minorProjects).toHaveLength(0);

    GetDataSpy.mockImplementationOnce(() => { return { missing_size: "small_project" }; });
    const singleBadObjectPropResponse = await GetPostList(); //* Without a project_size prop, object is also invalid
    expect(singleBadObjectPropResponse.majorProjects).toHaveLength(0); //* Empty arrays again
    expect(singleBadObjectPropResponse.minorProjects).toHaveLength(0);

    process.env = { ...originalEnv, REACT_APP_ABOUT_ME_ID: "200"};
    GetDataSpy.mockImplementationOnce(() => { return { id: "200" }; });
    const singleAlternateResponse = await GetPostList(); //* IF id matches expected about_me post ID
    expect(singleAlternateResponse.majorProjects).toHaveLength(1); //* THEN Insert it into majorProjects array
    expect(singleAlternateResponse.minorProjects).toHaveLength(0);
    process.env = originalEnv;
  });
});