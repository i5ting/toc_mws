var gulp = require('gulp');
var livereload = require('gulp-livereload'),
    dest = 'build';

gulp.task('server', function(next) {
  var connect = require('connect'),
      server = connect();
  server.use(connect.static(dest)).listen(process.env.PORT || 8900, next);
});

gulp.task('watch', ['server'], function() {
  var server = livereload();
  gulp.watch(dest + '/**').on('change', function(file) {
      server.changed(file.path);
  });
});


gulp.task('default',['server']);