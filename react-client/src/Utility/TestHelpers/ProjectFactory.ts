import Project, { ProjectImage } from "../../Data/Models/Project";

//* Useful for generating fake models to test
export class ProjectImageFactory {
  static imageCount = 0;
  static create(extraKeyVals = {}): ProjectImage {
    this.imageCount++;
    return { image_url: "FoobarSrc"+this.imageCount, alt_text: "BarfooAlt"+this.imageCount,
      importance: this.imageCount, ...extraKeyVals
    };
  }
}

export default class ProjectFactory {
  static projectCount = 0;
  static projectImageFactory = new ProjectImageFactory();

  static create(numImagesNeeded = 0, extraKeyVals = {}): Project {
    this.projectCount++;
    const imagePosts = [];
    for (let i = 0; i < numImagesNeeded; i++) {
      imagePosts.push(ProjectImageFactory.create());
    }

    return { id: this.projectCount, title: "Foobar" + this.projectCount,
      description: "Barfoo" + this.projectCount,
      github_url: "https://exampleGit.com", homepage_url: "", post_images: imagePosts,
      importance: this.projectCount, ...extraKeyVals
    };
  }
}
