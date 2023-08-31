require 'test_helper'

#* Basic PostsController Tests
class PostsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  #! Proper Headers Filter
  test 'should redirect GET requests without headers' do
    #? Route helpers are all suffixed with '_path' or '_url'
    #? '_url' version adds in host, port & any path prefix (so like an '/api' prefix)
    get posts_url #? Consequently '_url' is probably the right choice for tests
    assert_redirect_to_react

    get post_url(Post.first)
    assert_redirect_to_react
  end

  test 'should send BAD_REQUEST if improper headers sent to API' do
    get posts_url, headers: accept_header('*/*')
    assert_response :bad_request

    get post_url(Post.first), headers: accept_header('*/*')
    assert_response :bad_request

    post posts_url
    assert_response :bad_request

    post posts_url, headers: accept_header('*/*')
    assert_response :bad_request

    put post_url(Post.first)
    assert_response :bad_request

    put post_url(Post.first), headers: accept_header('*/*')
    assert_response :bad_request

    delete post_url(Post.first)
    assert_response :bad_request

    delete post_url(Post.first), headers: accept_header('*/*')
    assert_response :bad_request
  end

  #! Index GET requests
  test 'should GET index and return array' do
    get posts_url, headers: accept_header
    assert_response :success #? Success symbol accounts for all 400-499 status codes

    all_posts = @response.parsed_body
    assert_instance_of Array, all_posts
    assert_not_empty all_posts
    assert_equal all_posts.length, Post.count
    first_post = all_posts[0]
    assert_equal 'Foobar', first_post['title']
  end

  test 'should GET index and return ONLY About post if query param is null' do
    about_post_only_url = "#{posts_url}?project_type=null"
    get about_post_only_url, headers: accept_header
    about_post_only = @response.parsed_body
    #? Only one Post should be returned, so 'to_json()' returns a hash, not an array
    assert_instance_of Hash, about_post_only
    assert_equal 'https://github.com/NLCaceres', about_post_only['github_url']
  end

  test 'should GET index and return filtered array of particular project type' do
    android_posts_only_url = "#{posts_url}?project_type=android"
    get android_posts_only_url, headers: accept_header
    android_posts = @response.parsed_body
    #? Multiple Posts should be returned, so 'to_json()' returns an Arr
    assert_instance_of Array, android_posts
    assert_equal 2, android_posts.length
    #* Expected params only send certain columns
    android_posts.each do |post| #* None should include these columns
      assert_nil post['created_at']
      assert_nil post['updated_at']
    end
  end

  test 'should GET index and return an empty array if invalid query param values' do
    #* Test that unexpected params fail
    empty_list_url = "#{posts_url}?project_type=fail"
    get empty_list_url, headers: accept_header
    no_posts = @response.parsed_body
    assert_instance_of Array, no_posts #? Empty Arr expected
    assert_equal 0, no_posts.length

    second_empty_list_url = "#{posts_url}?project_type=0"
    get second_empty_list_url, headers: accept_header
    second_no_posts = @response.parsed_body
    assert_instance_of Array, second_no_posts
    assert_equal 0, second_no_posts.length
  end

  #! Show GET request
  test 'should GET show if resource exists' do
    get post_url(Post.first), headers: accept_header
    assert_response :success

    only_post = @response.parsed_body
    assert_equal 'Barfoo', only_post['title'] #* Post.first seems to grab last listed fixture

    get post_url(-1), headers: accept_header
    assert_response :not_found
  end

  #! Auth Filter
  test 'should ONLY authorize create update or delete for admins' do
    #* Missing auth
    post posts_url, headers: accept_header
    assert_response :unauthorized

    put post_url(Post.first), headers: accept_header
    assert_response :unauthorized

    delete post_url(Post.first), headers: accept_header
    assert_response :unauthorized

    #* With auth
    sign_in admin_users(:admin)

    post posts_url, headers: accept_header, params: { post: { title: 'This title' } }
    assert_response :created

    put post_url(Post.first), headers: accept_header, params: { post: { title: 'New Title' } }
    assert_response :ok

    delete post_url(Post.first), headers: accept_header
    assert_response :no_content
  end
end
