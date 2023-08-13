# Provides a Route list to render a SwaggerUI-style REST API Documentation View
class RoutesController < ApiController
  before_action :proper_accept_headers

  #* Following route occurs only if specific headers included with GET request
  def index
    route_arr = []
    Rails.application.routes.routes.each { |r| route_arr.push(route_hash(r)) if path_starts_with?(r, 'api') }
    render json: route_arr
  end

  private

  def proper_accept_headers
    render json: 'Invalid accept header', status: :bad_request if request.headers['Accept'] != 'application/json'
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
