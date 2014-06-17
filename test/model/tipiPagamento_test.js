'use strict';

var chai = require('chai');
chai.expect();
chai.should();

var    tipiPagamento = require('../../lib/model/TipiPagamento');


describe('tipiPagamento', function () {

    it('is defined', function () {
        tipiPagamento.should.be.a('function');
    });

    it('create an instance', function () {
        var expected = {
            description: '',
            giorni: 30,
            fineMese: false ,
            type:'pagamento'
        };
        tipiPagamento().should.be.deep.eq(expected);
    });


});