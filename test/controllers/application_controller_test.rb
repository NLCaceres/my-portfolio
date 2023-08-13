require 'test_helper'

#* Tests common redirect to React Frontend as well as GET RoutesList response
class ApplicationControllerTest < ActionDispatch::IntegrationTest
  default_params = { email: 'foo@example.com', message: 'Barfoo', cfToken: '1' }

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
    assert_redirected_to 'http://www.example.com:3000/portfolio'
  end

  test 'most routes should redirect' do
    ENV['RAILS_ENV'] = 'production'
    get '/foo' #* Fires off request on port 3001 but will always redirect to 3000
    File.file?("#{Rails.root}/public/main.html") ? (assert_response :success) : (assert_response :not_found)

    ENV['RAILS_ENV'] = 'test'
    get '/bar'
    assert_response :redirect
    assert_redirected_to 'http://www.example.com:3000/portfolio'

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

  test 'should GET human-readable routes list' do
    get routes_url, headers: accept_header
    assert_response :success
    assert_equal 10, @response.parsed_body.size # Should get an Array of CURRENTLY 10 Hashes representing 10 routes
  end

  test 'should receive redirect or invalid header message' do
    get routes_url
    assert_redirect_to_react # Get redirect if simple GET w/out headers added

    get routes_url, headers: accept_header('*/*') # If has unexpected header then Rails sends badRequest instead
    assert_response :bad_request
    assert_equal 'Invalid accept header', @response.body
  end

  test 'Turnstile human verification delivers a particular response' do
    ENV['REACT_APP_CONTACTABLE'] = 'true'

    #* On Success will receive success = true & empty error-codes
    ENV['TURNSTILE_SECRET_KEY'] = '1x0000000000000000000000000000000AA'
    post send_email_url, headers: accept_header, params: default_params
    successful_email_response = @response.parsed_body
    assert successful_email_response['success']
    assert_empty successful_email_response['error-codes']

    #* On Failure will receive success = false & error-code arr w/ 'invalid input'
    ENV['TURNSTILE_SECRET_KEY'] = '2x0000000000000000000000000000000AA'
    post send_email_url, headers: accept_header, params: default_params
    failed_email_response = @response.parsed_body
    refute failed_email_response['success']
    assert_not_empty failed_email_response['error-codes']
    assert_equal 1, failed_email_response['error-codes'].size
    assert_equal 'invalid-input-response', failed_email_response['error-codes'][0]

    #* If Token Used will receive success = false & error-code arr w/ 'timeout/duplicate'
    ENV['TURNSTILE_SECRET_KEY'] = '3x0000000000000000000000000000000AA'
    post send_email_url, headers: accept_header, params: default_params
    invalid_email_response = @response.parsed_body
    refute invalid_email_response['success']
    assert_not_empty invalid_email_response['error-codes']
    assert_equal 1, invalid_email_response['error-codes'].size
  end

  test 'should send email if contactable AND verified by Turnstile' do
    ENV['REACT_APP_CONTACTABLE'] = 'false'
    post send_email_url, headers: accept_header, params: default_params
    assert_response :forbidden

    #* Following dummy secret key normally would succeed
    ENV['TURNSTILE_SECRET_KEY'] = '1x0000000000000000000000000000000AA'
    post send_email_url, headers: accept_header, params: default_params
    assert_response :forbidden

    #* Following secret key normally would fail
    ENV['TURNSTILE_SECRET_KEY'] = '2x0000000000000000000000000000000AA'
    post send_email_url, headers: accept_header, params: default_params
    assert_response :forbidden

    #* Once the app is contactable
    ENV['REACT_APP_CONTACTABLE'] = 'true'

    #* THEN a dummy secret expected to fail should send the fail response w/out an email sent
    ENV['TURNSTILE_SECRET_KEY'] = '2x0000000000000000000000000000000AA'
    post send_email_url, headers: accept_header, params: default_params
    failed_email_response = @response.parsed_body
    assert_equal 'Unable to send your email!', failed_email_response['message']

    #* THEN the dummy secret key expected to succeed should send a successful response out
    ENV['TURNSTILE_SECRET_KEY'] = '1x0000000000000000000000000000000AA'
    assert_emails 1 do
      post send_email_url, headers: accept_header, params: default_params
    end
    successful_email_response = @response.parsed_body
    assert_equal 'Successfully sent your email!', successful_email_response['message']
  end
end
