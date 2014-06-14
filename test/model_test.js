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

    describe('reindexArray', function() {
       before(function() {
            this.reindexArrayByGroup = model.reindexArray(function idxPicker(obj){
                return obj.group -1;
            }, model.emptyGroup);
        });


        it('is curried', function() {
            this.reindexArrayByGroup.should.be.a('function');
        });

        it('reinsert object according to prop and fill holes', function() {

            var result = this.reindexArrayByGroup([{
                group: 1,
                tot: 4550.5,
                count: 4
            }, {
                group: 3,
                tot: 500,
                count: 1
            }]);

            result.should.be.deep.equal([{
                group: 1,
                tot: 4550.5,
                count: 4
            }, {
                group: 2,
                tot: 0,
                count: 0
            },{
                group: 3,
                tot: 500,
                count: 1
            }]);
        });

    });


    describe('groupByQuarter', function() {
       

        it('group bills by quarter', function() {

            var result = model.groupByQuarter(exampleData);

            result.should.be.deep.equal([{
                group: 1,
                tot: 4550.5,
                count: 4
            }, {
                group: 2,
                tot: 500,
                count: 1
            }, {
                group: 3,
                tot: 0,
                count: 0
            }, {
                group: 4,
                tot: 2680,
                count: 2
            }, {
                group: 5,
                tot: 1950,
                count: 1
            }, {
                group: 6,
                tot: 4460.5,
                count: 3
            }, {
                group: 7,
                tot: 3700,
                count: 1
            }]);
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
                ['Digital Studio', 'ZSis di Sergio Russo']
            );
        });
    });
});
