var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var os = require('os-utils');


var cpuHistogram = [];
var histogramLength = 61;
var interval = 100;

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});


server.listen(4200, function () {

  for (var i = 0; i < histogramLength; i++) {
    cpuHistogram[i] = [i, 0];
  }

  setInterval(function () {

    os.cpuUsage(function (value) {
      updateCpuHistogram(Math.round(value * 100));
      io.emit('cpu histogram', cpuHistogram);

    });

  }, interval);

});

function updateCpuHistogram(cpuLoad) {
  if (cpuHistogram.length >= histogramLength) {

    cpuHistogram.shift();
  }

  cpuHistogram.push([0, cpuLoad]);

  for (var i = 0; i < histogramLength; i++) {
    cpuHistogram[i][0] = i;
  }

}