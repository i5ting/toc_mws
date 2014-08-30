var gulp = require('gulp');
var watch = require('gulp-watch');
var markdown = require('gulp-markdown-livereload');
var livereload = require('gulp-livereload');
var dest = 'public';

gulp.task('server', function(next) {
  var connect = require('connect');
  var server = connect();
  var port = process.env.PORT || 8900;
	
	// use static dir	
  server.use(connect.static(dest)).listen(port, next);
	
	// open index
	require("open")("http://127.0.0.1:" + port + "/");		
}); 

gulp.task('default',['server'], function() { 
	livereload.listen();
	
  watch({ glob: './src/*.md' })
	.pipe(markdown())
	.pipe(gulp.dest('./public/'));

	gulp.src('public/*.html')
  .pipe(watch())
  .pipe(livereload({ auto: true }));	
})
