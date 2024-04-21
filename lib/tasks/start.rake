namespace :start do
  task :development do
    #? system("some_command") returns true or false to indicate if your command successfully ran
    #? WHICH makes it convenient to display an error message via a `|| abort('message')` upon a false return
    system('hivemind Procfile.dev') || abort('\n== Ruby on Rails + React development start command failed ==')
  end
end

desc 'Start development server'
task start: 'start:development'
