'use strict';

function defineModule(moment, enhanceRiga) {
    function define(obj, propertyName, getFunction) {
        delete obj[propertyName];
        Object.defineProperty(obj, propertyName, {
            get: getFunction,
            enumerable: true,
            configurable: true
        });
    }

    function enhanceFattura(dati) {
        dati.righe.forEach(function(riga) {

            enhanceRiga(riga);
        });

        function curr(v) {

            v = Math.round(v * 100) / 100;

            return v;
        }

        define(dati, 'someHasQty', function() {

            return this.righe.some(function(r) {
                return r.hasQty;
            });
        });

        define(dati, 'rivalsaInps', function() {
            return curr(this.applicaRivalsaInps ? this.imponibileBase * 4 / 100 : 0);
        });

        define(dati, 'ritenutaAcconto', function() {
            return curr(this.applicaRitenutaAcconto ? this.imponibile * 20 / 100 : 0);
        });

        define(dati, 'scadenza', function() {
            var dataFt = moment(Number(this.date));
            if (this.pagamento.fineMese) {
                dataFt.endOf('month');
            }

            return dataFt.add('days', this.pagamento.giorni).valueOf();


        });

        define(dati, 'imponibileBase', function() {
            return this.righe.map(function(r) {
                return r.total;
            })
                .reduce(function(sum, num) {

                    return sum + num;
                });

        });

        define(dati, 'imponibile', function() {
            return this.imponibileBase + this.rivalsaInps;

        });

        define(dati, 'iva', function() {
            return curr(this.imponibile * this.articoloIva.percentuale / 100);

        });

        define(dati, 'totaleFattura', function() {
            return curr(this.imponibile + this.iva);

        });


        define(dati, 'totale', function() {
            return curr(this.totaleFattura - this.ritenutaAcconto);

        });

        return dati;
    }

    enhanceFattura.riga = enhanceRiga;

    return enhanceFattura;
}


if (typeof module !== 'undefined' && module.exports) {

    module.exports = defineModule(
        require('moment'),
        require('./enhance-rigafattura')
    );
} else {

    define(['moment', '/model/enhance-rigafattura.js'], defineModule);

}
