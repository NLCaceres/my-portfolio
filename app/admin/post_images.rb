ActiveAdmin.register PostImage do
  config.per_page = [10, 25, 40, 50]

  index do 
    selectable_column 
    column :post
    column :image_url
    column :alt_text
    actions
  end

  show title: :alt_text do
    attributes_table do
      row :post do |post_image|
        post = Post.find(post_image.post_id)
        link_to(post.title, admin_post_path(post))
      end
      #row :alt_text
      row :image_url do |image|
        image_tag image.image_url, size: "600x600"
      end
    end
  end

  permit_params :image_url, :alt_text, :post_id
  # See permitted parameters documentation:
  # https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
  #
  # Uncomment all parameters which should be permitted for assignment
  #
  # permit_params :image_url, :alt_text, :post_id
  #
  # or
  #
  # permit_params do
  #   permitted = [:image_url, :alt_text, :post_id]
  #   permitted << :other if params[:action] == 'create' && current_user.admin?
  #   permitted
  # end
  
end
