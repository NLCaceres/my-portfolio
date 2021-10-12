class ApiController < ActionController::API
  # protect_from_forgery with: :exception #? Not possible with API base
  # include ActionController::RequestForgeryProtection #? BUT is possible if included
end
