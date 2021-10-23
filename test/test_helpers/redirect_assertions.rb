#* Combine assertions with particularly common redirect locations
module RedirectAssertions
  def assert_redirect_to_login
    #? If included in the IntegrationTest parent class, this method can access @response instance var
    assert_response :redirect
    assert_redirected_to new_admin_user_session_url
  end

  def assert_redirect_to_react
    if ENV['RAILS_ENV'] == 'production'
      assert_response :success
      assert_match 'Foobar', @response.body
    else
      assert_response :redirect
      assert_redirected_to 'http://www.example.com:3000/portfolio'
    end
  end
end
