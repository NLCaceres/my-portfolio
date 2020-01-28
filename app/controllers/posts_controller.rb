class PostsController < ApiController #Using ActionController::API means only render/redirect_to work
  def index
    if params[:project_type] == 'null'
      @posts = Post.find_by github_url: "https://github.com/NLCaceres"
    elsif params[:project_type] != nil
      @posts = Post.where(project_type: params[:project_type])
    else
      @posts = Post.select_without(:created_at, :updated_at).order(:project_size)
    end
    
    render json: @posts.to_json(include: { post_images: { only: [:image_url, :alt_text] } })
  end
  def create
    @post = Post.new(post_params) # New function is built into ruby (basic constructor)
    if @post.save 
      render json: @post.show
    else 
      render 'api/404'
    end
  end
  def show
    begin
      @post = Post.find(params[:id])
      render json: @post.to_json( :only => [:title, :description, :github_url])
    rescue ActiveRecord::RecordNotFound
      render 'api/404'
    end
  end
  def update
    @post = Post.find(params[:id])
    if @post.update(post_params)
      render json: @post.show
    else
      render 'api/404'
    end
  end
  def destroy
    Post.find(params[:id]).destroy
  end

  private
  def post_params
    params.require(:post).permit(:title, :description, :github_url)
  end
end