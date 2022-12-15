Rails.application.routes.draw do
  #? For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  #? Root put 1st to match 1st + frequently visited (defaults to 'Rails Welcome' page when not set)
  root 'application#fallback_redirect'

  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  get '*path', to: 'application#fallback_redirect', constraints: ->(request) { !request.xhr? && request.format.html? }

  scope '/api' do
    resources :posts
    get '/routes', to: 'application#routes', as: 'routes' # 'as' symbol help form route name (i.e. 'routes_url' or 'routes_path')
  end
end
