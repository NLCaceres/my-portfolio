require 'test_helper'

#* Tests common redirect to React Frontend
class ApplicationControllerTest < ActionDispatch::IntegrationTest
  teardown do
    ENV['RAILS_ENV'] = 'test'
    cookies.delete 'CSRF-TOKEN'
  end

  test 'should notify user that server is unavailable in production/staging' do
    ENV['RAILS_ENV'] = 'production'
    get '/health-check'
    #* During tests (RailsServerConst = false || PumaProgramName = false && PumaServerConst = true)
    #* Check therefore fails so GET unavailable response
    assert_response :service_unavailable
  end

  test 'should successfully perform redirect from health-check in dev' do
    get '/health-check'
    #* Following represents typical fallback_redirect development route
    assert_response :redirect
    assert_redirected_to 'http://www.example.com:3000/portfolio/about-me'
  end

  test 'most routes should redirect' do
    ENV['RAILS_ENV'] = 'production'
    get '/foo' #* Fires off request on port 3001 but will always redirect to 3000
    File.file?("#{Rails.root}/public/main.html") ? (assert_response :success) : (assert_response :not_found)

    ENV['RAILS_ENV'] = 'test'
    get '/bar'
    assert_response :redirect
    assert_redirected_to 'http://www.example.com:3000/portfolio/about-me'

    get '/admin/login' #* The ONE admin request that won't redirect
    assert_response :success

    get '/admin' #* Gets redirected to '/admin/login' still on port 3001
    assert_response :redirect
    assert_redirected_to 'http://www.example.com/admin/login'
  end

  test 'should send csrf-token on loading of SPA after redirecting to it' do
    assert_nil cookies['CSRF-TOKEN'] #* Not set yet

    get '/' #* Cookie now going to be set
    csrf_token = cookies['CSRF-TOKEN']
    assert_not_nil csrf_token

    #? Anytime a redirect is triggered a new csrf-token is sent, just like if Rails was serving each page via erb layout
    get '/foobar' #* In production, only 1 is sent, the initial visit, all other redirects are handled by React
    assert_not_equal csrf_token, cookies['CSRF-TOKEN']

    get '/admin' #* Even without redirect cookie remains set
    assert_not_nil cookies['CSRF-TOKEN']
  end
end
