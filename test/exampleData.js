'use strict';

var moment = require('moment');

function createDate(bill) {
    bill.data = moment(bill.data, 'DD/MM/YYYY');
    return bill;
}

module.exports = [{
    'code': '0001/2008',
    'customer': 'ZSis di Sergio Russo',
    'totale': 647,
    'totaleIvato': 647,
    'iva': 0,
    'data': '23/2/2008',
    'articoloIva': '0',
    'pagamentoGG': '30',
    'pagamentoFM': 'false'
}, {
    'code': '0020/2008',
    'customer': 'Digital Studio',
    'totale': 1570,
    'totaleIvato': 1570,
    'iva': 0,
    'data': '19/1/2008',
    'articoloIva': 0,
    'pagamentoGG': 30,
    'pagamentoFM': false
}, {
    'code': '0021/2008',
    'customer': 'ZSis di Sergio Russo',
    'totale': 1983.5,
    'totaleIvato': 1983.5,
    'iva': 0,
    'data': '19/1/2008',
    'articoloIva': 0,
    'pagamentoGG': 30,
    'pagamentoFM': false
}, {
    'code': '0022/2008',
    'customer': 'Genova Print di Diego Parodi',
    'totale': 350,
    'totaleIvato': 350,
    'iva': 0,
    'data': '19/1/2008',
    'articoloIva': 0,
    'pagamentoGG': 30,
    'pagamentoFM': false
}, {
    'code': '0002/2008',
    'customer': 'Digital Studio',
    'totale': 500,
    'totaleIvato': 5000,
    'iva': 0,
    'data': '2/4/2008',
    'articoloIva': '0',
    'pagamentoGG': '30',
    'pagamentoFM': 'false',
    'applicaRitenutaAcconto': false,
    'applicaRivalsaInps': true
}, {
    'code': '0018/2008',
    'customer': 'Kuehne+Nagel Italy S.r.l.',
    'totale': 2520,
    'totaleIvato': 2520,
    'iva': 0,
    'data': '21/12/2008',
    'articoloIva': 0,
    'pagamentoGG': 30,
    'pagamentoFM': false
}, {
    'code': '0019/2008',
    'customer': 'Andrea Sorice',
    'totale': 160,
    'totaleIvato': 160,
    'iva': 0,
    'data': '30/12/2008',
    'articoloIva': 0,
    'pagamentoGG': 30,
    'pagamentoFM': false
}, {
    'code': '0013/2009',
    'customer': 'Digital Studio',
    'totale': 1950,
    'totaleIvato': 1950,
    'iva': 0,
    'data': '1/1/2009',
    'articoloIva': 0,
    'pagamentoGG': 90,
    'pagamentoFM': false
}, {
    'code': '0001/2009',
    'customer': 'Digital Studio',
    'totale': 675,
    'totaleIvato': 675,
    'iva': 0,
    'data': '25/4/2009',
    'articoloIva': 0,
    'pagamentoGG': 30,
    'pagamentoFM': false
}, {
    'code': '0002/2009',
    'customer': 'ZSis di Sergio Russo',
    'totale': 2074.5,
    'totaleIvato': 2074.5,
    'iva': 0,
    'data': '25/4/2009',
    'articoloIva': 0,
    'pagamentoGG': 60,
    'pagamentoFM': false
}, {
    'code': '0003/2009',
    'customer': 'Mestel RSS Srl',
    'totale': 1711,
    'totaleIvato': 1711,
    'iva': 0,
    'data': '25/4/2009',
    'articoloIva': 0,
    'pagamentoGG': 30,
    'pagamentoFM': false
}, {
    'code': '0004/2009',
    'customer': 'Digital Studio',
    'totale': 3700,
    'totaleIvato': 3700,
    'iva': 0,
    'data': '30/7/2009',
    'articoloIva': 0,
    'pagamentoGG': 30,
    'pagamentoFM': false
}].map(createDate);
