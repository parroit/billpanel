/*
 * billpanel
 * https://github.com//billpanel
 *
 * Copyright (c) 2014
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require('gulp');
var loadPlugins = require('gulp-load-plugins');
var $ = loadPlugins({
    lazy: true
});


// Copy all static images
gulp.task('test', ['build'], function() {
    return gulp.src('./test/*.js')
        .pipe($.mocha({
            globals: ['chai'],
            timeout: 6000,
            ignoreLeaks: false,
            ui: 'bdd',
            reporter: 'spec'
        }));
});

gulp.task('build', function() {
    return gulp.src('./lib/billpanel.js')
        .pipe($.browserify({
            transform: ['reactify'],
            debug: true
        }))
        .pipe($.rename('index.js'))
        .pipe(gulp.dest('web'));
});


gulp.task('watch-test', function() {
    gulp.watch(['./lib/**/*.js', './test/**/*.js'], ['test']);
});

gulp.task('watch-build', function() {
    gulp.watch(['./lib/**/*.js'], ['build']);
});

gulp.task('serve',['watch-build'], $.serve('web'));
