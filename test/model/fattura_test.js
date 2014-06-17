'use strict';

var chai = require('chai');
chai.expect();
chai.should();

var  moment = require('moment'),
  enhanceFattura = require('../../lib/model/enhance-fattura'),
  factory = require('../../lib/model/Fattura');


var datiFt = {
  date: moment('2013-12-25').valueOf(),
  articoloIva: {
    percentuale: 22
  },
  righe: [
    {
      prezzoCadauno: 200,
      quantita: 2
        },
    {
      prezzoCadauno: 100,
      quantita: 3
        }
    ],
  pagamento: {
    fineMese: false,
    giorni: 30
  }

};

var datiFt2 = {
  date: 1240610400000,
  articoloIva: {
    percentuale: 22
  },
  righe: [
    {
      prezzoCadauno: 200,
      quantita: 10
        },
    {
      prezzoCadauno: 100,
      quantita: 3
        }
    ],
  pagamento: {
    fineMese: false,
    giorni: 30
  }

};

describe('fattura', function() {


  describe('factory', function() {

    var ft;

    before(function() {
      ft = factory();
    });

    it('is defined', function() {
      factory.should.be.a('function');
    });

    it('return well formed bill', function() {
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      var expected = {
        date: today.getTime(),
        articoloIva: {
          clausolaStampa: '',
          percentuale: 20,
          description: '',
          type: 'articoloIva'
        },
        cliente: {
          secondaDescrizione: '',
          partitaIva: '',
          codiceFiscale: '',
          fornitore: false,
          cliente: true,
          indirizzo: '',
          cap: '',
          comune: '',
          provincia: '',
          description: '',
          type: 'cliente'
        },
        anno: today.getFullYear(),
        pagata: false,
        formattedCode: '',
        description: '',
        pagamento: {
          description: '',
          giorni: 30,
          fineMese: false,
          type: 'pagamento'
        },
        righe: [],
        type: 'fattura',
        applicaRivalsaInps: false,
        applicaRitenutaAcconto: false,
        proForma: false
      };

       ft.should.be.deep.eq(expected);
    });

    it('returned bill has type', function() {
      ft.type.should.be.equal('fattura');

    });
  });

  describe('enhanceFattura', function() {
    var ft;
    var ft2;
    before(function() {
      console.dir(datiFt);
      ft = enhanceFattura(datiFt);
      ft2 = enhanceFattura(datiFt2);
    });


    it('is defined', function() {
      enhanceFattura.should.be.an('function');
    });


    describe('rivalsaInps', function() {
      var ft;
      before(function() {
        ft = enhanceFattura(factory(datiFt));

      });

      it('applicaRivalsaInps default false', function() {
        ft.applicaRivalsaInps.should.be.equal(false);
      });


      it('is 0 when applicaRivalsaInps false', function() {
        ft.rivalsaInps.should.be.equal(0);
      });

      it('is 4% of imponibileBase when applicaRivalsaInps true', function() {
        ft.applicaRivalsaInps = true;
        ft.rivalsaInps.should.be.equal(700 * 0.04);
      });

      it('imponibile contains rivalsa when applicaRivalsaInps true', function() {
        ft.applicaRivalsaInps = true;
        ft.imponibile.should.be.equal(700 * 1.04);
      });

    });

    describe('ritenutaAcconto', function() {
      var ft;
      before(function() {
        ft = enhanceFattura(factory(datiFt));

      });

      it('applicaRitenutaAcconto default false', function() {
        ft.applicaRitenutaAcconto.should.be.equal(false);
      });


      it('is 0 when applicaRitenutaAcconto false', function() {
        ft.ritenutaAcconto.should.be.equal(0);
      });

      it('is 20% of imponibile when applicaRitenutaAcconto true', function() {
        ft.applicaRitenutaAcconto = true;
        ft.ritenutaAcconto.should.be.equal(700 * 0.2);
      });

      it('totale subtracts ritenutaAcconto when applicaRitenutaAcconto true', function() {
        ft.applicaRitenutaAcconto = true;
        ft.totale.should.be.equal(714);
      });

    });


    describe('imponibile', function() {
      it('add property', function() {
        ft.imponibile.should.be.equal(700);
      });

      it('change with quantita riga', function() {
        datiFt.righe[0].quantita = 4;
        ft.imponibile.should.be.equal(1100);
        datiFt.righe[0].quantita = 2;
      });

      it('work for multiple rows', function() {
        ft2.imponibile.should.be.equal(2300);
      });
    });

    describe('totale', function() {
      it('add property', function() {
        ft.totale.should.be.equal(854);
      });

      it('change with quantita riga', function() {
        datiFt.righe[0].quantita = 4;
        ft.totale.should.be.equal(1342);
        datiFt.righe[0].quantita = 2;
      });

      it('work for multiple rows', function() {
        ft2.totale.should.be.equal(2806);
      });
    });

    describe('iva', function() {
      it('add property', function() {
        ft.iva.should.be.equal(154);
      });

      it('change with quantita riga', function() {
        datiFt.righe[0].quantita = 4;
        ft.iva.should.be.equal(242);
        datiFt.righe[0].quantita = 2;
      });

      it('work for multiple rows', function() {
        ft2.iva.should.be.equal(506);
      });
    });

    describe('scadenza', function() {
      it('add property', function() {
        moment(ft.scadenza).format('YYYY-MM-DD').should.be.equal('2014-01-24');
      });

      it('change with numero giorni', function() {
        datiFt.pagamento.giorni = 31;
        moment(ft.scadenza).format('YYYY-MM-DD').should.be.equal('2014-01-25');
        datiFt.pagamento.giorni = 30;
      });


      it('change with date', function() {
        datiFt.date = moment('2013-12-24').valueOf();
        moment(ft.scadenza).format('YYYY-MM-DD').should.be.equal('2014-01-23');
        datiFt.date = moment('2013-12-25').valueOf();
      });

      it('change with fineMese', function() {
        datiFt.pagamento.fineMese = true;
        moment(ft.scadenza).format('YYYY-MM-DD').should.be.equal('2014-01-30');
        datiFt.pagamento.fineMese = false;
      });


    });


  });
});
