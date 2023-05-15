require 'aws-sdk-s3'
namespace :db do
  #? Calling :environment in any task, ensures the App loads in, models can be made, the DB is available (and more!)
  desc 'Update Database URLS to new S3-Backed Cloudfront Links'
  task update_img_urls: :environment do
    credentials = Aws::Credentials.new(ENV['AWS_ACCESS_KEY_ID'], ENV['AWS_SECRET_ACCESS_KEY'], ENV['AWS_SESSION_TOKEN'])
    client = Aws::S3::Client.new(region: 'us-west-2', credentials:)
    resource = Aws::S3::Resource.new(client:) #? Ruby 3.1 lets you easily input args (like client) with matching names
    bucket = resource.bucket(ENV['AWS_S3_BUCKET'])
    post_image_prefix = ENV['POST_IMAGE_PREFIX']
    cloudfront_prefix = ENV['AWS_CLOUDFRONT_PREFIX']
    bucket.objects.each do |object|
      #? Grabs the last partition separated by '/' delim THEN grab the first partition separated by '.'
      #? WHICH can be used to transform as follows: 'some/dir/url.png' -> 'url.png' -> 'url' -> 'prefix/url'
      img_name = object.key.split('/').last.split('.').first
      original_url = post_image_prefix + img_name
      # puts "Expected original URL = #{original_url}"
      post_images = find_post_image_by original_url
      if !post_images.empty?
        # puts "Found PostImage with URL = #{post_images}"
        new_url = cloudfront_prefix + object.key
        post_images.each { |img| img.update(image_url: new_url) }
        # puts "New URL = #{new_url}\n==========================="
      else
        # puts "**********\tNo Post Image found\t**********\n=========================="
      end
    end
  end
end

def find_post_image_by(image_url)
  post_images = []
  %w[png jpg jpeg].each do |suffix| #* Compare against several expected file types
    full_url = "#{image_url}.#{suffix}"
    post_images = PostImage.where(image_url: full_url)
    break unless post_images.empty?
  end
  post_images
end

#? Following can be run with `bin/rails aws_update`
#? Which runs the equivalent of `bundle exec foreman run bin/rails db:update_img_urls`
#? `bundle exec` is generally used to run gems you loaded in from the Bundler Gemfile
#? Making it pretty simple to include foreman via the development group of my Gemfile
#! BUT!!! Foreman can be installed locally via Homebrew
#* Foreman itself advises against bundling it in the Gemfile BUT does it matter if it's in the development group?
task :aws_update do
  exec 'foreman run bin/rails db:update_img_urls'
end
