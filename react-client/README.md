# My Portfolio in React!

## Future Changes
- Switch from Reactstrap to react-bootstrap (supports Bootstrap 5 plus quicker on the React upgrades)

## Quick Notes
- React 17 decided to put testing dependencies in package.json's normal dependencies list. Why?
  - If you're just bundling the project up into a static directory, then it makes no difference! So in the case of this project, it's totally fine to do the same and list them in the normal dependency area BUT it does mean that `npm audit` will stress any vulnerabilities it finds in those devDependency now normal dependencies rather than just toss out a warning.

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
