class PostImage < ApplicationRecord
  belongs_to :post
  def self.select_without(*columns)
    select(column_names - columns.map(&:to_s))
  end
end
