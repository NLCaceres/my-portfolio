require 'test_helper'
require 'test_helpers/model_assertions'

#* Basic Tests for Post Model
class PostTest < ActiveSupport::TestCase
  include ModelAssertions

  #* Fixture check
  test 'checking post count' do
    assert_equal 5, Post.count
  end

  #* Validations
  test 'post model has title' do
    post = Post.new
    assert_not post.save
  end

  test 'post model has too short title' do
    post = Post.new
    post.title = 'Foo'
    assert_not post.save
  end

  #* Enum Check
  test 'project_type enum properly associated' do
    enum_asserter 0, Post.project_types, :android

    enum_asserter 1, Post.project_types, :back_end

    enum_asserter 2, Post.project_types, :front_end

    enum_asserter 3, Post.project_types, :gui

    enum_asserter 4, Post.project_types, :iOS
  end

  test 'project_size enum properly associated' do
    enum_asserter 0, Post.project_sizes, :major_project

    enum_asserter 1, Post.project_sizes, :small_project
  end
end
