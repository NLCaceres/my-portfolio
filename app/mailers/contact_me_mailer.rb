#* View and data store for Contact Me Emails
class ContactMeMailer < ApplicationMailer
  default to: ENV['MY_CONTACT_EMAIL'], from: ENV['APP_CONTACT_EMAIL']
  layout 'mailer'

  def contact_me(sender)
    @sender = { email: sender[:email], message: sender[:message] }
    mail(subject: "New Message on Portfolio Site from #{sender[:email]}")
  end
end
