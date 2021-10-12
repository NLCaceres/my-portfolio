require 'test_helper'

#? Double checks activeAdmin routes are secure
class AdminUsersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @admin_user = admin_users(:admin)
  end

  test 'should NOT GET admin_user list at index SHOULD redirect to login page' do
    get admin_admin_users_url
    assert_redirect_to_login
  end

  test 'should NOT GET new SHOULD redirect to login page' do
    get new_admin_admin_user_url
    assert_redirect_to_login
  end

  test 'should NOT POST new admin_user SHOULD redirect to login page' do
    post admin_admin_users_url
    assert_redirect_to_login
    assert_no_difference('AdminUser.count') do
      post admin_admin_users_url, params: { admin_user: {} }
    end
    #TODO: Could login and assert difference!
  end

  test 'should NOT GET individual admin_user SHOULD redirect to login page' do
    get admin_admin_user_url(@admin_user)
    assert_redirect_to_login
  end

  test 'should NOT GET edit SHOULD redirect to login page' do
    get edit_admin_admin_user_url(@admin_user)
    assert_redirect_to_login
  end

  test 'should NOT update admin_user SHOULD redirect to login page' do
    put admin_admin_user_url(@admin_user), params: { admin_user: {} }
    assert_redirect_to_login
  end

  test 'should NOT destroy admin_user SHOULD redirect to login page' do
    delete admin_admin_user_url(@admin_user)
    assert_redirect_to_login
    assert_no_difference('AdminUser.count') do
      delete admin_admin_user_url(@admin_user)
    end
    #TODO: Could login and assert one less adminUser exists!
  end
end
