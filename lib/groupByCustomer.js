'use strict';
var model = require('./model');
var groupBills = require('./groupBills');
var R = require('ramda');


exports.descendingRows = R.pipe(
    model.groupByCustomerDescending, 
    groupBills.mapToGroupRow
);

exports.descending = model.groupByCustomerDescending;