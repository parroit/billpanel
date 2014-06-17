'use strict';

var gulp = require('gulp');
var loadPlugins = require('gulp-load-plugins');
var $ = loadPlugins({
    lazy: true
});
//var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserify = require('browserify');

var vendorLibs = [
    'react',
    'jquery',
    'couch-promise',
    'react-bootstrap',
    'moment',
    'underscore',
    'nchart',
    'ramda'
];

function testMochaPhantom() {
    return gulp.src(['./web/runner.html'])
        .pipe($.mochaPhantomjs());
}


gulp.task('test', ['browserify-test'], testMochaPhantom);
gulp.task('testMochaPhantom', testMochaPhantom);



gulp.task('browserify-test', function() {
    var b = browserify('./test/billpanel_test.js');
    vendorLibs.forEach(function(lib) {
        b.external(lib);
    });

    var bundle = b
        .bundle({
            insertGlobals: true
        });
    /*
    bundle.on('error',function(err){
        gutil.log(err);
        bundle.end();
    });
*/
    return bundle
        .pipe(source('test.js'))
        .pipe(gulp.dest('web/js'));
});

gulp.task('browserify', function() {
    var b = browserify('./lib/app.js');
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

gulp.task('jsxify', function() {

    return gulp.src('./lib/templates/**/*.html')
        .pipe($.jsxify({
            requires: {
                Row: 'react-bootstrap/Row',
                Col: 'react-bootstrap/Col',
                Panel: 'react-bootstrap/Panel',
                Table: 'react-bootstrap/Table',
                TabbedArea: 'react-bootstrap/TabbedArea',
                TabPane: 'react-bootstrap/TabPane',
                Button: 'react-bootstrap/Button',
                LineChart: '../LineChart',
                TotalsTable: '../TotalsTable',
                BillsTable: '../BillsTable',
                SetPayed: '../SetPayed',
                BillsTotals: '../BillsTotals',
                BillCharts: '../BillCharts',
                BillsTabs: '../BillsTabs',
                Status: '../Status',
                Spinner: '../Spinner'
            }
        }))
        .pipe($.react())
        .pipe(gulp.dest('./lib/built-templates'));
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


gulp.task('watch-test', ['test'] ,function() {
    gulp.watch(['./lib/**/*.js', './test/**/*.js'], ['browserify-test']);
    gulp.watch(['./web/js/test.js'], ['testMochaPhantom']);
});

gulp.task('watch-browserify', function() {
    return gulp.watch(['./lib/**/*.js'], ['browserify']);
});

gulp.task('watch-jsxify', function() {
    return gulp.watch(['./lib/templates/**/*.html'], ['jsxify']);
});


gulp.task('serve', ['browserify', 'watch-browserify'], $.serve('web'));
