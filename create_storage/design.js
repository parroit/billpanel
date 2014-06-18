'use strict';

module.exports = {
    _id: '_design/billy',
    language: 'javascript',
    views: {
        articoliIva: {
            map: function (doc) {
                if (doc.type === 'articoloIva') {
                    emit(doc.codice, doc);
                }
            }
        },

        clienti: {
            map: function (doc) {
                if (doc.type === 'cliente') {
                    emit(doc.codiceFiscale, {
                        _rev: doc._rev,
                        partitaIva: doc.partitaIva,
                        codiceFiscale: doc.codiceFiscale,
                        fornitore: doc.fornitore,
                        cliente: doc.cliente,
                        description: doc.description
                    });

                }
            }
        },
        clienteByCF: {
            map: function (doc) {
                if (doc.type === 'cliente') {
                    emit(doc.codiceFiscale, doc);

                }
            }

        },
        fattureByYear: {
            map: function (doc) {
                if (doc.type && doc.type === 'fattura') {
                    emit(doc.anno, {
                        anno: doc.anno,
                        data: doc.date,
                        codice: doc.formattedCode,
                        cliente: doc.cliente && (doc.cliente.descrizione || doc.cliente.description),
                        descrizione: doc.description,
                        _rev: doc._rev

                    });

                }
            }

        },
        fattureByCode: {
            map: function (doc) {
                if (doc.type && doc.type === 'fattura') {
                    emit(doc.formattedCode, doc);

                }
            }

        },
        pagamenti: {
            map: function (doc) {
                if (doc.type === 'pagamento') {
                    emit(doc.description, doc);

                }
            }

        }
    }

};