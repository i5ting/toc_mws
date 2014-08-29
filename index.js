var fs = require('fs'),
    path = require('path'),
    argv = require('optimist').argv,
    connect = require('connect'),
    open = require('open'),
    tinylr = require('tiny-lr-fork'),
    lr = require('connect-livereload'),
    vfs = require('vinyl-fs'),
    request = require('request'),
    Q = require('q'),
    spawn = require('child_process').spawn,
    IonicProject = require('./project'),
    IonicTask = require('./task').IonicTask;
    IonicStats = require('./stats').IonicStats;

var IonicServeTask = function() {};

IonicServeTask.prototype = new IonicTask();

IonicServeTask.prototype.run = function(ionic) {
  var project = IonicProject.load();

  this.port = argv._[1] || 8100;
  this.liveReloadPort = argv._[2] || 35729;

  this.launchBrowser = !argv.nobrowser && !argv.b;
  this.runLivereload = !argv.nolivereload && !argv.r;
  this.watchSass = project.get('sass') === true && !argv.nosass && !argv.s;

  this._start(ionic);

  if(ionic.hasFailed) return;

  ionic.latestVersion.promise.then(function(){
    ionic.printVersionWarning();
  });
};

IonicServeTask.prototype._changed = function(filePath) {
  // Cleanup the path a bit
  var pwd = process.cwd();
  filePath = filePath.replace(pwd + '/', '');

  console.log( ('  changed: ' + filePath).green );

  var req = request.post('http://localhost:' + this.liveReloadPort + '/changed', {
    path: '/changed',
    method: 'POST',
    body: JSON.stringify({
      files: [filePath]
    })
  }, function(err, res, body) {
    if(err) {
      console.error('Unable to update live reload:', err);
    }
  });
};

IonicServeTask.prototype._start = function(ionic) {
  var self = this;
  var app = connect();

  if (!fs.existsSync( path.resolve('www') )) {
    return ionic.fail('"www" directory cannot be found. Make sure the working directory is an Ionic project.');
  }

  if(this.watchSass) {
    var childProcess = spawn('gulp', ['sass','watch']);

    childProcess.stdout.on('data', function (data) {
      process.stdout.write(data);
    });

    childProcess.stderr.on('data', function (data) {
      if(data) {
        process.stderr.write(data.toString().yellow);
      }
    });
  }

  if(this.runLivereload) {
    vfs.watch('www/**/*', {
    }, function(f) {
      self._changed(f.path);
    });

    server = tinylr();
    server.listen(this.liveReloadPort, function(err) {
      if(err) {
        return ionic.fail('Unable to start live reload server:', err);
      } else {
        console.log('Running live reload server:'.green.bold, (self.host(self.liveReloadPort).bold) );
        if(self.launchBrowser) {
          open( self.host(self.port) );
        }
      }
    });

    app.use(require('connect-livereload')({
      port: this.liveReloadPort
    }));
  }

  app.use(connect.static('www'))
    .listen(this.port);

  console.log('Running dev server:'.green.bold, ( this.host(this.port) ).bold);

  process.stdin.on('readable', function() {
    var chunk = process.stdin.read();
    if (chunk !== null && /exit|quit|close|stop/gi.test(chunk)) {
      process.exit();
    }
  });
};


IonicServeTask.prototype.host = function(port) {
  var addresses = [];

  try {
    var os = require('os');
    var ifaces = os.networkInterfaces();

    for (var dev in ifaces) {
      ifaces[dev].forEach(function(details){
        if (details.family == 'IPv4' && !details.internal) {
          addresses.push(details.address);
        }
      });
    }
  } catch(e) {}

  return 'http://' + (addresses.length === 1 ? addresses[0] : 'localhost') + ':' + port;
};

module.exports = IonicServeTask;