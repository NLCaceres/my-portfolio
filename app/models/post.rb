class Post < ApplicationRecord
  has_many :post_images, dependent: :destroy
  validates :title, presence: true, length: { minimum: 5 } # ?: Validation built right into Rails Models!

  enum :project_type, %i[android back_end front_end gui iOS]
  enum :project_size, %i[major_project small_project]

  def self.select_without(*columns)
    # ?: column_names = inherited func from ActiveRecord's model schema. Returns an Arr of field/attribute names
    select(column_names - columns.map(&:to_s)) # - 'to_s' passed in as map() block to run on variadic param Arr
    # ?: Rubocop avoids explicit 'return' statements SO FYI we're returning the select func here to use in method chaining
  end

  def self.ransackable_attributes(auth_object = nil)
    %w[title github_url homepage_url post_images_count]
  end
end
