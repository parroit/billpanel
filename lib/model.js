'use strict';

var R = require('ramda');
var groupBills = require('./groupBills');

var groupByCustomer = exports.groupByCustomer =  groupBills.groupReduceSort(
    R.prop('customer'), 
    R.prop('tot')
);

var groupByCustomerDescending = exports.groupByCustomerDescending = R.pipe(
    groupByCustomer,
    R.reverse
 );

var datePart = exports.datePart = function(partName) {
    return R.pipe(
        R.prop('data'),
        R.func(partName)
    );

};

exports.findTopCustomer = function (num) {
    return R.pipe(
        groupByCustomerDescending,
        R.take(num),
        R.map(R.prop('group'))
    );
};

exports.minYear = R.pipe(
    R.map(datePart('year')),
    R.min
);
