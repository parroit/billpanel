'use strict';

var model = require('ngoose'),
    cliente = require('./Cliente'),
    tipoPagamento = require('./TipiPagamento'),
    rigaFattura = require('./RigaFattura'),
    articoloIva = require('./ArticoliIva');

module.exports = model({
    date: [Date,function(){return new Date().setHours(0,0,0,0);}],
    articoloIva: articoloIva,
    cliente: cliente,
    anno: [Number,function(){return new Date().getFullYear();}],
    pagata: Boolean,
    formattedCode: String,
    description: String,
    pagamento: tipoPagamento,
    righe: [rigaFattura],
    type: [String,'fattura'],
    applicaRivalsaInps: Boolean,
    applicaRitenutaAcconto: Boolean,
    proForma: Boolean


});

