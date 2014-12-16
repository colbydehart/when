var gulp = require('gulp'),
    karma = require('karma').server,
    $ = require('gulp-load-plugins')();


//Testing
gulp.task('test', function(done) {
  karma.start({
    configFile : __dirname + '/karma.conf.js',
    singleRun : true
  }, function(){
    done();
  });
});

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
    .pipe($.sass({
      includePaths : require('node-neat').includePaths
    }))
    .pipe(gulp.dest('app/css/'));
});

//Default
gulp.task('default', ['js', 'sass'], function() {
  gulp.watch(paths.js, ['js']);
  gulp.watch(paths.sass, ['sass']);
  gulp.src('app/')
    .pipe($.webserver({
      livereload : true,
      open : true
    }));
});
