# My Portfolio in React!

## Future Changes
- React 18 based changes
  - Suspense Library?
  - Vite?
  - JSX Dot Notation to simplify imports + name clarity?
    - Ex: `<PostCard.Image> { children } </PostCard.Image>`
  - Hook Updates
    - UseAsync likely to get replaced with useSWR thanks to its caching, dedup'ing, pagination and more!
    - IMPORTANT: BUT a UseViewWidth Hook may be useful to replace the viewWidth prop-drilling via the useContext/provider pattern
      - MORE IMPORTANT: Could help conditionally shrink Turnstile Widget into compact form for very small mobile devices (<320px)
- General Design
  - Drop React-Bootstrap and use React Portals to provide modal + a fancier carousel?
    - Why? Currently, only using a limited number of Bootstrap styled components PLUS gives the chance stand out by avoiding the super common "Bootstrap look" as well as the more recent "Tailwind look"
  - Timeline page - Scroll from project to project perfectly chronologically. Transitioning like a path
    - Instead of using card from react-bootstrap, create simple flex-div based container component for text half of Post.
      - Title can be laid out + styled as "h5.mx-2 + div.underline"
      - Material Design with flip animation to switch between smaller image container and flip out into text container on tap for mobile.
        - Condense/shrink, instead, on web to provide overall minimalist aesthetic (minor projects condensed by default, major open by default)
  - RPG-based Homepage to reduce wall of text feeling
#### Changes Coming Soon
- Typescript
  - 1st: A Validator for the "Contact Me" Form data
  - 2nd: Update files containing JSX from '.js' files to '.jsx' then '.tsx' ('.tsx' is mandatory when using Typescript)
- React-Spring animations may be packable into hooks that can be reused
  - Currently have the following Spring Animations: fadeIn, fadeOut, windup + fling
  - Currently have the following Transition Animations: exitLeft+fadeOut with enterRight+fadeIn
    - "position: absolute" likely should always be used in Transitions since they usually deal with lists

## Recent Changes
- Upgraded to React 18!
  - All Components now Functional + Hook based. No longer Class based!
    - Easily able to test hooks now thanks to renderHook from testing-library/react
    - Reorganize folders to be oriented around individual components and their usage
  - React Router 6
  - Beginning Typescript Migration
- Bootstrap 5 + React-Bootstrap 2 migration
  - Use more CSS Modules when possible to reduce the # of times props.viewWidth is prop drilled
    - Fixes NavBar being oversized on very small mobile devices!
  - BUT use Bootstrap's helper classes if they provide multiple CSS rules at once
    - Ex: 'display-2' under the hood is actually 'font-weight', 'font-size', and 'line-height' for a very specific look!
    - On other hand, 'flex-grow-1' just adds 'flex-grow: 1', so instead use a CSS Module that combines it with other flex rules for that element
  - Extend React-Bootstrap Components to be easily reused across my Portfolio with my own specifications and preferences
    - App-Wide Alert made to be easily filled, displayed, and recolored based on message and color props
    - App-Wide Spinner to easily ensure it's accessible whenever used
- React-Spring for animations
  - Background loading images for better user experience, 
    - Reducing pop-in on images by slickly growing with image, and fading away placeholder
    - If image cannot load, fade image tag in the background, fling away loading text and render placeholder text
  - Use transitions when navigating from route to route
    - Exiting route fades and moves toward the left
    - Meanwhile entering route launches to the left and into frame, bouncing into place
  - Lazy load images on intersection via useInView hook
    - Even Carousel lazy loads in mobile image section of Card 
    - Desktop modal does not lazy load BUT maybe it should given some projects have 8+ imgs that would load at once
- Update engines to Node 18, NPM 8, Yarn 1.22.19 and move from Heroku to Railway for deployments

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
