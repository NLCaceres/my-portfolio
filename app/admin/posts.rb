# rubocop:disable Metrics/BlockLength
ActiveAdmin.register Post do
  config.per_page = [5, 10, 25, 40, 50]
  config.sort_order = 'project_type_asc'

  scope :all
  scope :major_project
  scope :small_project
  scope :android
  scope 'iOS', :iOS
  scope :back_end
  scope :front_end

  filter :title
  filter :github_url
  filter :homepage_url
  filter :post_images_count

  index do
    selectable_column
    column :title
    column :description
    column :github_url
    column :homepage_url
    column :project_type
    column :project_size
    column 'Image Count', :post_images_count
    actions
  end

  sidebar 'Images in this Post', only: :show do
    table_for PostImage.joins(:post).where(post_id: post.id) do |t|
      t.column('Url') { |post_image| link_to post_image.image_url, admin_post_image_path(post_image) }
    end
  end

  permit_params :title, :description, :github_url, :homepage_url, :project_type, :project_size
  # See permitted parameters documentation:
  # https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
  #
  # Uncomment all parameters which should be permitted for assignment
  #
  # permit_params :title, :description, :github_url, :homepage_url, :project_type, :project_size, :post_images_count
  #
  # or
  #
  # permit_params do
  #   permitted = [:title, :description, :github_url, :homepage_url, :project_type, :project_size, :post_images_count]
  #   permitted << :other if params[:action] == 'create' && current_user.admin?
  #   permitted
  # end
end
# rubocop:enable Metrics/BlockLength
