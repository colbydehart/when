var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    app = require('./server.js');

//Javascript
gulp.task('js', function() {
  gulp.src('client/js/*.js')
    .pipe($.plumber())
    .pipe($.concat('app.js'))
    .pipe(gulp.dest('public/js/'));
});

//Sass
gulp.task('sass', function() {
  gulp.src('client/sass/main.scss')
    .pipe($.plumber())
    .pipe($.sass())
    .pipe(gulp.dest('public/css/'));
});

//Build
gulp.task('build',['js', 'sass'], function() {
  console.log('Site built at public/'); 
});

//Default
gulp.task('default', ['js', 'sass'], function() {
  gulp.watch('client/js/*.js', ['js']);
  gulp.watch('client/sass/**/*.scss', ['sass']);
});
