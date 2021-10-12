#* Controller for API that handles sending out Post models
class PostsController < ApiController
  #* ApiController inherits from ActionController::API which means only 'render'/'redirect_to' work
  before_action :proper_accept_headers
  before_action :authenticate_admin_user!, except: %i[index show] #? Check if AdminUser logged in using Devise helpers
  #? '%i' = symbols delim'd by ' ' => %i[foo bar] = [:foo, :bar]

  #? Originally index func too long. Rubocop yells 'ABC - Assignment Branch Condition offense'
  def index
    project_type_param = params[:project_type]
    if project_type_param == 'null' #* About Me post only!
      #? ActiveRecord also makes dynamic finders for all field/attributes (e.g. find_by_attribute_name)
      @posts = Post.select_without(:created_at, :updated_at).find_by_github_url('https://github.com/NLCaceres')
    elsif !project_type_param.nil? #* Takes project_type enum (android, iOS...) to return specific set
      fetch_by_project_type(project_type_param) #? Solution to ABC offense. Offload work
    else #* Returns entire list of projects
      @posts = Post.select_without(:created_at, :updated_at).order(:project_size)
    end
    render json: @posts.to_json(include: { post_images: { only: %i[image_url alt_text] } })
  end

  def create
    @post = Post.new(post_params) #? Protects against mass assignment by requiring this post_params private method
    if @post.save
      render json: @post.to_json(only: %i[title description github_url]), status: :created
    else
      #? If params method above fails, it'll send a 400 bad request (malformed) SO below would mean content is fine
      render json: 'Unable to process', status: :unprocessable_entity #? but failed for other reasons
    end
  end

  def show
    @post = Post.find(params[:id])
    #? Following = example of Pre-Ruby2 hashes (keys could be ints or strings rather than just symbols)
    render json: @post.to_json(:only => %i[title description github_url]) # rubocop:disable Style/HashSyntax
  rescue ActiveRecord::RecordNotFound #? Methods, blocks & lambdas all can be rescued like this! No begin block needed
    render json: 'Not Found', status: :not_found
  end

  def update
    @post = Post.find(params[:id])
    if @post.update(post_params) #? Failing here = 400 BadRequest due to malformed content (probably)
      render json: @post.to_json(only: %i[title description github_url]), status: :ok
    else
      #? If here, either 409 conflict or 422 fits. Chose 422 since content = likely ok/safe - made it past post_params()
      render json: 'Unable to update', status: :unprocessable_entity
    end
  end

  def destroy
    Post.find(params[:id]).destroy
    head :no_content
  end

  private

  def post_params
    #? Rails doesn't separate query params & POST json params, so controllers store both in the params hash obj
    params.require(:post) #? Forces the params hash to have a wrapper key so 'params: { post: { data... } }'
          .permit(:title, :description, :github_url) #? Only these params can be sent/set (others get removed)
  end

  def proper_accept_headers
    render json: 'Invalid accept header', status: :bad_request if request.headers['Accept'] != 'application/json'
  end

  def fetch_by_project_type(project_type_param)
    #* If the query param value = invalid enum key (e.g. random string or number), then nil is returned
    project_type_pick = Post.project_types[project_type_param]
    #? 'Where' func with a hash based condition passed in should avoid sql injection issues
    #? If an attacker managed to pass in any non-Int val for project_type_pick, invalid syntax err fires
    #? Conversely, a random int (one that doesn't match to a project_type symbol) returns an empty Arr
    @posts = project_type_pick ? Post.select_without(:created_at, :updated_at).where(project_type: project_type_pick).order(:project_size) : [] # rubocop:disable Layout/LineLength
    #* Considered project_type_pick.nil? above BUT ruby only has 2 falsy values: false & nil, and since
    #* Valid enum keys WILL return symbols (which = true) working in the positive felt simplest/most readable
  end
end
