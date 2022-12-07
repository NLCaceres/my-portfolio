# GET Data from JSON files to seed into Database
module JSONSeeder
  def begin_json_reading
    Dir[File.join(Rails.root, 'db', 'seeds', '*.json')].sort.each.with_index do |json_file, index|
      parsed_file = JSON.parse(File.read(json_file))
      case index
      when 0 #* About Me
        parse_about_me_section(parsed_file)
      when 4 #* GUI Files currently skipped
      else
        parse_json_file(index, parsed_file)
      end
    end
  end

  def parse_about_me_section(json_file)
    about_me_info = json_file['Nicholas-L-Caceres']
    new_post = Post.create(title: about_me_info['name'], description: about_me_info['desc'],
                           github_url: about_me_info['github'], project_type: nil, project_size: nil)

    parse_project_images(new_post, about_me_info['images'])
  end

  def parse_json_file(project_type, json_file)
    json_file.each_value.with_index do |project_info, index|
      save_project((project_type - 1), index, project_info)
      #* Index = project_type / enum so using index works out to 0 = major-projects, 1 = small-project
    end
  end

  #* Project_type is based on enum indices (Android: 0, iOS: 1, front-end: 2, back-end: 3) and file order!
  #* Project_size is based on json obj structure, two arrays, 1st is major, 2nd is minor
  def save_project(project_type, project_size, project_list)
    project_list.each do |project|
      homepage_url = !project['url'].nil? ? project['url'] : nil #* i.e. If NOT nil, get value, else provide nil
      #? Use spaces (NOT Tabs) to align method arguments as seen below
      new_post = Post.create(title: project['name'], description: project['desc'],
                             github_url: project['github'], homepage_url: homepage_url,
                             project_type: project_type, project_size: project_size)
      parse_project_images(new_post, project['images'])
    end
  end

  def parse_project_images(new_post, project_images)
    project_images.each do |image|
      new_post.post_images.create(image_url: image['src'], alt_text: image['alt'])
    end
  end
end
