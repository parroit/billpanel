'use strict';

var chai = require('chai');
chai.expect();
chai.should();

 var   enhanceRiga = require('../../lib/model/enhance-rigafattura.js'),
    rigaFattura = require('../../lib/model/RigaFattura'),

    datiRiga = {
        prezzoCadauno: 500,
        quantita: 2
    },

    datiRiga2 = {
        prezzoCadauno: 200,
        quantita: 2
    };

describe('rigaFattura', function () {

    it('is defined', function () {
        rigaFattura.should.be.a('function');
    });

    it('create an instance', function () {
        var expected = {
            description: '',
            prezzoCadauno: 0,
            quantita: 1,
            numeroRiga: 0
        };
        rigaFattura().should.be.deep.eq(expected);
    });

    describe('enhanceRiga', function () {
        var riga;
        var riga2;
        before(function () {
            riga = enhanceRiga(datiRiga);
            riga2 = enhanceRiga(datiRiga2);
        });


        it('is defined', function () {
            enhanceRiga.should.be.a('function');
        });

        it('add calculated total', function () {
            datiRiga.total.should.be.equal(1000);
        });

        it('change with quantita', function () {
            datiRiga.quantita = 4;
            datiRiga.total.should.be.equal(2000);
            datiRiga.quantita = 2;
        });

        it('work for multiple rows', function () {
            datiRiga2.total.should.be.equal(400);
        });
    });
});