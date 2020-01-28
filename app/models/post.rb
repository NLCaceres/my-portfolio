class Post < ApplicationRecord
  has_many :post_images, dependent: :destroy
  validates :title, presence: true, length: { minimum: 5} # Built right into Rails Models!

  enum project_type: [ :android, :back_end, :front_end, :gui, :iOS ]
  enum project_size: [ :major_project, :small_project ]

  def self.select_without(*columns)
    select(column_names - columns.map(&:to_s)) # (to_s is shorthand for a to string function passed in to run on all vals in Arr)
  end
end
