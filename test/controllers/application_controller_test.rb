require 'test_helper'

#* Tests common redirect to React Frontend as well as GET RoutesList response
class ApplicationControllerTest < ActionDispatch::IntegrationTest
  test 'should notify user that server is unavailable or successfully perform dev redirect' do
    get '/health-check'
    if ENV['RAILS_ENV'] == 'production'
      #* During tests (RailsServerConst = false || PumaProgramName = false && PumaServerConst = true)
      #* Check therefore fails so GET unavailable response
      assert_response :service_unavailable
    else #* Following represents typical fallback_redirect development route
      assert_response :redirect
      assert_redirected_to 'http://www.example.com:3000/portfolio'
    end
  end
  test 'should redirect' do
    get '/foo' #* Fires off request on port 3001 but will always redirect to 3000
    if ENV['RAILS_ENV'] == 'production'
      assert_response :success
      assert_match 'Foobar', @response.body
    else
      assert_response :redirect
      assert_redirected_to 'http://www.example.com:3000/portfolio'
    end

    get '/admin' #* Gets redirected still on port 3001
    assert_response :redirect
    assert_redirected_to 'http://www.example.com/admin/login'
  end
  test 'should not redirect' do
    get '/admin/login' #* The ONE request that won't redirect
    assert_response :success
  end

  test 'should GET human-readable routes list' do
    get routes_url, headers: { 'ACCEPT' => 'application/json' }
    assert_response :success
    assert_equal 9, @response.parsed_body.size # Should get an Array of CURRENTLY 9 Hashes representing 9 routes
  end

  test 'should receive redirect or invalid header message' do
    get routes_url
    assert_redirect_to_react # Get redirect if simple GET w/out headers added

    get routes_url, headers: { 'ACCEPT' => '*/*' } # If has unexpected header then Rails sends badRequest instead
    assert_response :bad_request
    assert_equal 'Invalid accept header', @response.body
  end
end
