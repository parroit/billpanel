'use strict';

var 
    accounting = require('accounting'),
    enhanceFattura = require('../isomorphic/model/enhance-fattura'),
    fattura = require('../model/Fattura'),
    baseRoutes = require('../base-routes'),
    Q = require('q'),
    moment = require('moment'),
    billsStorage = require('../bills-storage');

function catchErr(res) {
    return function(err) {
        res.emit('error', err);
    };

}

function listBills(req, res) {
    var year = req.query.year;

    function renderBills(bills) {
        var render = baseRoutes.template('bills/list', null, {
            bills: bills
        });

        render(req, res);
    }

    function enhanceBills(bills) {

        return Q.fcall(function() {
             return bills.map(function(ft) {
                ft.editUrl = '/bills/' + encodeURIComponent(ft.codice);
                ft.copyUrl = '/bills/copy/' + encodeURIComponent(ft.codice);
                ft.data = moment(Number(ft.data)).format('DD/MM/YY');
                return ft; //enhanceFattura(ft);
            });
        });
    }


    billsStorage
        .fatture.byYear(year)
        .then(enhanceBills)
        .then(renderBills)
        .then(null, catchErr(res));

}

function bill(req, res) {
    function renderJSON(bill) {
        bill.applicaRivalsaInps = bill.applicaRivalsaInps || false;
        bill.applicaRitenutaAcconto = bill.applicaRitenutaAcconto || false;
        bill.proForma = bill.proForma || false;

        res.json(bill);
    }

    var code = req.param('code');

    if (code !== 'new') {
        billsStorage
            .fatture.byCode(code)
            .then(null, catchErr(res))
            .then(renderJSON);
    } else {
        renderJSON(fattura());
    }

}


function saveBill(req, res) {
    var bill = req.body;

    //bill.applicaRivalsaInps = bill.applicaRivalsaInps && true || false;
    //bill.applicaRitenutaAcconto = bill.applicaRitenutaAcconto && true || false;

    bill.anno = moment(bill.date).year();


    function renderJSON(rev) {

        res.json(rev.data);
    }

    function failure(err) {
        res.emit('error', err);
        res.json({
            ok: false,
            reason: err.message
        });
    }

    //console.dir(bill)
    //return renderJSON();

    billsStorage
        .fatture.save(bill)
        .then(renderJSON)
        .then(null, failure);
}

function enhanceLookups(model) {

    var ft = enhanceFattura(model.bill);

    ft.applicaRivalsaInps = ft.applicaRivalsaInps || false;
    ft.applicaRitenutaAcconto = ft.applicaRitenutaAcconto || false;


    return Q.fcall(function() {
        model.clienti.forEach(function(c) {
            c.value = JSON.stringify(c);
            c.isCurrent = c.description === ft.cliente.description;
        });

        model.pagamenti.forEach(function(p) {
            p.value = JSON.stringify(p);
            p.isCurrent = p.description === ft.pagamento.description;
        });

        model.articoliIva.forEach(function(a) {
            a.value = JSON.stringify(a);
            a.isCurrent = a.description === ft.articoloIva.description;
        });

        ft.printUrl = '/bills/pdf-print/' + encodeURIComponent(ft.formattedCode);
        ft.printUrlNewFormat = '/bills/pdf-print-new-format/' + encodeURIComponent(ft.formattedCode);
        ft.printUrlProforma = '/bills/pdf-print-proforma/' + encodeURIComponent(ft.formattedCode);
        ft.printUrlPreventivo = '/bills/pdf-print-preventivo/' + encodeURIComponent(ft.formattedCode);
        ft.dateFt = moment(Number(ft.date)).format('YYYY-MM-DD');

        ft.scadenzaFt = moment(ft.scadenza).format('YYYY-MM-DD');

        return model;

    });
}

function buildModel(clienti, articoliIva, pagamenti, bill) {

    return new Q.fcall(function() {
        return {
            clienti: clienti,
            bill: bill,
            articoliIva: articoliIva,
            pagamenti: pagamenti
        };
    });
}

function createCopy(bill) {
    bill.date = new Date().setHours(0, 0, 0, 0);
    bill.formattedCode = '';
    bill.anno = new Date().getFullYear();
    delete bill._rev;
    delete bill._id;

    return Q.fcall(function(){return bill;});
}

function loadLookups(bill) {
    return Q.all([
        billsStorage.clienti.all(),
        billsStorage.articoliIva.all(),
        billsStorage.pagamenti.all()
    ])

    .then(function(res) {

        res.push(bill);
        return buildModel.apply(this, res);
    });
}

function renderBill(req, res) {
    return function(model) {

        var render = baseRoutes.template('bills/edit', null, model);

        render(req, res);
    };
}


function buildPrintModel(bill) {

    return Q.fncall(function() {
        return {
            clienti: [],
            bill: bill,
            articoliIva: [],
            pagamenti: []
        };
    });
}

