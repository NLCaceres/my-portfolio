# GET Data from CSV Files to seed into Database
module CSVSeeder
  def begin_csv_reading
    Dir[File.join(Rails.root, 'db', 'seeds', 'csv', '*.csv')].each do |file|
      sorted_rows = CSV.read(file).sort { |a, b| a[0].to_i <=> b[0].to_i } #? Empty columns CAN be read as nil values
      parse_rows(sorted_rows, file)
    end
  end

  def parse_rows(rows_arr, file_name)
    column_name_row = rows_arr.shift #? Remove the column name row
    # puts "Column Row = #{column_name_row}\n\n"
    rows_arr.each do |row|
      file_name.end_with?('posts.csv') ? parse_posts(row, column_name_row) : parse_post_images(row, column_name_row)
    end
  end

  def parse_posts(row, attrs)
    #* title: String, description: String, github: String, homepage: String,
    #* projectType: String, projectSize: String BUT these two must be converted to ints below (ln27)
    column_range = 1..-4
    filtered_row = row[column_range]
    new_post = Post.new do |p|
      attrs[column_range].each.with_index { |attr, index| p[attr.to_sym] = get_correct_val(attr, filtered_row[index]) }
    end
    new_post.save
    # puts "Completed Post ==============\n#{new_post.attributes.map { |key, value| "#{key} = #{value}" }.join("\n")}\n\n"
  end

  #* If value is truly NULL, then return nil, otherwise either return an int for projectType/Size or the actual value
  def get_correct_val(attribute, column_value)
    #? Below makes a string[] w/ Ruby's %w[] "word literal array syntax" to check if at project type or size column
    if %w[project_type project_size].include?(attribute)
      column_value.nil? ? nil : column_value.to_i
    else
      column_value
    end
  end

  def parse_post_images(row, attrs)
    #* imageURL: String, altText: String, postID: String
    column_range = 1..3
    filtered_row = row[column_range]
    new_post_image = PostImage.new do |p|
      attrs[column_range].each.with_index { |attr, index| p[attr.to_sym] = filtered_row[index] }
    end
    new_post_image.save
  end
end
