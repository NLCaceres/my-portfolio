require 'test_helper'

#* Basic RoutesController Tests
class RoutesControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  test 'should GET human-readable routes list' do
    get routes_url, headers: accept_header
    assert_response :success
    assert_equal 10, @response.parsed_body.size #* Should get an Array of CURRENTLY 10 Hashes representing 10 routes
  end

  test 'should receive redirect without headers' do
    get routes_url
    assert_redirect_to_react #* Get redirect if simple GET w/out headers added
  end

  test 'should receive Bad Request if unexpected headers found' do
    get routes_url, headers: accept_header('*/*')
    assert_response :bad_request
    assert_equal 'Invalid accept header', @response.body
  end
end
