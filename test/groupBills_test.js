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

var groupBills = require('../lib/groupBills');
var exampleData = require('./exampleData');
var groupByYear = groupBills.groupReduceSort(function(b) {

    return b.data.year();
}, null);


describe('groupBills module', function() {
    it('expose a function', function() {
        groupBills.should.be.a('object');
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
            groupBills.byQuarter.should.be.a('function');
        });

        before(function() {
            this.byQuarter2008 = groupBills.byQuarter(2008);
        });


        it('is curried', function() {
            this.byQuarter2008.should.be.a('function');
        });

        it('return quarter by 1 of firstYear', function() {
            var result = this.byQuarter2008(exampleData[8] /*date: 25/4/2009*/ );

            result.should.be.equal(6);
        });

    });

    describe('byCustomerQuarter', function() {

        it('is a function', function() {
            groupBills.byCustomerQuarter.should.be.a('function');
        });

        before(function() {
            this.byCustomerQuarter = groupBills.byCustomerQuarter(2008);
        });


        it('is curried', function() {
            this.byQuarter2008.should.be.a('function');
        });

        it('return quarter by 1 of firstYear', function() {
            var result = this.byCustomerQuarter(exampleData[8] /*date: 25/4/2009,customer: 'Digital Studio'*/ );
            result.should.be.equal('Digital Studio|6');
        });

    });

    describe('mapToGroupRow', function() {

        it('is a function', function() {
            groupBills.mapToGroupRow.should.be.a('function');
        });


        it('return GroupRow', function() {
            var result = groupBills.mapToGroupRow([1, 2, 3]);
            
            result.should.be.a('array');
            result[0].props.should.be.deep.equal({'group':1});
        });

    });
     
    

    
});
