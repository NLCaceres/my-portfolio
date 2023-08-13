# Handle Redirect to React Frontend Route + RoutesList
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  #? BeforeActions seem to run in order of declaration
  before_action :contactable?, only: %i[send_email]
  before_action :validate_email_param, only: %i[send_email]

  def health_check
    not_serving = !rails_server? && !puma_server? #? If running migrations, then not_serving == true!
    production? && not_serving ? (head :service_unavailable) : fallback_redirect #? Else Rails' ready, so run Redirect
  end

  #* Both root + "*path" routes (see config/routes) point to the following method
  def fallback_redirect
    set_csrf_cookie
    file_name = "#{Rails.root}/public/main.html"
    if production? && File.file?(file_name) #? 'send_file' > 'render file: 'public/main.html'. Faster w/out layout check
      #? 'type' symbol sets mimeType, 'disposition' causes the file to either be displayed or downloaded
      send_file file_name, type: 'text/html; charset=utf-8', disposition: 'inline', status: 200
    elsif production? #* If no React file found, 404 Front-End does not exist!
      head :not_found
    else #? In dev + tests, redirect to 'localhost:3000/', so the React dev server can send the app
      redirect_to "#{request.protocol}#{request.host}:3000/portfolio"
    end
  end
  #? Using 'render' w/out 'file' or 'public' symbol, i.e. render 'index', sends the 'application/index.html.erb' layout

  #* Following route occurs only if specific headers included with GET request
  def routes
    if request.headers['Accept'] != 'application/json'
      render json: 'Invalid accept header', status: :bad_request
    else
      route_arr = []
      Rails.application.routes.routes.each { |r| route_arr.push(route_hash(r)) if path_starts_with?(r, 'api') }
      render json: route_arr
    end
  end

  #* POST request to send email BUT 1st check with turnstile backend if human
  def send_email
    turnstile_res = turnstile_check(params[:cfToken], request.remote_ip)
    http_status = turnstile_res['success'] ? :ok : :forbidden
    if turnstile_res['success']
      sender = { email: params[:email], message: params[:message] }
      ContactMeMailer.contact_me(sender).deliver_later #? Send asyncly once resources are ready
    end
    render json: turnstile_res, status: http_status
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

  def production?
    ENV['RAILS_ENV'] == 'production'
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

  def set_csrf_cookie
    csrf_token = { value: form_authenticity_token, same_site: :strict }
    #? Domain does not consider 'localhost' OR '127.0.0.1' to be a valid domain
    #? So don't use it NOR the 'secure' attribute in development
    if production? #* If in production, add following to csrf token cookie
      csrf_token[:secure] = true #? If also added httpOnly = true, then javascript couldn't access cookie in React
      csrf_token[:domain] = 'caceres-portfolio.up.railway.app'
    end
    cookies['CSRF-TOKEN'] = csrf_token
  end

  #? BeforeActions will prevent the controller method from running if they render or redirect
  def contactable?
    head :forbidden unless ENV['REACT_APP_CONTACTABLE'] == 'true'
  end

  def validate_email_param
    #? Alternative regex to check for common emails = /^[A-Za-z0-9+_.-]+@([A-Za-z0-9]+\.)+[A-Za-z]{2,6}$/
    head :bad_request unless params[:email] =~ /^[^\s@]+@[^\s@]+\.[^\s@]{2,6}$/
  end

  def turnstile_check(cf_token, remote_ip)
    uri = URI('https://challenges.cloudflare.com/turnstile/v0/siteverify')
    res = Net::HTTP.post_form(uri, { 'secret' => ENV['TURNSTILE_SECRET_KEY'], 'response' => cf_token, 'remoteip' => remote_ip })
    res_json = JSON.parse(res.body) #? Gets a HASH so remove other keys and return json object with key and value
    res_json.delete('hostname')
    res_json[:message] = res_json['success'] ? 'Successfully sent your email!' : 'Unable to send your email!'
    res_json
  end
end
