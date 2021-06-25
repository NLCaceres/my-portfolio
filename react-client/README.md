# My Portfolio in React!

## Future Changes
- Switch from Reactstrap to react-bootstrap (supports Bootstrap 5 plus quicker on the React upgrades)
- Contact Us in a Footer

## Recent Changes
- Added Modal Views that appear on click of images. Added a brightness darkener on images for desktops BS4 breakpoint.
- Added in Carousels to those modals with project names included
- Added in Carousels for lower breakpoints (mobile devices).
- Single images do not render as carousels across app

## To Add to Seeder List
- About Me Edits
- Laravel + Vue Account On It
- Most of my experience with classic GUIs (Made in Java)

## Quick Notes
- React 17 decided to put testing dependencies in package.json's normal dependencies list. Why?
  - If you're just bundling the project up into a static directory, then it makes no difference! So in the case of this project, it's totally fine to do the same and list them in the normal dependency area BUT it does mean that `npm audit` will stress any vulnerabilities it finds in those devDependency now normal dependencies rather than just toss out a warning.
- React-Scripts 4 has had plenty of security vulnerabilities! Currently best solution has been downgrading npm and waiting!
  - Downgrading npm to 6.14.13 alongside Node 14.17.1 (actually an upgrade) reduced vulnerabilities to 3 moderate and 4 high
    - The fix comes since React has clarified that it does NOT support npm 7 yet and using npm 7 results in dependency conflict errors
    - How? Use nvm to switch whenever necessary installs or audits needed

### This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Yarn CLI Commands (Note: Yarn 2 is available if wanted, but lots of breaking changes)
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
