const gulp = require('gulp')
const standard = require('gulp-standard')
const uglify = require('gulp-uglify')
const pump = require('pump')
const mochaPhantomJS = require('gulp-mocha-phantomjs')
const rename = require('gulp-rename')
const header = require('gulp-header')
const trim = require('gulp-trimlines')
const pkg = require('./package.json')

var headerLong = [
  '/*!',
  '* <%= pkg.name %> - <%= pkg.description %>',
  '* @version <%= pkg.version %>',
  '*',
  '* @copyright <%= pkg.author %>',
  '* @license <%= pkg.license %>',
  '*',
  '* BUILT: <%= pkg.buildDate %>',
  '*/;',
  '' ].join('\n')

var headerShort = '/*! <%= pkg.name %> v<%= pkg.version %> <%= pkg.license %>*/;'

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
  pkg.buildDate = Date()
  return gulp
    .src('src/*.js')
    .pipe(header(headerLong, { pkg: pkg }))
    .pipe(trim({ leading: false }))
    .pipe(gulp.dest('dist'))
    .pipe(uglify({ source_map: true }))
    .pipe(header(headerShort, { pkg: pkg }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist'))
})

gulp.task('default', [ 'standard', 'test', 'dist' ])
