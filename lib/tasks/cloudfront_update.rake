namespace :cloudfront do
  desc "Change the Cloudfront Domain Name, i.e. 'foobar.net/some_file.txt' -> 'barfoo.net/some_file.txt'"
  task :change_domain, %i[old_url new_url] => [:environment] do |_task, args| #? Unused args get "_" prefix
    PostImage.all.each do |img|
      image_url = img.image_url.sub(args.old_url, args.new_url)
      img.update(image_url:)
      # puts "Old URL = #{img.image_url}\nNew Url = #{image_url}\n#{separator}"
    end
  end
end

#? Ruby 3 allows "endless" methods which makes defining single line methods super clean!
def separator = '********************' * 8
#? Plus Ruby actually DOES allow Python-like String duplication via the "*" multiplication operator

#? Rake uses the following format to accept parameters when running scripts
#? The first symbol array after the comma is the command's parameters
#? The second symbol array are other tasks that should be run before running this task (like :environment)
#? To pass in params call the func as `bin/rails 'cloudfront_update[foobar.com/, barfoo.com/]'`
#? Important to wrap the task name with single quotes, and to place the args in an array following the task name
task :cloudfront_update, %i[old_url new_url] => [] do |_task, args|
  exec "foreman run bin/rails 'cloudfront:change_domain[#{args.old_url}, #{args.new_url}]'"
end
