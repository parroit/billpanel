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

var moment = require('moment');
var model = require('../lib/model');
var exampleData = require('./exampleData');
var groupByYear = model.groupReduceSort(function(b) {

    return b.data.year();
}, null);


describe('model module', function() {
    it('expose a function', function() {
        model.should.be.a('object');
    });

    describe('groupReduceSort', function() {
        it('group bills by given function', function() {

            var result = groupByYear(exampleData);

            result.should.be.deep.equal([{
                group: 2008,
                tot: 7730.5,
                count: 7
            }, {
                group: 2009,
                tot: 10110.5,
                count: 5
            }]);
        });

    });


    describe('byQuarter', function() {

        it('is a function', function() {
            model.byQuarter.should.be.a('function');
        });

        before(function() {
            this.byQuarter2008 = model.byQuarter(2008);
        });


        it('is curried', function() {
            this.byQuarter2008.should.be.a('function');
        });

        it('return quarter by 1 of firstYear', function() {
            var result = this.byQuarter2008(exampleData[8] );  ///date: 25/4/2009

            result.should.be.equal(6);
        });

    });

    describe('byCustomerQuarter', function() {

        it('is a function', function() {
            model.byCustomerQuarter.should.be.a('function');
        });

        before(function() {
            this.byCustomerQuarter = model.byCustomerQuarter(2008);
        });


        it('is curried', function() {
            this.byQuarter2008.should.be.a('function');
        });

        it('return quarter by 1 of firstYear', function() {
            var result = this.byCustomerQuarter(exampleData[8] );  //date: 25/4/2009,customer: 'Digital Studio'
            result.should.be.equal('Digital Studio|6');
        });

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
            this.reindexArrayByGroup = model.reindexArray(function idxPicker(obj) {
                return obj.group - 1;
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
            }, {
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
