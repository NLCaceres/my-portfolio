# My Portfolio! Data Brought To You By Rails

Originally written using Rails 5, my React-based portfolio would fetch data from
a fully-fledged Rails app, perfectly capable of serving up its own HTML. Around
the same time that I started building out the two apps, front-end and back-end,
Rails 6 was released. Looking further into the documentation, I found a great solution
to get things up and running faster, the API mode! A Rails app can easily be created
using the CLI, and with the addition of the '--api' flag, it'll drop any unnecessary
middleware, leaving behind a powerful but lightweight Rails API. Though I've had
to sacrifice API mode for ActiveAdmin to work, it has allowed me to get even more
familiar with Ruby and Ruby on Rails itself. As with any project, doing your best
to take advantage of any chosen library's capacity to speed up development and to
keep focused on fleshing out tougher features, not only makes for a better product
but makes the dev's life much easier. Rails definitely delivers on that promise,
and has allowed me to tame both these beasts, especially React and the many techniques
that it employs to create beautiful front-ends.

While writing the two apps, I had plenty of time to think about the number of projects
I had written going through my Mobile Apps Minor at the University of Southern California,
and found myself thinking that my journey as a software developer is exactly how
I'd layout my portfolio, step by step, project by project, and type by type. From
mobile app development to web development and even basic GUI development, I feel
confident as ever to take on any task in any language or framework and that's exactly
what I'd like to convey! While relatively simple compared to my passion projects,
like the Infection Control web, Android and iOS apps or my Laravel + VueJS Accounting
On It property management web app, the tech options behind it and the possibilities
they bring feel endless. As a result, I look forward to improving it and adding
to it each and every year!

## Future Development

- Drop ActiveAdmin for simple React-based forms + Login via same Devise system.
- Create a Swagger UI inspired routes list
  - Front-end: New List view to display the routes in the admin section
  - Back-end: Sends routes list - DONE
- Update Front-end to timeline-based design with new and improved RPG-based homepage
- Contact Me Front-end & Back-end should add a "sender's name" field
- Include the following in Database:
  - Laravel + Vue Accounting On It
  - Classic GUIs, made with JavaFx
- Consider Codecov or Coveralls for better, more visible coverage reports
- Add E2E testing to ensure UI works as intended and is accessible
  - `Capybara` is probably the best option, particularly with `Cuprite`, not Selenium
- Migrate Dockerfile from `debian:bookworm` (aka `ruby-slim`) to `alpine` if possible
  - Probably simplest to start with `fly-apps/dockerfile-rails` and its generator

## Recent Changes

- Updated to Ruby on Rails 7.2
  - Provided `.devcontainer` local development option
  - Added default Dockerfile without Node setup
  - Added `brakeman` static security analyzer, runnable via `bin/brakeman`
  - Added `rubocop-rails-omakase` to replace `rubocop-rails`, runnable via `bin/rubocop`
- Updated Ruby from 3.1 to 3.3
- Fixed Railway Health-Check
- Database
  - Updated DB Seeder for better readability in Ruby 3.3 with Rubocop
  - Migration added an "importance" and "start_date" column to Posts table for
  easier sorting in the front-end
  - Add Script to `lib/tasks` migrating images to AWS S3, fetchable from AWS Cloudfront
    - Replaced `foreman` w/ `dotenv` for grabbing ENV vars in script tasks
- Contact Me Front-end + Back-end Setup
  - MailTrap currently is the Email Infrastructure (SMTP) provider
    - 1000 emails per month and ALSO 100 test emails per month
  - Contact feature turned off by Env Var until domain name chosen & linked to Mailtrap

## Helpful Notes

### Rails and its Commands

- Useful Rails Commands - To Serve and Display Locally `bin/rails start`
  - Under the hood, as seen in `lib/tasks/start.rake`, this simple command calls
  `bin/rails start:development` which uses Hivemind to load Env Vars like `foreman`
    - Even deeper under the hood, the commands laid out by `Procfile.dev` are:
      - An API process running the Rail server via `bin/rails s` on Port 3001
      - A web process running the React front-end in development mode via
      `pnpm -C react-client start` on Port 3000
  - For a list of commands, run `bin/rails` in the root rails dir
    - The `dotenv` gem grabs Env Vars for Rails commands, NOT for custom Rake tasks
    UNLESS they have `require 'dotenv/tasks'` to load the Env Var via `:dotenv`
  - `bin/rails app:update` -> Update old files + generate files for new Rails version
  after updating Gemfile and running `bundle install`
    - It creates a new `new_framework_defaults` file, listing settings that changed
    or were added, and will be loaded after updating the version set by `config.load_defaults`
    in `config/application.rb`
      - To see how these settings will change your app, uncomment them one by one,
      and finally change `config.load_defaults` once all settings work properly
        - If you prefer a setting remain the same, you can configure it in `config/application.rb`
        OR configure it for a single environment in the `config/environment` folder
      - Minor updates (ex: 6.0 to 6.1) don't usually break anything BUT still need
      an update to `config.load_defaults`. Similarly, patch updates (ex: 5.2.4 to
      5.2.6) also generate a `new_framework_defaults` file BUT don't need any changing
  - `bin/rails server` -> Start up the server (shortcut -> `bin/rails s`)
  - `bin/rails test` -> Test all except system tests (shortcut -> `bin/rails t`)

### Root Package.json Commands

- When deploying to Railway, there are 3 commands:
  - The `railway-install` command ensures the needed dependencies are installed
  via a frozen-lockfile that will ensure the same versions used here are used on
  Railway. The frozen lockfile will not be updated if PNPM notices the dependencies
  can be upgraded, therefore we get the exact same build later.
  - The `railway-build` command in the Rails root `package.json` is used to switch
  the current working dir to the `react-client` dir, and uses `pnpm build` to
  make the production build in the `react-client/dist` dir for Rails to serve
  - The `railway-copy` command in the rails root `package.json` copies the production
  `react-client/dist` dir contents into the Rails `public` folder to serve up!
    - ZSH/Bash Note: The copy command's '-R' flag usually grabs BOTH the directory
    and its contents BUT adding a '/.' to the copied dir grabs just the content
      - The target directory doesn't need a trailing '/' but included for symmetry
  - The `railway-deploy` command simply combines `railway-build` and `railway-copy`
    - The copy command's '-a' flag copies files with all meta-data preserved
    - Files copied over will overwrite any files in target dir with matching names
