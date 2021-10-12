class ApplicationControllerTest < ActionDispatch::IntegrationTest
  test 'should redirect' do
    get '/foo' #* Fires off request on port 3001 but will always redirect to 3000
    assert_response :redirect
    assert_redirected_to 'http://www.example.com:3000/portfolio'

    get '/admin' #* Gets redirected still on port 3001
    assert_response :redirect
    assert_redirected_to 'http://www.example.com/admin/login'
  end
  test 'should not redirect' do
    get '/admin/login' #* The ONE request that won't redirect
    assert_response :success
  end
end
