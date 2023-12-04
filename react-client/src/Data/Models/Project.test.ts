import ProjectFactory, { ProjectImageFactory } from "../../Utility/TestHelpers/ProjectFactory";
import { SortProjects, SortProjectImagesByImportance } from "./Project";

describe("provides typings plus helper functions for Project objects and their images", () => {
  describe("like a helper to sort projects", () => {
    test("by start date then importance, prioritizing importance", () => {
      const highImportanceProject = ProjectFactory.create(0, { importance: 0, start_date: "01 Jan 1970 00:00:00 GMT" });
      const project = ProjectFactory.create(0, { importance: 1, start_date: "02 Jan 1970 00:00:00 GMT" });
      const recentProject = ProjectFactory.create(0, { importance: 1, start_date: "03 Jan 1970 00:00:00 GMT" });
      const list = [highImportanceProject, project, recentProject];

      SortProjects(list);

      expect(list[0]).toBe(highImportanceProject); //* Importance of 0 wins over more recent project
      expect(list[1]).toBe(recentProject); //* Most recent project comes next
      expect(list[2]).toBe(project); //* Equally important but less recent, so it comes last
    });
    test("placing all projects with an invalid or missing start date behind those with a start date", () => {
      const oldestProject = ProjectFactory.create(0, { importance: 0, start_date: "01 Jan 1970 00:00:00 GMT" });
      const missingStartDateProject = ProjectFactory.create(0, { importance: 0, start_date: "" });
      const recentProject = ProjectFactory.create(0, { importance: 0, start_date: "03 Jan 1970 00:00:00 GMT" });
      const list = [oldestProject, missingStartDateProject, recentProject];

      SortProjects(list);

      expect(list[0]).toBe(recentProject); //* Most recent project wins if all importance is equal
      expect(list[1]).toBe(oldestProject); //* Oldest project wins over projects without a start date
      expect(list[2]).toBe(missingStartDateProject); //* No start date, so place it last

      //? Browsers see 2014-25-23 as ISO 8601 format BUT invalid since no 25th month exists!
      //? On the other hand, 23/25/2014 will be seen by browsers as non-ISO, and it'll try to run its own parsing implementation
      //? Firefox sees 23/25/2014 as November 25 2014 BUT Safari sends the expected NaN
      //todo Since this can lead to wildly different sorting, it's probably best to force non-ISO formats to be compared as NaN
      const invalidStartDateProject = ProjectFactory.create(0, { importance: 0, start_date: "2014-25-23" });
      const secondList = [oldestProject, invalidStartDateProject, recentProject];

      SortProjects(secondList);

      expect(secondList[0]).toBe(recentProject); //* Most recent project wins if all importance is equal
      expect(secondList[1]).toBe(oldestProject); //* Oldest project wins over projects with an invalid start date
      expect(secondList[2]).toBe(invalidStartDateProject);
    });
  });
  test("provides a helper to sort images by their importance property, returning a whole new list", () => {
    const lowImportanceImg = ProjectImageFactory.create({ importance: 10 });
    const midImportanceImg = ProjectImageFactory.create({ importance: 5 });
    const img = ProjectImageFactory.create({ importance: 1 });
    const list = [lowImportanceImg, img, midImportanceImg];

    const sortedList = SortProjectImagesByImportance(list);

    expect(sortedList[0]).toBe(img); //* Lowest number importance is the highest priority, placed 1st
    expect(sortedList[1]).toBe(midImportanceImg); //* Which can be thought of as an ASCENDING sort
    expect(sortedList[2]).toBe(lowImportanceImg); //* i.e. [2,1,3] becomes [1,2,3]
    //* Original list remains exactly the same
    expect(list[0]).toBe(lowImportanceImg);
    expect(list[1]).toBe(img);
    expect(list[2]).toBe(midImportanceImg);
  });
});