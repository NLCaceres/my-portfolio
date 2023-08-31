#* Preview all emails at http://localhost:3001/rails/mailers/contact_me_mailer
class ContactMeMailerPreview < ActionMailer::Preview
  # http://localhost:3001/rails/mailers/contact_me_mailer/contact_me
  def contact_me
    sender = {
      email: 'Foobar@email.com',
      message: "Hello world! I hope you are doing well. I'm writing to reach out to discuss future endeavors and begin "\
               'the recruitment process'
    }
    ContactMeMailer.contact_me(sender)
  end

  # http://localhost:3001/rails/mailers/contact_me_mailer/safelist_sanitized_contact_me
  def safelist_sanitized_contact_me
    sender = {
      email: 'Foobar@email.com',
      message: "<b>Hello</b> world! <em>I hope you are doing well.</em> I'm writing to reach out to discuss future "\
               'endeavors and begin the recruitment process. <a href="my-bad-link.com">Please click here</a>'
    }
    ContactMeMailer.contact_me(sender)
  end

  # http://localhost:3001/rails/mailers/contact_me_mailer/full_sanitized_contact_me
  def full_sanitized_contact_me
    sender = {
      email: 'Foobar@email.com',
      message: "<b>Hello</b> world! <em>I hope you are doing well.</em> I'm writing to reach out to discuss future "\
               'endeavors and begin the recruitment process. <a href="my-bad-link.com">Please click here</a> '\
               '<img src="another-bad-link.com" alt="It will be fine! Promise!">'
    }
    ContactMeMailer.contact_me(sender)
  end
end
