var model = require('ngoose');

module.exports = model({
	secondaDescrizione: String,
	partitaIva: String,
	codiceFiscale: String,
	fornitore: Boolean,
	cliente: [Boolean,true],
	indirizzo: String,
	cap: String,
	comune: String,
	provincia: String,
	description:  String,
    type: [String,'cliente']

});

