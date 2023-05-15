require_relative 'util/json_helper' #? Easier than using the basic 'require'
require_relative 'util/csv_helper' #? It'll grab the file relative to the current 'db' directory

#? In order to mixin these two seeders, must use class so we can use the modules/funcs via "include"
#? Why not include in a module? Funcs you "include" are instance funcs and modules can't be instantiated!
class MyDbSeeder
  #? Why not in the top-level (outside of a module/func)? Because Ruby treats "include" as subclassing!
  include JSONSeeder #? And using "include" in the top level is basically subclassing the root object (main)
  include CSVSeeder #? Funcs defined as "module_function" (written below declaration) don't come via "include"

  #? If this was a singleton_function (i.e. def self.driver) we wouldn't have access to funcs from "include" either
  #? SINCE singleton_functions are Ruby's static funcs, they get no access to instances, attributes or instance_funcs
  def driver
    # begin_json_reading
    begin_csv_reading
  end
end

MyDbSeeder.new.driver
#? ActiveAdmin creates this default user so devs can setup from ActiveAdmin console in production
AdminUser.create!(email: 'nick-react-rails@example.com', password: 'i3yDtBQpG', password_confirmation: 'i3yDtBQpG')
