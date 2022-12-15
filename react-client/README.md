# My Portfolio in React!

## Future Changes
- JSX Dot Notation to simplify imports + name clarity
  - Ex: `<PostCard.Image> { children } </PostCard.Image>`
- Fully Functional Components (i.e. not class based)
  - App + Carousel still class based. Last two remaining to update.
  - Could then upgrade to React-Router-Dom 6 and use its Hooks (useLocation + useParams)
- Timeline page - Scroll from project to project perfectly chronologically. Transitioning like a path
  - Instead of using card from react-bootstrap, create simple flex-div based container component for text half of Post.
    - Title can be laid out + styled as "h5.mx-2 + div.underline"
    - Material Design with flip animation to switch between smaller image container and flip out into text container on tap for mobile.
      - Condense/shrink, instead, on web to provide overall minimalist aesthetic (minor projects condensed by default, major open by default)
- RPG-based Homepage to reduce wall of text feeling

## Recent Changes
- Handle Railway changes
- Bootstrap 5 + React-Bootstrap 2 migration
- Update engines to Node 18, NPM 8, Yarn 1.22.19

## Quick Notes
- React 17 decided to put its testing dependencies in package.json's normal dependencies list. Why?
  - If you're just bundling the project up into a static directory, then it makes no difference! So in the case of this project, it's totally fine to do the same and list them in the normal dependency area BUT it does mean that vulnerability audits will show the testing library security concerns even if they're harmless
- React-Scripts 5 FINALLY fixed most of the vulnerability issues BUT as a reminder, any future vulnerabilities SHOULDN'T be a concern since React-Scripts is a simple
build tool, not a true production dependency. Unless you're already compromised, the script's vulnerabilities shouldn't be exploitable. This package is ONLY necessary 
in production to make your build on Railway or Vercel. Finally, the issues highlight the fact that NPM + yarn's audits are warnings and not perfect
  - New vulnerabilities are beginning to accumulate, but still not a real concern since it is a dev-dependency and not likely to ever come into play except if any other really bad supply-side NPM shenanigans occur. Thankfully Github + NPM and other repositories are doing a fairly good job cracking down (locked down through Top 100-500ish projects online)

### This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Yarn CLI Commands (Note: Yarn 2 is available if wanted, but way too many breaking changes)
- `yarn install` -> Usually run as expected to create a lock file + package install, but also often run when major package changes are added to package.json
- `yarn start` -> Run the app in dev mode (typically localhost:3000) with hot reloading 
- `yarn test` -> Launch test runner in interactive watch mode
- `yarn build` -> Build app for production in /build dir, minified and hashed filenames
    - Problem minifying? https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
- `yarn eject` -> One way operation! Instead of yarn controlling webpack, babel, etc,
  it'll be entirely on you to configure them as needed for the project. Yarn Commands will still work
  (minus eject) but all config files will be in your project dir for you to alter.

### Code Splitting -> https://facebook.github.io/create-react-app/docs/code-splitting

### Deployment -> https://facebook.github.io/create-react-app/docs/deployment
