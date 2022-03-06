import * as Viewports from "./Viewports";
//* Approach here is somewhat TDD. 
//* Expect 8 constants of the sizes specified here. Make sure they're represented in the main file
describe("with an array of viewport constants", () => {
  test("specifically 8 - 4 exact, 1 lower limit, 3 upper limit", () => {
    let totalCount = 0, exactSetCount = 0, lowLimitCount = 0, upperLimitCount = 0;
    for (const key in Viewports) {
      if (key.endsWith('LowEndWidth')) lowLimitCount++;
      else if (key.endsWith('HighEndWidth')) upperLimitCount++;
      else exactSetCount++;
      totalCount++;
    }
    expect(totalCount).toBe(9);
    expect(exactSetCount).toBe(4);
    expect(lowLimitCount).toBe(2);
    expect(upperLimitCount).toBe(3);
  })
  test("representing specific viewport breakpoints", () => {
    expect(Viewports.smallTabletViewWidth).toBe(576);
    expect(Viewports.averageTabletViewWidth).toBe(768);
    expect(Viewports.smallDesktopViewWidth).toBe(992);
    expect(Viewports.largeDesktopViewWidth).toBe(1200);
  })
  test("representing the lower limit of viewports", () => {
    expect(Viewports.smallDesktopLowEndWidth).toBe(993);
    expect(Viewports.averageTabletLowEndWidth).toBe(769);
  })
  test("representing the upper limit of viewports", () => {
    expect(Viewports.mobileHighEndWidth).toBe(575);
    expect(Viewports.smallTabletHighEndWidth).toBe(767);
    expect(Viewports.tabletHighEndWidth).toBe(991);
  })
})
