require 'date'
require 'json'
require 'net/ftp'

class Updater
  @@root = "/pub/mozilla.org/firefox/nightly"

  @@names = {
    linux: ['*.linux-i686.tar.bz2'],
    linux64: ['*.linux-x86_64.tar.bz2'],
    win: ['*.win32.zip', '*.win32.installer.exe'],
    win64: ['*.win64-x86_64.installer.exe'],
    mac: ['*.mac64.dmg', '*.mac.dmg']
  }

  def run
    date = Date.today

    Net::FTP.open("ftp.mozilla.org") do |ftp|
      ftp.login

      5.times do
        ftp.chdir date.strftime("#{@@root}/%Y/%m/")
        pattern = date.strftime("%Y-%m-%d-*-mozilla-central")

        res = ftp.list(pattern).first
        if res
          ftp.chdir("#{ftp.pwd}/#{res.split.last}")
          self.fetch_current_day(ftp, date)
        end

        date = date.prev_day
      end

      ftp.close
    end
  end

  def fetch_current_day(ftp, date)
    sizes = {}
    @@names.each do |system, extensions|
      extensions.each do |ext|
        file = ftp.list(ext).first
        next unless file

        size = ftp.size(file.split.last)
        sizes[system] = size
      end
    end

    rec = Record.first(day: date)
    rec = Record.new(day: date) unless rec

    rec.data = sizes.to_json
    rec.save rescue false
  end
end

task :update do
  while true
    sleep 60
    puts "[Updater] starting..."
    Updater.new.run
    puts "[Updater] finished! Sleeping..."
  end
end
