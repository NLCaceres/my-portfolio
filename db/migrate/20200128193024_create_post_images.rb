class CreatePostImages < ActiveRecord::Migration[6.0]
  def change
    create_table :post_images do |t|
      t.string :image_url
      t.text :alt_text
      t.references :post, null: false, foreign_key: true

      t.timestamps
    end
  end
end
