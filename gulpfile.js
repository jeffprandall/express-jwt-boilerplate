const gulp = require('gulp')
const eslint = require('gulp-eslint')
const gulpNSP = require('gulp-nsp')
const browserify = require('browserify')
const babelify = require('babelify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const livereload = require('gulp-livereload');

// Build for Dev with tooling
gulp.task('build-dev', function () {
  return browserify({entries: ['./app/server.js'], debug: true})
    .transform("babelify", { presets: ["es2015"] })
    .bundle()
    .pipe(source('server.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(livereload());
});

// Build for Prod - not Dev Tools
gulp.task('build-prod', function () {
  return browserify({entries: ['./app/server.js'], debug: false})
    .transform("babelify", { presets: ["es2015"] })
    .bundle()
    .pipe(source('server.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
});

// Watch for changes to source files, then rebuild
gulp.task('watch', ['build-dev'], function () {
  gulp.watch(['./app/*.js', './app/**/*.js'], ['eslint', 'build-dev']);
});

// Run eslint to check our code compliance
gulp.task('eslint', () => {
  return gulp.src(['./app/*.js', './app/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .on('error', (error) => {
      console.error(String(error));
    });
});

// Check for any vulnerabilities in packagages
gulp.task('nsp', function (cb) {
  gulpNSP({package: __dirname + '/package.json'}, cb);
});

gulp.task('dev', ['build-dev', 'watch']);
gulp.task('prod', ['build-prod']);



// References
// https://thesocietea.org/2016/01/building-es6-javascript-for-the-browser-with-gulp-babel-and-more/
