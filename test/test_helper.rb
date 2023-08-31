ENV['RAILS_ENV'] = 'test' #? Set to 'production' to imitate Railway (likely need a staging version)
ENV['MY_CONTACT_EMAIL'] = 'foo@example.com' #? Ensures Mailers have defaults even w/out Foreman or Hivemind
ENV['APP_CONTACT_EMAIL'] = 'bar@example.com'
require_relative '../config/environment'
require 'rails/test_help'
require 'test_helpers/redirect_assertions'
require 'test_helpers/common_headers'

#* All Rails tests start here with a few configuration options like parallelize and fixtures
class ActiveSupport::TestCase
  # Run tests in parallel with specified workers
  parallelize(workers: 1) #? Default arg, :number_of_processors, grabs # of cores on your computer to parallelize work
  #? Any # above 1 will begin making copies of your test db (testdb-0, testdb-1, etc...)
  #? Using 'workers: 1' + commenting out 'bin/rails' ln2 allows rdbg to debug tests in VSCode launch.json
  #? Because multiple processes + Spring preloader can cause ruby/debug to detach

  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  # Add more helper methods to be used by all tests here...
end

#? Classes that inherit from below class get methods from included modules making adding test helpers easy!
#? Also need to be sure to add "require 'test_helper'" at the top of the file!
class ActionDispatch::IntegrationTest
  include RedirectAssertions
  include CommonHeaders
end
