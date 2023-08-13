# Handles POST requests that result in emails sent out
class EmailsController < ActionController::Base
  protect_from_forgery with: :exception
  #? BeforeActions seem to run in order of declaration
  before_action :contactable?, only: %i[contact_email]
  before_action :validate_email_param, only: %i[contact_email]

  #* POST request to send email BUT 1st check with turnstile backend if human
  def contact_email
    turnstile_res = turnstile_check(params[:cfToken], request.remote_ip)
    http_status = turnstile_res['success'] ? :ok : :forbidden
    if turnstile_res['success']
      sender = { email: params[:email], message: params[:message] }
      ContactMeMailer.contact_me(sender).deliver_later #? Send asyncly once resources are ready
    end
    render json: turnstile_res, status: http_status
  end

  private

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
