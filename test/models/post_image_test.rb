require 'test_helper'

#* Basic PostImage Model tests (Likely in relation to Post Model)
class PostImageTest < ActiveSupport::TestCase
  test 'empty post_image will save only with parent Post' do
    post_image = PostImage.new
    assert_not post_image.save
    post_image.post_id = Post.first.id
    assert post_image.save
  end
end
