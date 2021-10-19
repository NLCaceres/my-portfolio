class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  #* Since root (localhost:3000/) fires this method, we can be sure we redirect to React locally / in dev
  #* Thanks to combination of root + "*path" route setup in config/routes, of course!
  # def fallback_redirect
  #   if ENV.fetch('RAILS_ENV', 'development') == 'production'
  #     render file: 'public/index.html' #? Send React app and let it handle the redirects
  #   else #? Following runs in local dev & testing
  #     redirect_to path: 'portfolio', port: 3000, only_path: false
  #     #? 'only_path: false' ensures ENTIRE url is redirect url "http://localhost/foobar" vs "/foobar"
  #   end
  #   # render 'index' #? Would make a request to application/index.html.erb
  # end
  def fallback_redirect
    redirect_url = { path: 'portfolio', port: 3000, only_path: false } #? Except!() removes multiple keys
    redirect_url.except!(:port, :only_path) if ENV.fetch('RAILS_ENV', 'development') == 'production'
    redirect_to(redirect_url) #? 1st param = url_for() options
  end
  #* Following could be useful BUT no public/index.html until react creates in prod
  #* Instead the above fallback dev imitates prod redirects pretty well
  # def fallback_index_html
  #   render file: 'public/index.html'
  # end
end
