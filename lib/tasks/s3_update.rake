require 'aws-sdk-s3'
require 'dotenv/tasks' #? No foreman required!

namespace :s3 do
  #? Calling :environment in any task, ensures the App loads in, models can be made, the DB is available (and more!)
  #? Similarly, `require 'dotenv/tasks'` provides the :dotenv task to load in ENV vars
  desc 'Update Database URLS to new S3-Backed Cloudfront Links'
  task update_img_urls: %i[environment dotenv] do
    credentials = Aws::Credentials.new(ENV['AWS_ACCESS_KEY_ID'], ENV['AWS_SECRET_ACCESS_KEY'], ENV['AWS_SESSION_TOKEN'])
    client = Aws::S3::Client.new(region: 'us-west-2', credentials:)
    resource = Aws::S3::Resource.new(client:) #? Ruby 3.1 lets you easily input args (like client) with matching names
    bucket = resource.bucket(ENV['AWS_S3_BUCKET']) #* Get access to my AWS S3 bucket and its files
    post_image_prefix = ENV['POST_IMAGE_PREFIX'] #* Original image url domain name - 'https://example.com/'
    cloudfront_prefix = ENV['AWS_CLOUDFRONT_PREFIX'] #* AWS Cloudfront distribution domain name - 'https://example.cloudfront.net/'
    bucket.objects.each do |object| #* Get a list of all image urls in the AWS S3 bucket
      #? After splitting the string by '/', grab the last separation THEN split by '.', and grab the first
      #? Example: 'some/dir/url.png' -> ['some', 'dir', 'url.png'] -> 'url.png' -> ['url', 'png'] -> 'url'
      img_name = object.key.split('/').last.split('.').first
      original_url = post_image_prefix + img_name #* Combine original url to get 'https://example.com/url'
      # puts "Expected original URL = #{original_url}"
      post_images = find_post_image_by original_url
      if !post_images.empty?
        # puts "Found PostImage with URL = #{post_images}"
        new_url = cloudfront_prefix + object.key
        post_images.each { |img| img.update(image_url: new_url) }
        # puts "New URL = #{new_url}\n==========================="
      else
        # puts '**********\tNo Post Image found\t**********\n=========================='
      end
    end
  end
end

def find_post_image_by(image_url)
  post_images = []
  %w[png jpg jpeg].each do |suffix| #* Compare against expected file types
    full_url = "#{image_url}.#{suffix}"
    post_images = PostImage.where(image_url: full_url)
    break unless post_images.empty?
  end
  post_images
end

#? Following command can be run with `bin/rails s3_update`
#? WHICH runs the equivalent of `bundle exec bin/rails s3:update_img_urls`
#? `bundle exec` is generally used to run gems you installed and loaded in from the Bundler Gemfile
task :s3_update do
  system('bin/rails s3:update_img_urls') || abort('\n== Amazon S3 Update Command failed ==')
end
