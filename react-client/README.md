# My Portfolio in React

## Future Changes

- React changes
  - JSX Dot Notation to simplify imports + name clarity?
    - Ex: `<PostCard.Image> { children } </PostCard.Image>`
  - Since React-Router may merge with Remix, migrating to TanStack and its
  Router + SWR alternatives would probably be worth it
- General Design
  - Drop Bootstrap and React-Bootstrap
    - Why? I'm not currently using a lot of Boostrap components, PLUS dropping
    the common "Bootstrap look" will help the design stand out better
  - Timeline page that scrolls a drawn path from project to project chronologically
    - Instead of using card from react-bootstrap, create simple flex-div based
    container component for text half of Post.
      - Title can be laid out + styled as "h5.mx-2 + div.underline"
      - Material Design with flip animation to switch between smaller image container
      and flip out into text container on tap for mobile.
        - Condense/shrink, instead, on web to provide overall minimalist aesthetic
        (minor projects condensed by default, major open by default)
  - RPG-based Homepage to reduce wall of text feeling

### Changes Coming Soon

- Improve Carousel UX, re-implementing lazy load images w/out Bootstrap
  - May alter the UX altogether with 1 of a few ideas (See AppCarousel for details)
- Begin migrating to useSWR to access Github API and develop "Recent Works" components
  - "Recent Works" components likely to use the minified Card component
- React-Spring animations may be packageable into reusable hooks due to similarity
  - Currently have the following Spring Animations: fadeIn, fadeOut, windup + fling
  - Currently have the following Transition Animations: exitLeft+fadeOut with enterRight+fadeIn
    - "position: absolute" likely always needed in list Transitions

## Recent Changes

- Upgraded to React 19!
  - All Components now Functional + Hook based. No longer Class based!
    - Testing hooks super simple now thanks to `renderHook()` from `testing-library/react`
    - Reorganize folders to be oriented around individual components and their usage
    - `useContext` used in `useViewWidth` to access viewport width w/out prop drilling
    - Create accessible modal like `<dialog>` via A11y-Dialog's hook & React Portal
  - React Router 6 and 6.4 Data API added in
  - Typescript Migration Complete
  - Implement PostListView sort by "start_date" and new "importance" property.
    - AppModal sorts project images to better showcase projects for Desktop users
  - Embrace Vite as the new build/bundler tool for React + Vitest for JS Testing
    - Vite replaces React-Scripts as the recommended tool, if not using Next/Remix
    - Vitest, powered by Vite, easily replaces Jest as a powerful testing framework
  - Using Node 22, NPM 10 and, now, PNPM 9
- Bootstrap 5 + React-Bootstrap 2 migration
  - CSS Modules + Media Queries help reduce `useViewWidth` Context calls
    - Fixes NavBar being oversized on very small mobile devices!
    - Simplifies Zigzag pattern of PostCardList
  - BUT Bootstrap's helper classes used if they provide multiple CSS rules at once
    - Ex: 'display-2' under the hood is actually 'font-weight', 'font-size', and
    'line-height' for a very specific look!
    - On the other hand, 'flex-grow-1' only adds 'flex-grow: 1', so a CSS module
    class that combines the 'flex-grow' prop w/ other needed flex rules is simpler
  - Repackaged React-Bootstrap components into my own custom components to fit my
  needs and more easily reuse them across my Portfolio
    - AppAlert is easy to fill, display, & recolor via `message` + `color` props
    - AppSpinner packages the Bootstrap Spinner into an app-tailored, reusable,
    and accessible component
- React-Spring for animations
  - `<img>` tags load behind their placeholders reducing pop-in, partly by growing
  into position, and fading out the placeholder.
    - If image load fails, `<img>` fade away, displaying a placeholder component
    that flings its "loading" text, replacing it with "placeholder"
  - Transitions on route navigation, springing into frame from right to left,
  and, on exit, quickly moving and fading to the left
  - Lazy load images on intersection via `useInView`
    - Even AppCarousel lazy loads its images one-by-one on mobile viewports
- Migrated to ESLint's v9 flat config file, letting Typecript-ESLint merge the configs
  - Migrated away from deprecated ESLint and removed Typescript-ESLint
  style-focused rules and now using the style rules packaged in ESLint Stylistic
  - ESLint-Plugin-React now works with ESLint 9
  - Typescript-ESLint now bundles its parser and plugin together in `typescript-eslint`
  - ESLint similarly restructured its packages, placing its own config into `@eslint/js`

## PNPM CLI Commands

- `pnpm start` - Launches the Vite dev server
- `pnpm test` - Launches the test runner in watch mode
  - To get coverage, use `pnpm coverage`
    - Under the hood, this command runs `vitest run --coverage` where `vitest run`
    launches the tests w/out watch mode and the coverage flag gathers info via V8
- `pnpm build` - Type-check then build app in `/dist`, minified & hashed for production
- `pnpm preview` - Launches a production build locally for preview purposes only
- `pnpm lint` - Runs ESLint/Typescript-ESLint on TS + TSX files BUT ignore warnings
- `pnpm lint-strict` - Run ESLint/Typescript-ESLint on TS + TSX files including warnings
