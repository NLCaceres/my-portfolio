class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  #* Since root (localhost:3000/) fires this method, we can be sure we redirect to React locally / in dev
  #* Thanks to combination of root + "*path" route setup in config/routes, of course!
  #? Following ONLY runs in local dev, in production, React will handle most redirects
  def fallback_redirect
    redirect_to path: 'portfolio', port: 3000, only_path: false
    #? 'only_path: false' ensures ENTIRE url is redirect url "http://localhost/foobar" vs "/foobar"
    # render 'index' #? Would make a request to application/index.html.erb
  end
  #* Following could be useful BUT no public/index.html until react creates in prod
  #* Instead the above fallback dev imitates prod redirects pretty well
  # def fallback_index_html
  #   render file: 'public/index.html'
  # end
end
