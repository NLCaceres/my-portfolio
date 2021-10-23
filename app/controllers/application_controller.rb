class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  #* Both root + "*path" routes (config/routes) point to the following method
  def fallback_redirect
    if ENV.fetch('RAILS_ENV', 'development') == 'production'
      render file: "#{Rails.root}/public/index.html" #? In prod, send React app & let it handle redirects
    else #? In dev + tests, redirect to 'localhost:3000/', so we're actually serving the react app!
      redirect_to path: 'portfolio', port: 3000, only_path: false #? 1st param = url_for() options
      #? 'only_path: false' ensures ENTIRE url is redirect url "http://localhost/foobar" vs "/foobar"
    end
    # render 'index' #? Would make a request to application/index.html.erb
  end
end
