var gulp = require('gulp'),
    $ = require('gulp-load-plugins')();

//Javascript
gulp.task('js', function() {
  gulp.src('js/*.js')
    .pipe($.plumber())
    .pipe($.concat('app.js'))
    // .pipe($.uglify())
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

gulp.task('lr', function() {
  gulp.src('./app/*') 
    .pipe($.connect.reload());
});

//Default
gulp.task('default', ['js', 'sass'], function() {
  gulp.watch('js/*.js', ['js']);
  gulp.watch('sass/**/*.scss', ['sass']);
  gulp.watch('app/**/*', ['lr']);
  $.connect.server({
    livereload : true,
    root : 'app',
    host : '*',
    open : true
  });
});
