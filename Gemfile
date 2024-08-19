source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '3.3.1'

gem 'rails', '~> 7.2.0'

gem 'bootsnap', '>= 1.4.4', require: false # Reduce boot times through caching; required in config/boot.rb
gem 'dotenv', '~> 3.1' # Auto-loads Env vars when Rails starts + provides Rake tasks with a 'dotenv' task
gem 'pg', '>= 0.18', '< 2.0' # Database for ActiveRecord
gem 'puma', '~> 6.0' # Puma acts as the app server
gem 'tzinfo-data', platforms: %i[mingw mswin x64_mingw jruby] # Bundle this gem to provide zoneinfo files to Windows

# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
# gem 'jbuilder', '~> 2.7'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 4.0'
# Use Active Model has_secure_password
# gem 'bcrypt', '~> 3.1.7'
# Use Active Storage variant
# gem 'image_processing', '~> 1.2'
# Use Rack CORS for handling Cross-Origin Resource Sharing (CORS), making cross-origin AJAX possible
# gem 'rack-cors'

gem 'aws-sdk-s3', '~> 1' # Thanks to AWS v3's modularization, it's now best to take ONLY the AWS service gem you need

gem 'activeadmin', '~> 3.2'
gem 'devise', '~> 4.8' # Adds Auth to ActiveAdmin via `rails g devise:install` before running the ActiveAdmin install
gem 'sassc-rails' # Gives ActiveAdmin its stylesheets that can be overriden

gem 'rack-attack', '>= 6.5', '< 6.8' # Adds throttling and blacklisting to Rack apps like Rails

group :development, :test do
  gem 'debug', ">= 1.0.0", platforms: %i[mri mingw x64_mingw]
  gem 'listen', '~> 3.0'
end

group :development do
  gem 'rubocop'
  gem 'rubocop-rails', '~> 2.24'

  gem 'spring' # Speeds up dev by keeping app running in the background. For more info, see https://github.com/rails/spring
  gem 'spring-watcher-listen', '~> 2.1.0'
end
