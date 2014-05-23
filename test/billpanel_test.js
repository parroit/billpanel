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

var billpanel = require('../lib/billpanel.js');


describe('billpanel module', function(){
  describe('#awesome()', function(){
    it('should return a hello', function(){
      billpanel.awesome('livia').should.equal('hello livia');
    });
  });
});
