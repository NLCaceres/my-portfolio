# My Portfolio! Data Brought To You By Rails

Originally written using Rails 5, my React-based portfolio would fetch data from a fully fledged Rails app, perfectly capable of serving up its own html. Around the same time that I started building out the two apps, front-end and back-end, Rails 6 was be released. As it released, I looked further into the documentation and found a great solution to get things up and running faster, API mode! A Rails app can very easily be created using the CLI, and with the addition of the '--api' flag, it'll drop any unnecessary middleware, leaving behind a powerful but lightweight Rails API! Though I've had to sacrifice API mode for ActiveAdmin to work, it has allowed me to get even more familiar with Ruby and Ruby on Rails itself. As with any project, doing your best to take advantage of any chosen library's capacity to speed up development and to keep focused on fleshing out tougher features, not only makes for a better product but makes the dev's life much easier. Rails definitely delivers on that promise, and has allowed me to tame both these beasts, especially React and the many techniques that it employs to create beautiful front-ends. 

While writing the two apps, I had plenty of time to think about the number of projects I had written going through my Mobile Apps Minor at the University of Southern California, and found myself thinking that my journey as a software developer is exactly how I'd layout my portfolio, step by step, project by project and type by type. From mobile app development to web development and even basic GUI development, I feel confident as ever to take on any task in any language or framework and that's exactly what I'd like to convey! While relatively simple compared to my passion projects, like the Infection Control web, Android and iOS app or my Laravel + VueJS Accounting On It property management web app, the tech options behind it and possibilities feel endless. As a result, I look forward to improving it and adding to it each and every year!

## Future Development
- Drop ActiveAdmin for simple React-based forms + Login via same Devise system.
  - Can update to Rails 7 in API mode
  - No need to move to Webpacker via `bin/rails webpacker:install`, which would also require using `bin/rails g active_admin:install` 
  as well as adding `config.use_webpacker = true` in `config/initializers/active_admin.rb`
    - Currently, Sprockets is handling the CSS + images
- Create a Swagger UI inspired routes list
  - Front-end: New List view to display the routes in the admin section
  - Back-end: Sends routes list - DONE
- Update Front-end to timeline-based design with new and improved RPG-based homepage
- Contact Me Front-end & Back-end should add a "sender's name" field
- Include the following in Database:
  - Laravel + Vue Accounting On It
  - Classic GUIs, made with JavaFx
- Consider Codecov or Coveralls for better, more visible coverage reports

## Recent Changes
- Updated Ruby from 2.7 to 3.1
- Database 
  - Updated DB Seeder for better readability in Ruby 3.1 with Rubocop
  - Migration adding an "importance" and "start_date" column to Posts table for better sorting in the front-end
  - Add Script to `lib/tasks` that migrates images to AWS S3 for easy fetching from AWS Cloudfront
- Contact Me Front-end + Back-end Setup
  - MailTrap currently is the Email Infrastructure (SMTP) provider
    - 1000 emails per month and ALSO 100 test emails per month
  - Contact feature controlled by an env var, BUT currently turned off until domain name chosen so Mailtrap can be linked to it

## Notes to Remember! - June 2023
### Bundler
- A nifty package manager for Ruby with two ways of updating
  - `bundle install` conservatively updates packages once you modify the Gemfile. It only will update based on changes
  - `bundle update` on the other hand, will update all packages to their latest versions, respecting the limits set by the Gemfile
    BUT updating as much as it can nonetheless. This can be good and bad! It'll resolve any Gemfile lock issues as an example but may cause breaking changes
  - `bundle outdated --minor` and `bundle outdated --filter-minor` particularly helpful for checking for smaller upgrades and preventing said breaking changes before running `bundle update`
    - BUT just flat out using `bundle update --minor` DOES guarantee only minor upgrades (e.g. 1.0 to 1.1) will happen if the Gemfile permits such updates to happen for certain packages (i.e. "~> 1.0" and "'>= 1.0', '< 2.0'" would both get minor updates!)
