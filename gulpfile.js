// -----------------------------------------------------------------------------
//
// Gulpfile
//
// TODO: Write description.
//
// 
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
//
// Project constants
//
// Change any input/output directories or filenames here.
//
// -----------------------------------------------------------------------------

// Directories
const SRC  = './src';
const DEST = './dist';
const SRC_JS_DIRECTORY = SRC + '/js/';
const DEST_JS_DIRECTORY = DEST + '/js/';
const SRC_CSS_DIRECTORY = SRC + '/sass/';
const DEST_CSS_DIRECTORY = DEST + '/css/';

// Filenames
const SRC_JS_FILENAME = 'main.js';
const DEST_JS_FILENAME = SRC_JS_FILENAME;	// Same filename for both.

const SRC_CSS_FILENAME = 'application.scss';
const DEST_CSS_FILENAME = 'application.css';


// Exact file locations
const SRC_JS_FILEPATH = SRC_JS_DIRECTORY + SRC_JS_FILENAME;
const DEST_JS_FILEPATH = DEST_JS_DIRECTORY + DEST_JS_FILENAME;

const SRC_CSS_FILEPATH = SRC_CSS_DIRECTORY + SRC_CSS_FILENAME;
const DEST_CSS_FILEPATH = DEST_CSS_DIRECTORY + DEST_CSS_FILENAME;



// -----------------------------------------------------------------------------
//
// NPM dependencies/imports
//
// -----------------------------------------------------------------------------

var gulp               = require('gulp');
var changed            = require('gulp-changed');
var sass               = require('gulp-sass');
var browserify         = require('gulp-browserify');
var plumber            = require('gulp-plumber');
var jshint             = require('gulp-jshint');
var clean              = require('gulp-clean');
var runSequence        = require('run-sequence');
var bourbon            = require('node-bourbon');
var map                = require('map-stream');
var concat             = require('gulp-concat');
var ngAnnotate         = require('gulp-ng-annotate');
var uglify             = require('gulp-uglify');
var minifyCSS          = require('gulp-minify-css');


// -----------------------------------------------------------------------------
//
// Core tasks
//
// Generally speaking, these are what you should be running from the CLI.
//
// -----------------------------------------------------------------------------


// Task to run during development
gulp.task('dev', function() {

	runSequence([ 'scripts-dev', 'styles-dev']);

});

// Task to run for distribution
gulp.task('dist', function() {

	runSequence([ 'scripts-dist', 'styles-dist']);

});

// Watch for changes and build for development
gulp.task('watch', function() {

	gulp.watch( 
        SRC_CSS_DIRECTORY + '**/*.scss', 
        [ 'styles-dev' ]
    );

    gulp.watch( 
        SRC_JS_DIRECTORY + '**/*.js', 
        [ 'scripts-dev' ]
    );

});


// -----------------------------------------------------------------------------
//
// Task recipes
// 
// What should actually be happening when you run a core task.
//
//
// -----------------------------------------------------------------------------

gulp.task( 'scripts-dev', function () {

    runSequence('clean', 'js-hint', 'concat-js', 'browserify');

} );


gulp.task( 'styles-dev', function () {

    runSequence('sass');

} );

gulp.task( 'scripts-dist', function () {

    runSequence('clean', 'js-hint', 'concat-js', 'browserify', 'dirty');

} );


gulp.task( 'styles-dist', function () {

    runSequence('sass', 'minify-css');

} );






// ------------------------------------------------------------------------------
//
// Concatenate Javascript
//
// Combine all clientside Javascript files into one to reduce HTTP requests.
// https://developer.yahoo.com/performance/rules.html#num_http
//
//
// USAGE:
//
// Browserify handles most of this already, but not all JS libraries/frameworks
// have a browserify distribution. To include them in your project, you'll need
// to manually add them, in the appropriate order, to the filesToConcatenate 
// array.
//
// ------------------------------------------------------------------------------

gulp.task('concat-js', function() {

	var filesToConcatenate = [SRC_JS_FILEPATH];

	return gulp.src(filesToConcatenate)
    	.pipe(concat(DEST_JS_FILENAME))
    	.pipe(gulp.dest(DEST_JS_DIRECTORY));

});


// ------------------------------------------------------------------------------
//
// Browserify Javascript
//
// NodeJS-style dependency injection for client-side Javascript.
// http://browserify.org/
//
// 
// NOTE: 
// 
// This should ideally be run after concatenation to avoid importing
// packages multiple times.
//
// ------------------------------------------------------------------------------

gulp.task('browserify', function () {

    var fileToBrowserify = DEST_JS_FILEPATH;

    return gulp.src(fileToBrowserify)
        .pipe(browserify({
          insertGlobals : false,
          debug : false
        }))
        .pipe(gulp.dest(DEST_JS_DIRECTORY));

} );

// ------------------------------------------------------------------------------
//
// Clean files
//
// Ensure we're working with a fresh start. Only freshly built files should exist
// in our dist directory.
//
// ------------------------------------------------------------------------------

gulp.task( 'clean', function () {

    var filesToClean = [DEST_JS_DIRECTORY + '**/*.js'];

    return gulp.src(filesToClean)
    	.pipe(clean());

} );


// ------------------------------------------------------------------------------
//
// JSHint Javascript files
//
// We run a tight ship here.
//
// ------------------------------------------------------------------------------

gulp.task( 'js-hint', function () {

    var filesToHint = [
        SRC_JS_FILEPATH,
        './gulpfile.js'
    ];

    return gulp.src( filesToHint )
            .pipe( jshint() )

} );


// ------------------------------------------------------------------------------
//
// Obfuscate final Javascript file.
//
// Compress scripts for lighter load weight.
// https://developer.yahoo.com/performance/rules.html#minify
//
// ------------------------------------------------------------------------------


gulp.task( 'dirty', function () {

    var filesToUglify = [ DEST_JS_FILEPATH ];

    return gulp.src( filesToUglify )
            .pipe( ngAnnotate() ) // Angular will fail otherwise due to stringy vars
            .pipe( uglify() )
            .pipe( gulp.dest( DEST_JS_DIRECTORY ) );

} );





// ------------------------------------------------------------------------------
//
// Process Sass/SCSS files. Include Bourbon for mixins.
//
//
// http://sass-lang.com
// http://bourbon.io
//
// ------------------------------------------------------------------------------

gulp.task( 'sass', function () {

    return gulp.src( SRC_CSS_FILEPATH )
            .pipe( sass( {
                includePaths: bourbon.includePaths
            } ) )
            .pipe( gulp.dest( DEST_CSS_DIRECTORY ) );

} );


// ------------------------------------------------------------------------------
//
// Minify final stylesheets for lighter load.
// https://developer.yahoo.com/performance/rules.html#minify
//
// NOTE:
// Uncomment the uncss pipe if you want even more savings. It scans your DOM
// to filter out any unused selectors, but isn't compatible with some projects.
//
// ------------------------------------------------------------------------------



gulp.task( 'minify-css', function() {

    return gulp.src( DEST_CSS_FILEPATH )
        //  ENABLE FOR BEAST MODE
        // .pipe( uncss( {
        //     html: [ './www/index.html' ]  // Remove unused selectors
        // } ) )
        .pipe( minifyCSS( {
          keepBreaks:true
        } ) )
        .pipe( gulp.dest( DEST_CSS_DIRECTORY ) );

} );


