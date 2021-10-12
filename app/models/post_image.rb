class PostImage < ApplicationRecord
  belongs_to :post #* Implication here is foreignKey is NOT NULL in db (so always required)

  def self.select_without(*columns)
    select(column_names - columns.map(&:to_s))
  end
end
