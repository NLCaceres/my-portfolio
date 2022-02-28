//* Useful for generating fake models to test
export class ProjectImageFactory {
  static imageCount = 0;
  static create(extraKeyVals = {}) {
    this.imageCount++;
    return { image_url: 'FoobarSrc'+this.imageCount, alt_text: 'BarfooAlt'+this.imageCount, ...extraKeyVals }
  }
}

export default class ProjectFactory {
  static projectCount = 0;
  static projectImageFactory = new ProjectImageFactory();

  static create(numImagesNeeded = 0, extraKeyVals = {}) {
    this.projectCount++;
    let imagePosts; for (let i = 0; i < numImagesNeeded; i++) {
      if (i === 0) imagePosts = [];
      imagePosts.push(ProjectImageFactory.create());
    }
    return { title: 'Foobar' + this.projectCount, description: 'Barfoo' + this.projectCount,
      github_url: 'https://exampleGit.com', post_images: imagePosts, ...extraKeyVals }
  }
}
