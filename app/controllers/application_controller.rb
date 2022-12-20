# Handle Redirect to React Frontend Route + RoutesList
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  def health_check
    in_production = ENV['RAILS_ENV'] == 'production' #? If deployed then true! SO
    not_serving = !rails_server? && !puma_server? #? Check if running migrations then not_serving == true!
    in_production && not_serving ? (head :service_unavailable) : fallback_redirect #? Else Rails is ready, so run React Redirect
  end

  #* Both root + "*path" routes (config/routes) point to the following method
  def fallback_redirect
    if ENV['RAILS_ENV'] == 'production' #? Send React app file in prod, else let it redirect
      send_file "#{Rails.root}/public/index.html", type: 'text/html; charset=utf-8', disposition: 'inline', status: 200
    else #? In dev + tests, redirect to 'localhost:3000/', so the React dev server can send the app
      redirect_to "#{request.protocol}#{request.host}:3000/portfolio"
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

  #? On Railway using 'bin/rails s' makes Rails.const_defined?('Server') == true
  def rails_server?
    Rails.const_defined?('Server')
  end

  #? BUT PROGRAM_NAME.include?('puma') == false && Puma.const_defined?('Server') == true
  def puma_server?
    $PROGRAM_NAME.include?('puma') && Puma.const_defined?('Server')
  end

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
