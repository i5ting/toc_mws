var gulp = require('gulp');
var watch = require('gulp-watch');
var marked = require('gulp-marked');
var markdown = require('gulp-markdown');
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
	
  // var server = tinylr();
  // server.listen(35729, function(err) {
  //   if(err) {
  //     return console.log('Unable to start live reload server:', err);
  //   } else {
  //     console.log('Running live reload server:' + 35729 );
  //     if(true) {
  // 		 	// open("http://localhost:8900/public");
  //     }
  //   }
  // });
  //
	
	
  watch({ glob: './src/*.md' })
	.pipe(markdown())
	.pipe(gulp.dest('./public/'));
	 	//
	gulp.src('public/*.html')
	    .pipe(watch())
	    .pipe(livereload({ auto: true }));
			
			gulp.watch(dest + '/**').on('change', function(file) {
			      livereload().changed(file.path);
			  });
	//
	// 		gulp.src('./public/*.html')
	// 		    .pipe(connect.reload({
	// 					 root: 'public',
	// 			    livereload: true
	// }));
 
}); 

gulp.task('src', function(done) {
	console.log('gulp watch log info : src directory changed.');
});
 