class AddOrderingDataToPostsAndPostImages < ActiveRecord::Migration[6.1]
  def change
    add_column :posts, :start_date, :datetime
    add_column :posts, :importance, :int
    add_column :post_images, :importance, :int
    add_importance_values
  end

  #? Interestingly, ActiveRecord/PostgreSQL constantly sends back post_images in the same order BUT HOW?
  #? Indexing (probably)! The PostImages table has an index that groups the images for fast access based on post_id
  #? During seeding, each gets placed in the index upon initial association in whatever the order they're created
  #? So any new ones, get added to the front of the index, causing them to be placed first in the list upon request
  #? To combat this and add sorting, create an "importance" column. Posts ALSO get a "start_date" column
  def add_importance_values
    add_importance_to_projects_without_a_type

    Post.project_types.each_key do |key|
      # puts "*************#{key}***************"
      posts_by_type = Post.where(project_type: key).order(:project_size)
      major_projects, minor_projects = split_projects_by_size(posts_by_type) #? Ruby Array Destructuring

      #? Oddly sort_by.reverse! is actually VERY fast. In fact, it's better than ALL other options
      #? SUCH AS: sort { |a,b| b <=> a } OR sort.reverse OR sort_by { |obj| -obj.property } OR even sort_by.reverse
      add_importance_to_projects(major_projects.sort_by { |obj| obj.created_at }.reverse!)
      add_importance_to_projects(minor_projects.sort_by { |obj| obj.created_at }.reverse!)
    end
  end

  def add_importance_to_projects_without_a_type
    about_me_post = Post.where(project_type: nil) #? Currently, should only get 1 post: The about_me_post
    add_importance_to_projects about_me_post
  end

  def split_projects_by_size(posts)
    minor_project_index = -1
    major_projects = posts.take_while do |post|
      minor_project_index += 1
      post.project_size == 'major_project'
    end
    #? If no projects exist of a certain type, minor_project_index == -1, so return empty maj/min projects [[],[]] tuple
    minor_projects = minor_project_index == -1 ? [] : posts[minor_project_index..posts.size]
    [major_projects, minor_projects]
  end

  def add_importance_to_projects(project_list)
    # puts "Found #{project_list.size} projects"
    project_list.each.with_index do |post, index|
      post.update(importance: index)
      # puts "At INDEX = #{index} is #{post.project_size} ID ##{post.id}. Made on #{post.created_at.inspect} = #{post.title}"
      add_importance_to_project_images post.post_images
    end
    # puts '-----------------------'
  end

  def add_importance_to_project_images(project_images)
    project_images.sort_by { |obj| obj.created_at }.reverse!.each.with_index do |img, index|
      img.update(importance: index)
      # img_alt_text = img.alt_text.size > 68 ? "#{img.alt_text[0..68]}..." : img.alt_text
      # puts "\tAt IMG_INDEX = #{index} with Image ID ##{img.id}. Made on #{img.created_at.inspect} = #{img_alt_text}"
    end
  end
end
