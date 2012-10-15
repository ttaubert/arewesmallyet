(function () {
  function limitDataPoints(plot) {
    var minDistance = 0;

    function getMinDistance(plot) {
      var series = plot.getData();
      var xaxis = plot.getAxes().xaxis;

      var values = [];
      var opts = xaxis.options;
      var min = opts.min, max = opts.max;

      if (!(min && max)) {
        series.forEach(function (s) {
          var count = 0;
          s.data.forEach(function (d) {
            d && values.push(d[0]);
          });

        });

        min = min || Math.min.apply(Math, values);
        max = max || Math.max.apply(Math, values);
      }

      var width = $("#graph").width();
      return 8 * (max - min) / width;
    }

    plot.hooks.processRawData.push(function (plot, series, data, datapoints) {
      if (series == plot.getData()[0])
        minDistance = getMinDistance(plot);

      var lastDate;
      var values;

      for (var d = data.length - 1; d >= 0; d--) {
        var date = data[d][0];
        var value = data[d][1];

        if (lastDate && date + minDistance > lastDate) {
          data.splice(d, 1);
          values.push(value);
        } else {
          if (lastDate) {
            values.sort();
            data[d + 1][1] = values[Math.floor(values.length / 2)];
          }

          lastDate = date;
          values = [value];
        }
      }
    });
  }

  function insertReleaseTicks(plot) {
    plot.hooks.draw.push(function (plot, ctx) {
      $(".release").remove();

      var releaseDates = [
        ["2011-03-03", "Fx 5"],
        ["2011-04-12", "Fx 6"],
        ["2011-05-24", "Fx 7"],
        ["2011-07-05", "Fx 8"],
        ["2011-08-16", "Fx 9"],
        ["2011-09-27", "Fx 10"],
        ["2011-11-08", "Fx 11"],
        ["2011-12-20", "Fx 12"],
        ["2012-01-31", "Fx 13"],
        ["2012-03-13", "Fx 14"],
        ["2012-04-24", "Fx 15"],
        ["2012-06-05", "Fx 16"],
        ["2012-07-17", "Fx 17"],
        ["2012-08-28", "Fx 18"],
        ["2012-10-09", "Fx 19"]
      ];

      ctx.save();

      var off = plot.getPlotOffset();
      ctx.translate(off.left, off.top);

      ctx.strokeStyle = "#888";
      ctx.lineWidth = 1;
      ctx.beginPath();

      var xaxis = plot.getAxes().xaxis;
      var plotHeight = plot.height();
      var plotWidth = plot.width();

      releaseDates.forEach(function (rdate) {
        var x = xaxis.p2c(+new Date(rdate[0]));
        rdate[0] = Math.floor(x) + 0.5;
      });

      releaseDates.forEach(function (rdate, index) {
        var x = rdate[0];
        var isLast = index + 1 >= releaseDates.length;
        var nextx = isLast ? plotWidth : releaseDates[index + 1][0];
        if (x >= plotWidth || (!isLast && nextx <= 0))
          return;

        if (x > 0 && x < plotWidth) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, plotHeight);
        }

        var label = $('<div class="release"/>')
          .text(rdate[1]).appendTo("#graph");

        var left = Math.max(0, x);
        var right = Math.min(plotWidth, nextx);
        var mid = left + ((right - left) / 2);
        var labelmid = label.width() / 2;
        label.css("left", (off.left + Math.max(left, mid - labelmid)) + "px");
      });

      ctx.stroke();
      ctx.restore();
    });
  }

  $.plot.plugins.push({init: limitDataPoints});
  $.plot.plugins.push({init: insertReleaseTicks});
})();
