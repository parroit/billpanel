'use strict';
var groupBills = require('./groupBills');
var R = require('ramda');

var  groupBillsByCustomer =  groupBills.groupReduceSort(
    R.prop('customer'), 
    R.prop('tot')
);

var  groupBillsByCustomerDescending = R.pipe(
    groupBillsByCustomer,
    R.reverse
 );

var groupBillsByCustomerGetRows = R.pipe(
    groupBillsByCustomerDescending, 
    groupBills.mapToGroupRow
 );


module.exports = function (bills) {
    return groupBillsByCustomerGetRows(bills);
};


module.exports.descending = groupBillsByCustomerDescending;