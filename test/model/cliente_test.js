'use strict';

var chai = require('chai');
chai.expect();
chai.should();

var cliente = require('../../lib/model/Cliente');



describe('cliente', function () {

    it('is defined', function () {
        cliente.should.be.a('function');
    });

    it('create an instance', function () {
       var expected = {
            secondaDescrizione: '',
            partitaIva: '',
            codiceFiscale: '',
            fornitore: false,
            cliente: true,
            indirizzo: '',
            cap: '',
            comune: '',
            provincia: '',
            description:  '',
            type: 'cliente'
        };
        cliente().should.be.deep.eq(expected);
    });


});