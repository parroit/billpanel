'use strict';


var couch= require('couch-promise');


module.exports = {
    init: function (options) {
        this.options = options;
        console.dir(options.couch);
        couch.init(options.couch);




    },
    login: function(user,password){
        console.dir(user+':'+password);
        return couch.login(user,password);
    },

    fatture: {
        byYear: function (year) {
            return couch.get('billy', 'fattureByYear', year);

        },
        byCode: function (code) {
            var one = couch.getOne('billy', 'fattureByCode', '"' + code + '"');
            delete one.totale;
            return  one;

        },
        delete: function (code) {
            return couch.delete('billy','"' + code + '"','fattureByCode');

        },
        save: function(bill) {
            return couch.update(bill);
        }
    },

    clienti: {
        all: function () {
            return couch.get('billy', 'clienti');

        },

        byCode: function (codiceFiscale) {
            return couch.getOne('billy', 'clienteByCF', '"' + codiceFiscale + '"');

        },

        delete: function (codiceFiscale) {
            return couch.delete('billy','"' + codiceFiscale + '"','clienteByCF');

        },

        save: function(customer) {
            return couch.update(customer);
        }
    },
    articoliIva: {
        all: function () {
            return couch.get('billy', 'articoliIva');

        }
    },
    
    pagamenti: {
        all: function () {
            return couch.get('billy', 'pagamenti');

        }
    }
};