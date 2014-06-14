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

var groupRows = require('../lib/groupRows');


describe('groupRows module', function() {
    it('expose a function', function() {
        groupRows.should.be.a('object');
    });
   

    describe('mapTogroupRows', function() {

        it('is a function', function() {
            groupRows.mapToGroupRow.should.be.a('function');
        });

        it('return groupRows', function() {
            var result = groupRows.mapToGroupRow([1, 2, 3]);
            
            result.should.be.a('array');
            result[0].props.should.be.deep.equal({'group':1});
        });

    });

});
