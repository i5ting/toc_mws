var gulp = require('gulp');
var watch = require('gulp-watch');
var marked = require('gulp-marked');
var markdown = require('gulp-markdown');
var connect = require('gulp-connect');


var livereload = require('gulp-livereload'),
    dest = 'public';
		
		 
gulp.task('server', function(next) {
  var connect = require('connect'),
      server = connect(),
			port = process.env.PORT || 8900;

  server.use(connect.static(dest)).listen(port, next);
	
	var open = require("open");
	open("http://127.0.0.1:" + port + "/");
});

gulp.task('watch', function() {
  var server = livereload();
  gulp.watch('./public/*.html').on('change', function(file) {
		console.log(file + '' + file.path );
    server.changed(file.path);
  });   
});

gulp.task('default',['server','watch'], function() { 
  watch({ glob: './src/*.md' })
	.pipe(markdown())
	.pipe(gulp.dest('./public/'));
	 
	gulp.src('public/*.html')
	    .pipe(watch())
	    .pipe(livereload());
 
}); 

gulp.task('src', function(done) {
	console.log('gulp watch log info : src directory changed.');
});
 