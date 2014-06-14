/*
 * billpanel
 * https://github.com//billpanel
 *
 * Copyright (c) 2014
 * Licensed under the MIT license.
 */

'use strict';

var chai = require('chai');
chai.expect();
chai.should();

var model = require('../lib/groupBills');
var moment = require('moment');

var exampleData = require('./exampleData');
var model = require('../lib/model');


describe('model module', function() {
    it('expose a function', function() {
        model.should.be.a('object');
    });
     describe('datePart', function() {

        it('is a function', function() {
            model.datePart.should.be.a('function');
        });
        before(function() {
            this.byYear = model.datePart('year');
        });


        it('is curried', function() {
            this.byYear.should.be.a('function');
        });

        it('return bill date part', function() {
            var result = this.byYear({
                data: moment('2006-11-11')
            });
            
            result.should.be.equal(2006);
        });

    });

    describe('minYear', function() {

        it('is function', function() {
            model.minYear.should.be.a('function');
        });

        it('return minYear', function() {
            model.minYear(exampleData).should.be.equal(2008);
        });
    });

    describe('findTopCustomer', function() {

        it('is function', function() {
            model.findTopCustomer.should.be.a('function');
        });
        
        before(function() {
            this.findTop2Customers = model.findTopCustomer(2);
        });


        it('is curried', function() {
            this.findTop2Customers.should.be.a('function');
        });
        
        it('return topCustomer', function() {
            this.findTop2Customers(exampleData).should.be.deep.equal(
                ['Digital Studio','ZSis di Sergio Russo']
            );
        });
    });
});
