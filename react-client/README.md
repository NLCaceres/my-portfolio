# My Portfolio in React

## Future Changes

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
- `useSWR` with the Github API to develop a "Recent Works" component
  - "Recent Works" components likely to use the minified Card component
  - Use Tanstack equivalent of `useSWR`, Tanstack Query?
- Re-orient folders to leverage Tanstack Router file-based routing?
- React-Spring animations may be packageable into reusable hooks due to similarity
  - Currently have the following Spring Animations: fadeIn, fadeOut, windup + fling
  - Currently have the following Transition Animations: exitLeft+fadeOut with enterRight+fadeIn
    - "position: absolute" likely always needed in list Transitions

## Recent Changes

- Updated to Typescript 7 with its new Go-based compiler
  - Enabled move from ESLint to OxLint which leverages the new compiler and
  is built on Rust, making it lightning fast.
    - Still using ESLint-Stylistic until I get Oxfmt working
- Upgraded to React 19 with full functional + hook-based components
  - Added Tanstack Router, replacing React-Router due to Remix's changes
  - `useContext` used in `useViewWidth` to access viewport width w/out prop drilling
  - Created accessible modal like `<dialog>` via A11y-Dialog's hook & React Portal
  - PostListView sorts by `start_date` and new `importance` prop
    - Sorts project images for desktop users to better showcase projects
  - Embrace Vite as the new build/bundler tool for React + Vitest for JS Testing
- Added React-Spring for animations
  - `<img>` tags load behind their placeholders reducing pop-in, partly by growing
  into position, and fading out the placeholder.
    - If image load fails, `<img>` fade away, displaying a placeholder component
    that flings its "loading" text, replacing it with "placeholder"
  - Transitions on route navigation, springing into frame from right to left,
  and, on exit, quickly moving and fading to the left
  - Lazy load images on intersection via `useInView`
    - Even AppCarousel lazy loads its images one-by-one on mobile viewports

## PNPM CLI Commands

- `pnpm start` - Launches the Vite dev server
- `pnpm test` - Launches the test runner in watch mode
  - To get coverage, use `pnpm coverage`
    - Under the hood, this command runs `vitest run --coverage` where `vitest run`
    launches the tests w/out watch mode and the coverage flag gathers info via V8
- `pnpm build` - Type-check then build app in `/dist`, minified & hashed for production
- `pnpm preview` - Launches a production build locally for preview purposes only
- `pnpm lint` - Run Oxlint without type-aware rules
- `pnpm lint-typed` - Run Oxlint with type-aware rules
  - Both lint scripts can append `-fix` to eliminate fixable found issues
