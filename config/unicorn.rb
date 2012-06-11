worker_processes 4 # amount of unicorn workers to spin up
timeout 30         # restarts workers that hang for 30 seconds

@resque_pid = nil

before_fork do |server, worker|
  @resque_pid ||= spawn("bundle exec padrino rake update")
end
