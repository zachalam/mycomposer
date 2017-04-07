var express = require('express');
var cors = require('cors');
var app = express();
var https = require('https');
var fs = require('fs');
var os = require('os');

var port = 8000;

app.use(cors());

app.all('*', function(req, res, next){
  if (req.secure) {
    return next();
  };
  res.redirect('https://'+req.hostname+':'+port+req.url);
});

app.get('/config', function(req, res) {
  var os = require('os');
  var ifaces = os.networkInterfaces();
  var values = Object.keys(ifaces).map(function(name) {
    return ifaces[name];
  });
  values = [].concat.apply([], values).filter(function(val){ 
    return val.family == 'IPv4' && val.internal == false; 
  });

  var config = {
    host: values.length ? values[0].address.replace(/\./g, '-') + '.whenhub.co' : ''
  };
  res.send(config);
});


app.use('/', express.static(__dirname));

var sslOptions = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

https.createServer(sslOptions, app).listen(port, function() { console.log('WhenHub My Composer started on port '+port)});