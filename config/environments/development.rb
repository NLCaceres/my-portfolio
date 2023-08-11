require 'active_support/core_ext/integer/time'

# rubocop:disable Metrics/BlockLength
Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # In the development environment your application's code is reloaded any time
  # it changes. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports.
  config.consider_all_requests_local = true

  # Enable/disable caching. By default caching is disabled.
  # Run rails dev:cache to toggle caching.
  if Rails.root.join('tmp', 'caching-dev.txt').exist?
    config.cache_store = :memory_store
    config.public_file_server.headers = { 'Cache-Control' => "public, max-age=#{2.days.to_i}" }
  else
    config.action_controller.perform_caching = false
    config.cache_store = :null_store
  end

  # Store uploaded files on the local file system (see config/storage.yml for options).
  config.active_storage.service = :local

  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = false
  config.action_mailer.delivery_method = :smtp
  config.action_mailer.smtp_settings = {
    user_name: ENV['MAILTRAP_USERNAME'], password: ENV['MAILTRAP_PASSWORD'],
    address: 'sandbox.smtp.mailtrap.io', port: '2525', domain: 'sandbox.smtp.mailtrap.io', authentication: :cram_md5
  }
  config.action_mailer.perform_caching = false

  config.active_support.deprecation = :log # Print deprecation notices to the Rails logger

  config.active_support.disallowed_deprecation = :raise # Raise exceptions for disallowed deprecations

  config.active_support.disallowed_deprecation_warnings = [] # Tell Active Support the deprecation messages to disallow

  config.active_record.migration_error = :page_load # Raise an error on page load if there are pending migrations

  config.active_record.verbose_query_logs = true # Highlight code that triggered database queries in logs

  config.assets.debug = true
  config.assets.quiet = true # Suppress logger output for asset requests

  # config.i18n.raise_on_missing_translations = true # Raises error for missing translations

  # config.action_view.annotate_rendered_view_with_filenames = true # Annotate rendered view with file names

  # Use an evented file watcher to asynchronously detect changes in source code,
  # routes, locales, etc. This feature depends on the listen gem.
  config.file_watcher = ActiveSupport::EventedFileUpdateChecker

  # config.action_cable.disable_request_forgery_protection = true # Uncomment to let Action Cable access from any origin
end
