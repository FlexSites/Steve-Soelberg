import header from 'gulp-header';
import prettify from 'gulp-prettify';
import gulp from 'gulp';
import rev from 'gulp-rev';
import revReplace from 'gulp-rev-replace';
import gulpif from 'gulp-if';
import sass from 'gulp-sass';
import del from 'del';
import runSequence from 'run-sequence';
import pkg from './package.json';
import connect from 'gulp-connect';

/** ALIASES **/
gulp.task('watch', ['default']);
gulp.task('sass', ['css']);

/** TASKS **/
gulp.task('default', ['server', 'assetsDev'], watch);
gulp.task('server', server);
gulp.task('build:livereload', ['assetsDev']);
gulp.task('assets', ['css'], assets);
gulp.task('assetsDev', ['css'], assetsDev);
gulp.task('css', css);
gulp.task('clean', clean);

gulp.task('build', (done) => {
  runSequence('clean', 'assets', done);
});

/** FILESYSTEM WATCHER **/
function watch(){
  gulp.watch(['source/**/*', '!**/*.css'], ['build:livereload']);
}

function server() {
  connect.server({
    port: 8080,
    root: 'public',
    livereload: true
  })
}

/** DELETE PUBLIC **/
function clean(){
  del.sync(['public']);
}

  /** DELETE PUBLIC **/
function css(){
  return gulp.src('source/scss/**.scss')
    .pipe(sass())

  // .pipe(sourcemaps.write('maps', {
  //     includeContent: false, //     sourceRoot: '/source'
  // }))

  .pipe(gulp.dest('source/css'));
}

/** BUILD PROCESS **/
function assets() {
  return gulp.src(['source/**/*', '!**/*.scss'])

    // Minify JS
    // .pipe(gulpif('*.js', uglify()))

    // Minify CSS
    // .pipe(gulpif('*.css', minifyCSS({ keepSpecialComments: 0 })))

    // Prettify HTML
    .pipe(gulpif('*.html', prettify({
      indent_size: 2,
    })))

    // Add versioned headers
    .pipe(gulpif('*.html', header('<!-- ' + pkg.name + ' v' + pkg.version + ' -->\n\n')))
    .pipe(gulpif(isJSorCSS, header('/* ' + pkg.name + ' v' + pkg.version + ' */\n\n')))

    // Optimize images
    // .pipe(imagemin({
    //   progressive: true, //   interlaced: true
    // }))

    // Add revision sha-sum
    .pipe(gulp.dest('./public'))
    .pipe(gulpif(isJSorCSS, rev()))

    // // Replace sha'd references in all text files
    .pipe(revReplace())

    // Output stream to 'public'
    .pipe(gulp.dest('./public'));
}

function assetsDev(){
  return gulp.src(['source/**/*.*', '!**/*.scss'])
    .pipe(gulp.dest('public'))
    .pipe(connect.reload());
}
function isJSorCSS(vinyl){
  return /\.(js|css)$/.test(vinyl.relative);
}
