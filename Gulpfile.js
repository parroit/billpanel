'use strict';

var gulp = require('gulp');
var loadPlugins = require('gulp-load-plugins');
var $ = loadPlugins({
    lazy: true
});

var source = require('vinyl-source-stream');
var browserify = require('browserify');

var vendorLibs = [
    'react',
    'jquery',
    'couch-promise',
    'react-bootstrap',
    'moment',
    'underscore',
    'nchart'
];


gulp.task('test', ['browserify-test'], function() {
    return gulp.src(['./web/runner.html'])
        .pipe($.mochaPhantomjs());
});

gulp.task('browserify-test', function() {
    var b = browserify('./test/billpanel_test.js');
    b.transform('reactify');
    b.external('react');
    return b
        .bundle({
            insertGlobals: true
        })
        .pipe(source('test.js'))
        .pipe(gulp.dest('web/js'));
});

gulp.task('browserify', function() {
    var b = browserify('./lib/app.js');
    b.transform('reactify');
    vendorLibs.forEach(function(lib) {
        b.external(lib);
    });


    return b
        .bundle({
            insertGlobals: true
        })
        .pipe(source('index.js'))
        .pipe(gulp.dest('web/js'));
});



gulp.task('vendor', function() {
    var b = browserify(vendorLibs);
    vendorLibs.forEach(function(lib) {
        b.require(lib);
    });

    return b
        .bundle({
            insertGlobals: true
        })
        .pipe(source('vendor.js'))
        .pipe(gulp.dest('web/js'));

});


gulp.task('watch-test', function() {
    return gulp.watch(['./lib/**/*.js', './test/**/*.js'], ['test']);
});

gulp.task('watch-browserify', function() {
    return gulp.watch(['./lib/**/*.js'], ['browserify']);
});

gulp.task('serve', ['browserify', 'watch-browserify'], $.serve('web'));
