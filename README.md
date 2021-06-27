# My Portfolio! Data Brought To You By Rails

Originally written using Rails 5, my React-based portfolio would fetch data from a fully fledged rails app, perfectly capable of serving up it's own html. Around the same time that I started building out the two apps, front-end and back-end, Rails 6 would be released. As it released, I looked further into the documentation and found a great solution to get things up and running faster, API mode! A Rails app can very easily be created using the CLI, and with the addition of the '--api' flag, it'll drop any unnecessary middleware, leaving behind a powerful but lightweight Rails API! As with any project, doing your best to take advantage of the framework's abilities to speed up development and keep focused on fleshing out tougher features, not only make for a better product but can make the dev's life tremendously easier. Rails definitely delivers on that promise, and has allowed me to look much more into taming the beast that is React and the many ways it can create beautiful front-ends. 

While writing the two apps, I had plenty of time to think about the number of projects I had written going through my Mobile Apps Minor at the University of Southern California, and found myself thinking that my journey as a software developer is exactly how I'd layout my portfolio, step by step, project by project and type by type. From mobile app development to web development and even basic GUI development, I feel confident as ever to take on any task in any language or framework and that's exactly what I'd like to convey! While relatively simple compared to my passion projects, like the Infection Control web, Android and iOS app or my Account On It property management web app, the tech behind it and possibilties feel endless, and I look forward to improving it and adding to it year after year!

## Future Development
- From here out, focus on this project rather than the Rails 5 version. 
  - Create a Swagger UI inspired routes list view 
- Contact Us from the back-end!

## Notes to Remember! - May 2021
- Useful Rails Commands - To Serve and Display Locally `bin/rails s & yarn --cwd react-client start`
  - To see a list just run `bin/rails` in the root rails dir
  - `bin/rails app:update` -> Update old files and generate any new ones after updating the Gemfile and running `bundle install`
    - Running this command makes a new_framework_defaults file. This file lists settings that will be turned on or changed when you update config.load_defaults in config/application.rb from oldMaj.oldMin to newMaj.newMin (ex: 6.0 to 6.1). 
      - So goal becomes: Uncomment one line at a time and see how things change or break rather than update config.load_defaults first and break things all at once.
        - It IS possible that a minor update (ex: 6.0 to 6.1) breaks absolutely nothing and you can just update config.load_defaults without a problem BUT better safe than sorry. 
        - Also possible (though unlikely) you don't want to change a line/option in new_framework_defaults so either add that line with the value you want to the end of config/application.rb OR add it to the appropriate config/environments/*.rb
        - Also worth noting that a patch update (ex: 5.2.4 to 5.2.6) will still make a new_framework_defaults file BUT in that case, config.load_defaults will remain the same ('config.load_defaults 5.2'), nothing should break, and no changes needed.
  - `bin/rails server` -> Start up the server (shortcut -> `bin/rails s`)
  - `bin/rails test` -> Test all except system tests (shortcut -> `bin/rails t`)
- Preface to next point, Facebook still uses yarn primarily BUT since npm is actually the primary installer of yarn, it's pretty easy to get confused. 
  - `npx create-react-app app-name` still used to make a new React app. 
  - Yarn scripts are included in the README to handle the production build and testing, BUT it also includes `yarn start` which is identical to `npm start` 
- When pushing up to Heroku, we use `postbuild` to run 2 custom commands `build` & `deploy`
  - Our `build` script in the rails root 'package.json' is used to switch the current working directory to the react-client directory, install dependencies via `yarn install` and then uses `yarn build` to make the production build.
      - `yarn build` is actually a default script for react to make the production build in 'build' dir so worth noting that our custom one is different, though it does drop down into the react-client directory to run its version of `yarn build`
  - Our `deploy` script in the rails root 'package.json' copies the production build dir from react-client into the rails public folder to serve up!
- Bundler is a nifty package manager for Ruby with two ways of updating
  - `Bundle install` conservatively updates packages once you modify the Gemfile. It only will update based on changes
  - `Bundle update` on the other hand, will update all packages to their latest versions, respecting the limits set by the Gemfile
    BUT updating as much as it can nonetheless. This can be good and bad! It'll resolve any Gemfile lock issues as an example but may cause breaking changes
  - `Bundle outdated --minor` particularly helpful for checking for smaller upgrades and preventing said breaking changes before running `bundle update`
    - On the other hand, just flat out using `bundle update --minor` guarantees only minor upgrades (e.g. 1.0 to 1.1) will happen if the Gemfile allows some gems to updated across major versions (e.g. 1.x to 2.x)
- Could update to ruby 3 BUT Rails 6 might not be ready for it (>= 2.5)
- Rails 6+ does use Webpacker 5.x (which is a Webpack bundler and not Webpack itself) BUT since React can bundle up itself, it's probably best to let it handle the production build and just let Rails serve up the main React page as well as send the json data.
  - As a quick note, Webpacker 5.x uses webpack 4.x meanwhile if Rails upgrades to Webpacker 6.x (current), it'll be webpack 5.x