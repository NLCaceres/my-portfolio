require 'test_helper'

#* Basic EmailsController Tests
class EmailsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  default_params = { email: 'foo@example.com', message: 'Barfoo', cfToken: '1' }

  test 'Turnstile human verification results in specific responses' do
    ENV['VITE_CONTACTABLE'] = 'true'

    #* On Success will receive success = true & empty error-codes
    ENV['TURNSTILE_SECRET_KEY'] = '1x0000000000000000000000000000000AA'
    post contact_email_url, headers: accept_header, params: default_params
    successful_email_response = @response.parsed_body
    assert successful_email_response['success']
    assert_empty successful_email_response['error-codes']

    #* On Failure will receive success = false & error-code arr w/ 'invalid input'
    ENV['TURNSTILE_SECRET_KEY'] = '2x0000000000000000000000000000000AA'
    post contact_email_url, headers: accept_header, params: default_params
    failed_email_response = @response.parsed_body
    refute failed_email_response['success']
    assert_not_empty failed_email_response['error-codes']
    assert_equal 1, failed_email_response['error-codes'].size
    assert_equal 'invalid-input-response', failed_email_response['error-codes'][0]

    #* If Token Used will receive success = false & error-code arr w/ 'timeout/duplicate'
    ENV['TURNSTILE_SECRET_KEY'] = '3x0000000000000000000000000000000AA'
    post contact_email_url, headers: accept_header, params: default_params
    invalid_email_response = @response.parsed_body
    refute invalid_email_response['success']
    assert_not_empty invalid_email_response['error-codes']
    assert_equal 1, invalid_email_response['error-codes'].size
  end

  # rubocop:disable Metrics/BlockLength
  test 'should send email if contactable, with a valid email AND verified by Turnstile' do
    ENV['VITE_CONTACTABLE'] = 'false'
    post contact_email_url, headers: accept_header, params: default_params
    assert_response :forbidden

    #* Following dummy secret key normally would succeed
    ENV['TURNSTILE_SECRET_KEY'] = '1x0000000000000000000000000000000AA'
    post contact_email_url, headers: accept_header, params: default_params
    assert_response :forbidden

    #* Following secret key normally would fail
    ENV['TURNSTILE_SECRET_KEY'] = '2x0000000000000000000000000000000AA'
    post contact_email_url, headers: accept_header, params: default_params
    assert_response :forbidden

    #* Once the app is contactable
    ENV['VITE_CONTACTABLE'] = 'true'

    #* THEN an invalid email param will send a Bad Request response
    post contact_email_url, headers: accept_header, params: { email: 'foo', message: 'Bar', cfToken: '1' }
    assert_response :bad_request
    #? Following emails are invalid due to invalid TLDs (i.e. '.example' and '.c' which is too long and too short)
    post contact_email_url, headers: accept_header, params: { email: 'foo@email.example', message: 'Bar', cfToken: '1' }
    assert_response :bad_request
    post contact_email_url, headers: accept_header, params: { email: 'foo@example.c', message: 'Bar', cfToken: '1' }
    assert_response :bad_request

    #* THEN a dummy secret expected to fail should send the fail response w/out an email sent
    ENV['TURNSTILE_SECRET_KEY'] = '2x0000000000000000000000000000000AA'
    post contact_email_url, headers: accept_header, params: default_params
    failed_email_response = @response.parsed_body
    assert_equal 'Unable to send your email!', failed_email_response['message']

    #* THEN the dummy secret key expected to succeed should send a successful response out
    ENV['TURNSTILE_SECRET_KEY'] = '1x0000000000000000000000000000000AA'
    assert_emails 1 do
      post contact_email_url, headers: accept_header, params: default_params
    end
    successful_email_response = @response.parsed_body
    assert_equal 'Successfully sent your email!', successful_email_response['message']
  end
end
