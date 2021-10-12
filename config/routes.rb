Rails.application.routes.draw do
  #? For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  #? Recommended to place root 1st since it's so commonly used
  root to: 'application#fallback_redirect' #? root ONLY works if public/index.html DOESN'T exist. Else it defaults to it

  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  get '*path', to: 'application#fallback_redirect', constraints: ->(request) { !request.xhr? && request.format.html? }

  scope '/api' do
    resources :posts
  end
end