function renderPrintBill(template, req, res) {
    return function(model) {
        model.layout = '';

        var ft = model.bill,
            render;

        ft.showTotaleRighe = ft.righe.length > 1;
        ft.scadenzaFt = moment(Number(ft.scadenza)).format('DD/MM/YYYY');
        ft.dateFt = moment(Number(ft.date)).format('DD/MM/YYYY');
        ft.totaleFt = accounting.formatMoney(ft.totale, '€ ', 2, '.', ',');
        ft.ivaFt = accounting.formatMoney(ft.iva, '€ ', 2, '.', ',');
        ft.imponibileFt = accounting.formatMoney(ft.imponibile, '€ ', 2, '.', ',');
        ft.imponibileBaseFt = accounting.formatMoney(ft.imponibileBase, '€ ', 2, '.', ',');
        ft.rivalsaInpsFt = accounting.formatMoney(ft.rivalsaInps, '€ ', 2, '.', ',');
        ft.ritenutaAccontoFt = accounting.formatMoney(ft.ritenutaAcconto, '€ ', 2, '.', ',');

        ft.totaleFt = accounting.formatMoney(ft.totale, '€ ', 2, '.', ',');
        ft.totaleFatturaFt = accounting.formatMoney(ft.totaleFattura, '€ ', 2, '.', ',');

        ft.pagamentoDescr = ft.pagamento.description;

        ft.righe.forEach(function(riga) {
            riga.prezzoCadaunoFt = accounting.formatMoney(riga.prezzoCadauno, '€ ', 2, '.', ',');
            riga.quantitaFt = accounting.formatMoney(riga.quantita, '€ ', 2, '.', ',');
            riga.totalFt = accounting.formatMoney(riga.total, '€ ', 2, '.', ',');
        });

        render = baseRoutes.template(template, null, model);

        render(req, res);
    };
}

function printGenericBill(req, res, template) {

    var code = req.param('code');
    //console.log(code)
    billsStorage
        .fatture.byCode(code)
        .then(buildPrintModel)
        .then(enhanceLookups)
        .then(renderPrintBill(template, req, res))
        .then(null, catchErr(res));

}


function pdfPrintBill(req, res) {
    var code = encodeURIComponent(req.param('code'));

    baseRoutes.pdf('/bills/print/' + code, req, res);

}


function pdfPrintBillProforma(req, res) {
    var code = encodeURIComponent(req.param('code'));

    baseRoutes.pdf('/bills/print-proforma/' + code, req, res);

}


function pdfPrintBillPreventivo(req, res) {
    var code = encodeURIComponent(req.param('code'));

    baseRoutes.pdf('/bills/print-preventivo/' + code, req, res);

}


function pdfPrintBillNewFormat(req, res) {
    var code = encodeURIComponent(req.param('code'));

    baseRoutes.pdf('/bills/print-new-format/' + code, req, res);

}



function printBill(req, res) {
    printGenericBill(req, res, 'bills/print');

}


function printBillNewFormat(req, res) {
    printGenericBill(req, res, 'bills/print-new-format');

}


function printBillProforma(req, res) {
    printGenericBill(req, res, 'bills/print-proforma');

}


function printBillPreventivo(req, res) {
    printGenericBill(req, res, 'bills/print-preventivo');

}




function newBill(req, res) {
    var bill = fattura();

    loadLookups(bill)
        .then(enhanceLookups)
        .then(renderBill(req, res))
        .then(null, catchErr(res));


}



function editBill(req, res) {
    var code = req.param('code');

    billsStorage
        .fatture.byCode(code)
        .then(loadLookups)
        .then(enhanceLookups)
        .then(renderBill(req, res))
        .then(null, catchErr(res));

}


function copyBillData(req, res) {
    
    var code = req.param('code');

    billsStorage
        .fatture.byCode(code)
        .then(createCopy)
        .then(null, catchErr(res))
        .then(function (bill) {
           
            res.json(bill);
        });

}


function copyBill(req, res) {
    var code = req.param('code');

    billsStorage
        .fatture.byCode(code)
        .then(createCopy)
        .then(loadLookups)
        .then(enhanceLookups)
        .then(renderBill(req, res))
        .then(null, catchErr(res));

}

function cliente(req, res) {
    var codiceFiscale = req.param('codicefiscale');
    //console.log(codiceFiscale)
    billsStorage
        .clienti.byCode(codiceFiscale)
        .then(function(cliente) {
            res.json(cliente);
        })
        .then(null, catchErr(res));
}



module.exports = {
    listBills: listBills,
    editBill: editBill,
    copyBill: copyBill,
    copyBillData: copyBillData,
    bill: bill,
    saveBill: saveBill,
    newBill: newBill,
    printBill: printBill,
    printBillNewFormat: printBillNewFormat,
    pdfPrintBill: pdfPrintBill,
    pdfPrintBillNewFormat: pdfPrintBillNewFormat,
    cliente: cliente,
    printBillProforma: printBillProforma,
    pdfPrintBillProforma: pdfPrintBillProforma,
    printBillPreventivo: printBillPreventivo,
    pdfPrintBillPreventivo: pdfPrintBillPreventivo
};
