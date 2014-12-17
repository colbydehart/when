var gulp = require('gulp'),
    $ = require('gulp-load-plugins')();

//Javascript
gulp.task('js', function() {
  gulp.src('js/*.js')
    .pipe($.plumber())
    .pipe($.concat('app.js'))
    .pipe($.uglify())
    .pipe(gulp.dest('app/js/'));
});

//Sass
gulp.task('sass', function() {
  gulp.src('sass/main.scss')
    .pipe($.plumber())
    .pipe($.sass())
    .pipe(gulp.dest('app/css/'));
});

//Build
gulp.task('build',['js', 'sass'], function() {
  console.log('Site built at app/'); 
});

//Default
gulp.task('default', ['js', 'sass'], function() {
  gulp.watch('js/*.js', ['js']);
  gulp.watch('sass/**/*.scss', ['sass']);
  gulp.src('app/')
    .pipe($.webserver({
      livereload : true,
      open : true
    }));
});
