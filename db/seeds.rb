def parsedFile(raw_json)
  JSON.parse(File.read(raw_json))
end

def parseProjectImgs(new_post, project_images)
  project_images.each do |image|
    new_post.post_images.create(image_url: image['src'], alt_text: image['alt'])
  end
end
# Project_type is based on enum indices (Android: 0, iOS: 1, front-end: 2, back-end: 3) and file order!
# Project_size is based on json obj structure, two arrays, 1st is major, 2nd is minor
def saveProject(project_type, project_size, project_list) 
  project_list.each do |project|
    homepage_url = project['url'] != nil ? project['url'] : nil
    new_post = Post.create(title: project['name'], description: project['desc'], 
      github_url: project['github'], homepage_url: homepage_url, 
      project_type: project_type, project_size: project_size)
    parseProjectImgs(new_post, project['images']) 
  end
end
def parseJSONFile(project_type, json_file)
  json_file.each_value.with_index do |project_info, index|
    saveProject((project_type-1), index, project_info) # Index = project_type / enum so using index works out to 0 = major-projects, 1 = small-project
  end
end

def parseAboutMe(json_file)
  about_me_info = json_file['Nicholas-L-Caceres']
  new_post = Post.create(title: about_me_info['name'], description: about_me_info['desc'], github_url: about_me_info['github'], project_type: nil, project_size: nil)

  parseProjectImgs(new_post, about_me_info['images'])
end

def parseProjectJSON()
  Dir[File.join(Rails.root, 'db', 'seeds', '*.json')].sort.each.with_index do |json_file, index|
    if index == 0
      parseAboutMe(parsedFile(json_file))
      next
    elsif index == 4 # GUI Files currently skipped
      next
    end
    parseJSONFile(index, parsedFile(json_file))
  end
end

def handleRoutes()
  Rails.application.routes.routes.each do |route|
    route_action = route.defaults[:controller].to_s
    if route_action.starts_with?("api") || route_action.starts_with?("user")
      puts "Here is a route: #{route.path.spec.to_s} #{route.verb} #{route.defaults[:controller]}##{route.defaults[:action]} \n\n"
    end
  end
end

def starter
  parseProjectJSON()
  #handleRoutes()
end

starter()
AdminUser.create!(email: 'admin@example.com', password: 'password', password_confirmation: 'password')