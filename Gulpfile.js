'use strict';

var gulp = require('gulp');
var loadPlugins = require('gulp-load-plugins');
var $ = loadPlugins({
    lazy: true
});

var source = require('vinyl-source-stream');
var browserify = require('browserify');


gulp.task('compile-react', function() {
    return gulp.src(['./lib/**/*.js', './test/**/*.js'], {base: '.'})
        .pipe($.react())
        .pipe(gulp.dest('reactified'));
});


gulp.task('test', ['compile-react'], function() {
    return gulp.src(['./reactified/test/**/*.js'])
        .pipe($.mocha({
            globals: ['chai'],
            timeout: 6000,
            ignoreLeaks: false,
            ui: 'bdd',
            reporter: 'spec'
        }));
});

gulp.task('browserify', function() {
    var b = browserify('./lib/app.js');
    b.transform('reactify');
    b.external('react');
    return b
        .bundle()
        .pipe(source('index.js'))
        .pipe(gulp.dest('web/js'));
});



gulp.task('vendor', function() {
    var b = browserify('react');
    b.require('react');
    return b
        .bundle()
        .pipe(source('vendor.js'))
        .pipe(gulp.dest('web/js'));

});


gulp.task('watch-test', function() {
    return gulp.watch(['./lib/**/*.js', './test/**/*.js'], ['test']);
});

gulp.task('watch-browserify', function() {
    return gulp.watch(['./lib/**/*.js'], ['browserify']);
});

gulp.task('serve',['watch-browserify'], $.serve('web'));
