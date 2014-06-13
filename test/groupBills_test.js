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

var groupBills = require('../lib/groupBills').groupReduceSort;
var exampleData = [{
    g: 1,
    totale: 10,
}, {
    g: 1,
    totale: 20,
}, {
    g: 2,
    totale: 35,
}];

var groupByG = groupBills(function(b) {
    return b.g;
}, null);


describe('groupBills module', function() {
    it('expose a function', function() {
        groupBills.should.be.a('function');
    });

    it('group bills by given function', function() {


        var result = groupByG(exampleData);

        result.should.be.deep.equal([{
            group: '1',
            tot: 30,
            count: 2
        }, {
            group: '2',
            tot: 35,
            count: 1
        }]);
    });

});
