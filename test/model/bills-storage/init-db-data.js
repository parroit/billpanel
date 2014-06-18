'use strict';
var couch = require('couch-promise');
var Q = require('q');

var doneHandler = null;
var ready = false;

var ft = {
    'type': 'fattura',
    'date': 1203721200000,
    'cliente': {
        'secondaDescrizione': '',
        'partitaIva': '01513860997',
        'codiceFiscale': '',
        'fornitore': false,
        'cliente': true,
        'indirizzo': 'Via bologna 74',
        'cap': '16123',
        'comune': 'Genova',
        'provincia': 'GE',
        'description': 'ZSis di Sergio Russo'
    },
    'articoloIva': {
        'clausolaStampa': '',
        'percentuale': 0,
        'codice': '010/6',
        'description': 'Art.10 c.6 DPR 633'
    },
    'anno': new Date().getFullYear(),
    'pagata': false,
    'formattedCode': '0001/2008',
    'description': '  programma per la gestione dei dati per i soci Elpis',

    'pagamento': 'Bdf30',

    'righe': [
        {
            'description': 'Realizzazione di un programma per la gestione dei dati per i soci di un\'associazione  sportiva',
            'prezzoCadauno': 647.0,
            'quantita': 1.0,
            'numeroRiga': 1

        }
    ]
};

var articoloIva =  {
    'type': 'articoloIva',

    'clausolaStampa': '',
    'percentuale': 0,
    'codice': '010/6',
    'description': 'Art.10 c.6 DPR 633'
};


var pagamento = {
    'description': 'Bonifico 30 gg. f.m.',
    'fineMese': true,
    'giorni': 30,
    'type': 'pagamento'
};

var cliente =  {
    'type': 'cliente',

    'secondaDescrizione': '',
    'partitaIva': '01513860997',
    'codiceFiscale': '01513860997',
    'fornitore': false,
    'cliente': true,
    'indirizzo': 'Via bologna 74',
    'cap': '16123',
    'comune': 'Genova',
    'provincia': 'GE',
    'description': 'ZSis di Sergio Russo'
};

couch.init({
    db: 'http://localhost:5984/billy-test'
});

//console.log('DENTRO');
var ftPromise  = couch.get('billy','fattureByYear',ft.anno).then(function(res){
  //  console.dir(res)
    if (res.length < 1) {
        return couch.update(ft);
    }
    //console.log(1)
    return true;
}).then(null,function(err){

        if (err.statusCode === 404) {
            return couch.update(ft);
        }

        return false;
    });

var clientePromise  = couch.get('billy','clienti').then(function(res){
    //console.dir(res)
    if (res.length < 1) {
        return couch.update(cliente);
    }

    return true;
}).then(null,function(err){
        console.dir(err);
        if (err.statusCode === 404) {
            return couch.update(cliente);
        }

        return false;
    });

var artIvaPromise  = couch.get('billy','articoliIva').then(function(res){
    //console.dir(res)
    if (res.length < 1) {
        return couch.update(articoloIva);
    }

    return true;
}).then(null,function(err){

        if (err.statusCode === 404) {
            return couch.update(articoloIva);
        }

        return false;
    });

var pagamentoPromise  = couch.get('billy','pagamenti').then(function(res){
    //console.dir(res)
    if (res.length < 1) {
        return couch.update(pagamento);
    }

    return true;
}).then(null,function(err){

        if (err.statusCode === 404) {
            return couch.update(pagamento);
        }

        return false;
    });

Q.all([ftPromise,clientePromise,artIvaPromise,pagamentoPromise]).then(function(){
    //console.log('DONE');
    if(doneHandler){
        doneHandler();
        doneHandler = null;
    }

    ready=true;
});

module.exports = function (done){
    if(ready) {
        done();
        
    } else {
        doneHandler = done;
    }
};