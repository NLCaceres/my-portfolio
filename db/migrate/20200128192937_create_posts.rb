class CreatePosts < ActiveRecord::Migration[6.0]
  def change
    create_table :posts do |t|
      t.string :title
      t.text :description
      t.string :github_url
      t.string :homepage_url
      t.integer :project_type
      t.integer :project_size
      t.integer :post_images_count

      t.timestamps
    end
  end
end
