# Handle Redirect to React Frontend Route + RoutesList
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

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
end
