module Rack
  class DomainRedirect
    def initialize(app, hosts = [])
      @app = app
      @hosts = hosts
    end

    def call(env)
      req = Rack::Request.new(env)

      if @hosts.nil? or @hosts.empty? or @hosts.include?(req.host)
        @app.call(env)
      else
        res = Rack::Response.new
        res.redirect("http://#{@hosts[0]}/")
        res.finish
      end
    end
  end
end
