require 'test_helper'

#* Tests simple Contact Me messages and those that need sanitization from HTML
class ContactMeMailerTest < ActionMailer::TestCase
  test 'contact me' do
    message = "Hello world! I hope you are doing well. I'm writing to reach out to discuss future endeavors and begin "\
              'the recruitment process'
    sender = { email: 'Foobar@email.com', message: }
    email = ContactMeMailer.contact_me(sender)

    assert_emails 1 do #? Check that email was sent and queued up
      email.deliver_now
    end

    #? Mailer Defaults set by the ENV hash CANNOT be altered
    assert_equal ['foo@example.com'], email.to
    assert_equal ['bar@example.com'], email.from
    assert_equal 'New Message on Portfolio Site from Foobar@email.com', email.subject
    assert email.body.include? 'Foobar@email.com'
    assert email.body.include? message
  end

  test 'sanitized contact email' do
    bad_message = "<b>Hello</b> world! <em>I hope you are doing well.</em> I'm writing to reach out to discuss future "\
                  'endeavors and begin the recruitment process. <a href="my-bad-link.com">Please click here</a> '\
                  '<img src="another-bad-link.com" alt="It will be fine! Promise!">'
    sender = { email: 'barfoo@email.com', message: bad_message }
    email = ContactMeMailer.contact_me(sender)

    assert_emails 1 do
      email.deliver_now
    end

    assert_equal ['foo@example.com'], email.to
    assert_equal ['bar@example.com'], email.from
    #* If the sender's email is all lowercase, then this will match in the Subject line. No TitleCase transform
    assert_equal 'New Message on Portfolio Site from barfoo@email.com', email.subject
    assert email.body.include? 'barfoo@email.com'

    assert_not email.body.include? bad_message #? Should not get a message with any HTML tags
    expected_good_message = "Hello world! I hope you are doing well. I'm writing to reach out to discuss future "\
                            'endeavors and begin the recruitment process. Please click here '
    assert email.body.include? expected_good_message #? Should get a very plain simple text message
  end
end
