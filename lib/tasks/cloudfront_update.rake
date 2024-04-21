require 'dotenv/tasks'

namespace :cloudfront do
  desc "Change the Cloudfront Domain Name, i.e. 'foobar.net/some_file.txt' -> 'barfoo.net/some_file.txt'"
  task :change_domain, %i[old_url new_url] => %i[environment dotenv] do |_task, args| #? Unused args get "_" prefix
    PostImage.all.each do |img|
      image_url = img.image_url.sub(args.old_url, args.new_url)
      img.update(image_url:)
      # puts "Old URL = #{img.image_url}\nNew Url = #{image_url}\n#{separator}"
    end
  end
end

#? Ruby 3 allows "endless" (aka no `do ... end`) methods which makes defining single line methods super clean!
def separator = '********************' * 8
#? Plus Ruby actually DOES allow Python-like String duplication via the "*" multiplication operator

#? Rake uses the following format to accept parameters when running scripts
#? The first symbol array after the comma is the command's parameters - old_url and new_url
#? The second symbol array (after =>, so []) are other tasks to run before running this task (like :environment above)
#? Example of how to pass in args to a command: `bin/rails 'cloudfront_update[foobar.com/, barfoo.com/]'`
#? MUST wrap the task name with single quotes, THEN place the arg values in an array following the task name
task :cloudfront_update, %i[old_url new_url] => [] do |_task, args|
  system("bin/rails 'cloudfront:change_domain[#{args.old_url}, #{args.new_url}]'") ||
    abort('\n== Cloudfront Update Command failed ==')
end
