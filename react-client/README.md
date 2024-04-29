# My Portfolio in React!

## Future Changes
- React 18 based changes
  - JSX Dot Notation to simplify imports + name clarity?
    - Ex: `<PostCard.Image> { children } </PostCard.Image>`
  - Hook Updates
    - UseAsync likely to get replaced with useSWR thanks to its caching, dedup'ing, pagination and more!
    - As an alternative to useSWR, React-Router seems to provide similar pre-loading
      - Additionally, React-Router now provides an option to render in a component while this loading occurs (like Suspense!)
    - As an alternative to useSWR, TanStack offers its Query system AND a Router like NextJS
- General Design
  - Drop React-Bootstrap and use React Portals to provide modal + a fancier carousel?
    - Why? Currently, only using a limited number of Bootstrap styled components PLUS gives the chance stand out by avoiding
    the super common "Bootstrap look" as well as the more recent "TailwindUI look"
    - Using the `<dialog>` element is also a great newer option in HTML since it provides accessibility by default! It just needs styling!
  - Timeline page - Scroll from project to project perfectly chronologically. Transitioning like a path
    - Instead of using card from react-bootstrap, create simple flex-div based container component for text half of Post.
      - Title can be laid out + styled as "h5.mx-2 + div.underline"
      - Material Design with flip animation to switch between smaller image container and flip out into text container on tap for mobile.
        - Condense/shrink, instead, on web to provide overall minimalist aesthetic (minor projects condensed by default, major open by default)
  - RPG-based Homepage to reduce wall of text feeling
  - Add recent work section that makes requests to the Github API to track recent commits to projects
  - Likely will update the last component, Modal, to Typescript via [a11y-dialog](https://a11y-dialog.netlify.app/), which has a React version already

#### Changes Coming Soon
- Improve Carousel UX by dropping Bootstrap and re-implementing with lazy-loading images
  - May alter the UX altogether with 1 of a few ideas (See AppCarousel for details)
- React-Spring
  - React-Spring animations may be packable into hooks that can be reused
    - Currently have the following Spring Animations: fadeIn, fadeOut, windup + fling
    - Currently have the following Transition Animations: exitLeft+fadeOut with enterRight+fadeIn
      - "position: absolute" likely should always be used in Transitions since they usually deal with lists
- ESLint 9 works with every plugin EXCEPT the React plugin. Once that React plugin gets update for ESLint 9,
then this project's migration should be complete

## Recent Changes
- Upgraded to React 18!
  - All Components now Functional + Hook based. No longer Class based!
    - Testing hooks super simple now thanks to `renderHook()` from 'testing-library/react'
    - Reorganize folders to be oriented around individual components and their usage
    - useContext pattern packed into a useViewWidth hook allowing access to viewWidth across the App without prop drilling
  - React Router 6 and 6.4 Data API added in
  - Typescript Migration 99% complete
    - Likely will update the last component, Modal, to Typescript via [a11y-dialog](https://a11y-dialog.netlify.app/), which has a React version already
  - Implement PostListView sort by "start_date" and new "importance" property. 
    - For Desktop users, project images are also sorted to better showcase the selected project in the AppModal
  - Embrace Vite as the new build tool for React as well as Vitest for React Testing
    - Since React-scripts seems to have been abandoned, Vite appears to be the recommended way to build and bundle ReactJS (at least without NextJS or Remix)
    - Vitest added to match Vite, since it's a fairly simple and powerful drop-in replacement for Jest
  - Using Node 20, NPM 10 and, now, PNPM 8
- Bootstrap 5 + React-Bootstrap 2 migration
  - CSS Modules used whenever possible to reduce the # of times props.viewWidth is prop drilled
    - Fixes NavBar being oversized on very small mobile devices!
    - Simplifies Zigzag pattern of PostCardList
  - BUT Bootstrap's helper classes used if they provide multiple CSS rules at once
    - Ex: 'display-2' under the hood is actually 'font-weight', 'font-size', and 'line-height' for a very specific look!
    - On other hand, 'flex-grow-1' just adds 'flex-grow: 1', so instead use a CSS Module that combines it with other flex rules for that element
  - React-Bootstrap Components repackaged into my own custom components with my own specifications and preferences for easy reuse across my Portfolio
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
- Migrated to ESLint 9's flat config file with Typescript-ESLint being responsible for the merging process
  - Typescript-ESLint now prefers to use `typescript-eslint` to bundle its parser and plugin together
  - ESLint split its own recommended config into the `@eslint/js` package
    - Similarly, style based rules are now deprecated in ESLint and fall under [ESLint Stylistic](https://eslint.style/guide/getting-started)
    split into 3 packages plus a supplementary package for extra styling rules. You can use `@stylistic/eslint-plugin` to get all 4 plugins.

## PNPM CLI Commands
- `pnpm start` - Launches the Vite dev server
- `pnpm test` - Launches the test runner in watch mode
  - To get coverage, use `pnpm coverage`
    - Under the hood, this command runs `vitest run --coverage` where `vitest run` launches the tests without watch mode and
    the coverage flag gathers info via V8
- `pnpm build` - Type check and build app for production in /dist dir, minified and hashed filenames
- `pnpm preview` - Launches a production build locally for preview purposes only
- `pnpm lint` - Runs ESLint/Typescript-ESLint against all TS and TSX files
