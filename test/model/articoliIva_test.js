'use strict';

var chai = require('chai');
chai.expect();
chai.should();

var articoliIva = require('../../lib/model/ArticoliIva');



describe('articoliIva', function () {

    it('is defined', function () {
        articoliIva.should.be.a('function');
    });

    it('create an instance', function () {
        var expected = {
            clausolaStampa: '',
            percentuale: 20,
            description: '',
            type: 'articoloIva'
        };
        articoliIva().should.be.deep.eq(expected);
    });


});