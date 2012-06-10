source :rubygems
ruby '1.9.3'

# Server requirements
# gem 'thin' # or mongrel
# gem 'trinidad', :platform => 'jruby'
gem 'unicorn'

# Project requirements
gem 'rake'

# Component requirements
gem 'haml'
gem 'sequel'

# Test requirements

# Padrino Stable Gem
gem 'padrino', '0.10.6'

group :development do
  gem 'sqlite3'
end

group :production do
  gem 'pg'
end

# Or Padrino Edge
# gem 'padrino', :git => 'git://github.com/padrino/padrino-framework.git'

# Or Individual Gems
# %w(core gen helpers cache mailer admin).each do |g|
#   gem 'padrino-' + g, '0.10.6'
# end
