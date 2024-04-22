class PostImage < ApplicationRecord
  belongs_to :post, counter_cache: true #* Implication here is foreignKey is NOT NULL in db (so always required)

  def self.select_without(*columns)
    select(column_names - columns.map(&:to_s))
  end

  def self.ransackable_attributes(auth_object = nil)
    %w[post_id image_url alt_text created_at updated_at importance]
  end

  def self.ransackable_associations(auth_object = nil)
    ['post']
  end
end
