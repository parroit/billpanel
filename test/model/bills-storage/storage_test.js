'use strict';

var chai = require('chai');
chai.expect();
chai.should();

var app = require('../../../lib/model/bills-storage');


describe('app', function () {
    it('is defined', function () {
        app.should.be.an('object');
    });

    describe('init', function () {
        it('is defined', function () {
            app.init.should.be.a('function');
        });

        it('save options', function () {
            app.init({
                couch:{db: 'http://localhost:5984/billy-test'}
            });
            app.options.couch.db.should.be.equal('http://localhost:5984/billy-test');
        });
    });



});