- Bundler can be configured via a file named 'config' placed in a '.bundle' folder
  - There is a TON of options to configure how Bundler runs. [For the keys, check out this 'bundler config' doc page](https://bundler.io/v2.3/man/bundle-config.1.html)
    - BUT the most important key is 'path' which defines where Bundler installs gems
      - To set it, run `bundle config set --local path vendor/bundle`
      - Typically 'path' is set to vendor/bundle (same as running `bundle install --deployment`)
      - Setting 'path' avoids installing gems to the global gem list, isolating your app
  - To create a config file, just run `bundle config set --local <key> <value>`. By setting some config key, bundler will automatically create the config file with the new value all setup and ready to go.
    - The local flag isn't technically needed since it's the default (as opposed to --global) BUT it's a useful reminder that you're configuring your local directory
  - Using the Config file is best practice for Bundler 2+ due to an incoming change to how Bundler handles config flags. 
    - Bundler 1 & 2 can unexpectedly setup a config file just by using flags while running commands like "install", or "update", which makes flags stateful!
    - Bundler 3 intends to change this, which could cause even more unexpected behavior. 
      - As a result, setting up a config file and being aware of default behavior guarantees consistent command usage across platforms
      - If you need to alter behavior of a command ONCE, then flags will still be available

### Rails and its Commands
- Useful Rails Commands - To Serve and Display Locally `bin/rails start`
  - Under the hood, as seen in `lib/tasks/start.rake`, this simple command calls `bin/rails start:development` which uses Foreman to handle Env variables
    - Similar to `heroku local` (which is built on top of Foreman), any local env variables will be automatically pulled into the processes 
    laid out by the local `Procfile`
    - `bundle exec foreman local -f Procfile.dev` is the command being called to tell bundler to use the 'development group' Foreman gem to
    run the processes laid out by `Procfile.dev`
    - Even deeper under the hood, the commands laid out by `Procfile.dev` are:
      - An API process running the Rail server via `bin/rails s` on Port 3001
      - A web process running the React front-end in development mode via `yarn --cwd react-client start` on Port 3000
  - For list of commands, run `bin/rails` in the root rails dir
  - `bin/rails app:update` -> Update old files and generate any new ones after updating the Gemfile and running `bundle install`
    - Running this command makes a 'new_framework_defaults' file, which lists settings that will be turned on or changed when you update config.load_defaults in config/application.rb from oldMaj.oldMin to newMaj.newMin (e.g. 6.0 to 6.1). 
      - So it's best to uncomment line by line to see how each changes/breaks things rather than update config.load_defaults first and break things all at once.
        - Minor updates (ex: 6.0 to 6.1) may break nothing allowing you to quickly update config.load_defaults without a problem BUT better to be cautious
        - You may not want to change a line/option in new_framework_defaults so either change it across environments by placing it at the end of config/application.rb OR add it to a single environment in the config directory
        - Patch updates (ex: 5.2.4 to 5.2.6) still make a new_framework_defaults file BUT in that case, config.load_defaults does not need to be updated ('config.load_defaults 5.2') and nothing should break.
  - `bin/rails server` -> Start up the server (shortcut -> `bin/rails s`)
  - `bin/rails test` -> Test all except system tests (shortcut -> `bin/rails t`)
  - A weird quirk about Rails! Its root route only works if there is no index.html file in its public folder!
    - Therefore if you want to run a controller action instead of serving that index.html file, you MUST rename the index.html file 
    or simply delete it all together
    - Since React creates a index.html file by default during its build process, it's important to rename it and serve our renamed file instead
    so we can actually see React do its magic once served by the controller's action (in this case application#fallback_redirect)

### Debugging Rails 6+ Apps on Ruby 3+ via Ruby's debug gem
- Must use the VSCode rdbg extension to attach the gem to a process started by the `rdbg` command
  - Ex: `bin/rdbg -n --open=vscode -c -- bin/rails s` to start the server process, letting it wait for a debugger to attach
    - To use 'bin/rdbg', must generate a binstub for ruby/debug's rdbg via `bundler binstubs debug`
  - THEN go to VSCode's `Run and Debug` Tab and launch `Attach rdbg` to start debugging!
    - Launch.json Config: 
      - `{ "type": "rdbg", "name": "Attach rdbg", "request": "attach", "rdbgPath": "${workspaceRoot}/path/to/exe/rdbg" }`
    - rdbgPath ex: `"rdbgPath": "${workspaceRoot}/vendor/bundle/ruby/3.1.0/gems/debug-1.7.1/exe/rdbg"`
- BUT to debug Rails tests, we need a bit more complex launch.json config as seen below!
  ```
  { 
    "type": "rdbg", 
    "request": "launch", 
    "rdbgPath": "${workspaceRoot}/path/to/exe/rdbg", 
    "command": "${workspaceRoot}/bin/rails", 
    "script": "test", 
    "args": []
  }
  ```
  - Several key differences: 
    - "request" must be set to launch
    - "command" must be simply set to 'bin/rails'
    - "script" set to 'test'
    - Odd note: "Args" must be set but since we have no flags or args to include it simply is an empty array.
  - ADDITIONALLY, MUST modify two files before starting the tests w/ debugger
    - 'bin/rails' file must comment out line 2 to prevent Spring preloader from launching its own process since ruby/debug can't attach itself to Spring
    - 'test_helper' file must run 'parallelize(workers: 1)' to prevent multiple processes from launching since they can force-complete the tests, skipping breakpoints
- Why not use byebug or ruby-debug-ide?
  - Byebug is a bit simple. Useful! but not powerful nor well integrated with VSCode
  - ruby-debug-ide, on the other hand, as of Dec 2022, has issues running on MacOS due to debase 0.2.4 (that are seemingly unlikely to be fixed soon)

### My Package.json Commands
- Preface to next point, Facebook still uses yarn primarily BUT since yarn is installed via NPM (on Railway), it's pretty easy to get confused. 
  - `npx create-react-app app-name` still used to make a new React app. 
  - Yarn commands mentioned in the React README handle the production build + testing. Also includes `yarn start` identical in use to the typical `npm start`
- When deploying to Railway, it will use 3 commands to install, build and deploy the React files
  - The `railway-install` command ensures the needed dependencies are installed via a frozen-lockfile that will ensure the same versions used here are used on Railway.
  The frozen lockfile will not be updated if Yarn notices the dependencies can be upgraded, therefore we get the exact same build later.
  - The `railway-build` command in the Rails root `package.json` is used to switch the current working directory to the react-client directory, and uses `yarn build` to make the production build for Rails to serve
      - React uses `yarn build` to make the production build in its root `build` dir, in this case the `/react-client` folder. Here, our Rails root `package.json` must drop down a directory into the `/react-client` dir to use React's `yarn build` version of the command
  - The `railway-copy` command in the rails root 'package.json' copies the production build dir from react-client into the rails public folder to serve up!
    - Note on ZSH/Bash: Normally using '-R' with copy command, one would expect to copy both the directory and the contents! But here the goal is to
      copy JUST the contents of the build dir over not the build dir itself! For that reason, a trailing '/.' is included. The target dir 
      (our rails public dir) doesn't need the trailing slash but it's included for symmetry
      - The '-a' flag used in 'deploy' works similarly! BUT added bonus of copying files EXACTLY as is (file dates and stats preserved)
      - Any files that match in name will be overwritten (source directory version will overwrite the target's version)
  - Ultimately, `railway-deploy` is used to combine 'railway-build' and 'railway-copy' into a simple command for Railway to use.