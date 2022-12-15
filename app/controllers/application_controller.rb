# Handle Redirect to React Frontend Route + RoutesList
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  #* Both root + "*path" routes (config/routes) point to the following method
  def fallback_redirect
    if ENV.fetch('RAILS_ENV', 'development') == 'production' #? Send React app index in prod, let it redirect
      send_file "#{Rails.root}/public/index.html", type: 'text/html; charset=utf-8', disposition: 'inline', status: 200
    else #? In dev + tests, redirect to 'localhost:3000/', so the React dev server can send the app
      redirect_to path: 'portfolio', port: 3000, only_path: false #? 1st param = url_for() options
      #? 'only_path: false' ensures ENTIRE url is redirect url "http://localhost/foobar" vs "/foobar"
    end
    # render 'index' #? Would make a request to application/index.html.erb
  end

  # Following route only occurs if specific headers included with GET request
  def routes
    if request.headers['Accept'] != 'application/json'
      render json: 'Invalid accept header', status: :bad_request
    else
      route_arr = []
      Rails.application.routes.routes.each { |r| route_arr.push(route_hash(r)) if path_starts_with?(r, 'api') }
      render json: route_arr
    end
  end

  private

  def path_starts_with?(route, prefix)
    # Interpolate prefix as '/prefix' to check if '/some/path' starts_with '/prefix'
    route.path.spec.to_s.starts_with?("/#{prefix}")
  end

  # Make a hash out of route to send in json
  def route_hash(route)
    {
      verb: route.verb.to_s,
      route: route.path.spec.to_s.delete_suffix('(.:format)'), # DeleteSuffix for more human-readable URL
      controller: route.defaults[:controller].to_s,
      action: route.defaults[:action].to_s
    }
  end
end
