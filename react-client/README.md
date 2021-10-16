# My Portfolio in React!

## Future Changes
- Switch from Reactstrap to react-bootstrap (supports Bootstrap 5 plus quicker on the React upgrades)
  - Instead of using card from react-bootstrap, create simple flex-div based container component for text half of Post.
    - Title = h5.mx-2 + div.underline
- Include the following in Seeder:
  - Laravel + Vue Account On It
  - Most of my experience with classic GUIs (Made in Java)

## Recent Changes
- Footer + Contact Me Button that displays modal or /contact-me page
- React-Bootstrap migration beginning in Modal, Contact page, Footer & Alerts

## Quick Notes
- Package.json's homepage option has a secret! When you set it, including a directory at the end ('/portfolio') React uses it to set PUBLIC_URL. Using Nuxt or setting 
  up a static page via Vercel, this may not be a problem. When you're running your own backend though, it'll append this directory to the front of all your assets which means NOTHING will load correctly without reconfiguring from the front-end or backend. So be careful!
- React 17 decided to put testing dependencies in package.json's normal dependencies list. Why?
  - If you're just bundling the project up into a static directory, then it makes no difference! So in the case of this project, it's totally fine to do the same and list them in the normal dependency area BUT it does mean that `npm audit` will stress any vulnerabilities it finds in those devDependency now normal dependencies rather than just toss out a warning.
- React-Scripts 4 has had plenty of security vulnerabilities! Currently best solution has been downgrading npm and waiting!
  - Downgrading npm to 6.14.13 alongside Node 14.17.1 (actually an upgrade) reduced vulnerabilities to 3 moderate and 4 high
    - The fix comes since React has clarified that it does NOT support npm 7 yet and using npm 7 results in dependency conflict errors
    - How? Use nvm to switch whenever necessary installs or audits needed
  - UPDATE!!! - NPM 8 is available and while it might not fix the vulnerabilities may be worth upgrading to BECAUSE the React team
  does NOT seem intent to fix the vulnerabilities any time soon. Their current suggestion is move react-scripts to devDependencies
  and run `npm audit --production` so only real issues appear
    - Only real issues? According to them (and it probably is), the issues involved with react-scripts likely will never be exploited in the wild
    Since react-scripts are simple build tools that run on your dev machine, unless your dev machine is compromised AND the attacker really just 
    feels like messing with you, it's EXTREMELY unlikely the vulnerabilities will ever and could ever affect the live app.
      - Finally, it brings up the concern with NPM as a whole, `npm audit` is not perfect. It will warn you about ALL potential issues regardless
      if those issues could potentially affect you. It may even bring up the same exact issue multiple times under slightly different names.
    - BUT problem with moving react-scripts to devDependencies is that Heroku won't be able to build your React app! So the above fix is a VERY
    temporary one. Only good for brief checks before prepping the repo for another deploy to Heroku

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
