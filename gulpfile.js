var gulp = require('gulp');
var watch = require('gulp-watch');
var markdown = require('gulp-markdown-livereload');
var connect = require('gulp-connect');
var livereload = require('gulp-livereload');
var dest = 'public';
		
		 
gulp.task('server', function(next) {
  var connect = require('connect');
  var server = connect();
  var port = process.env.PORT || 8900;

	// server.use(require('connect-livereload')({
//     port: 35729,
//     ignore: ['.js', '.svg']
//   }));
	
  server.use(connect.static(dest)).listen(port, next);
	
	var open = require("open");
	open("http://127.0.0.1:" + port + "/");		
});

var tinylr = require('tiny-lr');

gulp.task('default',['server'], function() { 
	livereload.listen();
	
  watch({ glob: './src/*.md' })
	.pipe(markdown())
	.pipe(gulp.dest('./public/'));

	gulp.src('public/*.html')
  .pipe(watch())
  .pipe(livereload({ auto: true }));	
}); 

gulp.task('src', function(done) {
	console.log('gulp watch log info : src directory changed.');
});
 