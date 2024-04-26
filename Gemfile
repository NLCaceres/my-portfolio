source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '3.3.1'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 7.1.3'
# Use postgresql as the database for Active Record
gem 'pg', '>= 0.18', '< 2.0'
# Use Puma as the app server
gem 'puma', '~> 6.0' # '~> 4.1'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
# gem 'jbuilder', '~> 2.7'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 4.0'
# Use Active Model has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Automatically loads Env vars when Rails starts + provides Rake tasks with a 'dotenv' task
gem 'dotenv', '~> 3.1'

# Use Active Storage variant
# gem 'image_processing', '~> 1.2'

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', '>= 1.4.4', require: false

# Use Rack CORS for handling Cross-Origin Resource Sharing (CORS), making cross-origin AJAX possible
# gem 'rack-cors'

# To give ActiveAdmin its stylesheets
gem 'sassc-rails'
# ActiveAdmin (With API version 'rails g devise:install' command followed by 'rails g active_admin:install' required to get things working as needed)
gem 'devise', '~> 4.8'
gem 'activeadmin', '~> 3.2'
# Rack-Attack (Adds throttling and blacklisting to Rack apps like Rails)
gem 'rack-attack', '>= 6.5', '< 6.8' # Based on current pace, 6.8 would drop ruby 2.7 BUT Rails 7 may be ready + have Ruby 3 support

gem 'aws-sdk-s3', '~> 1' # Thanks to V3's Modularization, it's best to take ONLY the AWS service gem you need

group :development, :test do #? Replace byebug & ruby-debug+debase with Rails 7's choice Ruby's default: debug
  gem 'debug', ">= 1.0.0", platforms: [:mri, :mingw, :x64_mingw]
  gem 'listen', '~> 3.0'
end

group :development do
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.1.0'
  gem 'rubocop'
  gem 'rubocop-rails', '~> 2.24'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
