const gulp = require('gulp')
const standard = require('gulp-standard')
const uglify = require('gulp-uglify')
const pump = require('pump')
const mochaPhantomJS = require('gulp-mocha-phantomjs')
const rename = require('gulp-rename')

gulp.task('standard', function () {
  return gulp.src([ 'src/yaic.js' ])
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true
    }))
})

gulp.task('test', function () {
  return gulp
    .src('test/runner.html')
    .pipe(mochaPhantomJS())
})

gulp.task('dist', function () {
  return gulp
    .src('src/*.js')
    .pipe(gulp.dest('dist'))
    .pipe(uglify({source_map: true}))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist'))
})

gulp.task('default', [ 'standard', 'test', 'dist' ])
