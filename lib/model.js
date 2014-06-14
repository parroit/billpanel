'use strict';

var R = require('ramda');
var groupBills = require('./groupBills');
//var moment = require('moment');

var groupByCustomer = exports.groupByCustomer = groupBills.groupReduceSort(
    R.prop('customer'),
    R.prop('tot')
);

var datePart = exports.datePart = function(partName) {
    return R.pipe(
        R.prop('data'),
        R.func(partName)
    );

};

var minYear = exports.minYear = R.pipe(
    R.map(datePart('year')),
    R.min
);

var maxQuarter = exports.maxQuarter = function(minYear) {
    return R.pipe(
        R.map(groupBills.byQuarter(minYear)),
        R.max
    );
};

var emptyGroup = exports.emptyGroup = function(idx) {
    return {
        group: idx + 1,
        tot: 0,
        count: 0
    };
};



var reindexArray = exports.reindexArray = R.curry(function(idxPicker, emptyBuilder, arr) {
    var values = R.values(arr);
    var actualIndexes = values.map(idxPicker);
    var newIndexes = R.range(0, R.max(actualIndexes) + 1);

    function findOrEmpty(idx) {
        var value = R.find(function(arr) {
            return idxPicker(arr) === idx;
        }, values);

        return value || emptyBuilder(idx);
    }

    return R.map(findOrEmpty, newIndexes);

});

exports.groupByQuarter = function(bills) {
    var year = minYear(bills);
    var quarter = maxQuarter(year)(bills);
    return exports.groupByQuarterPeriod(year, quarter, bills);
};

exports.groupByQuarterPeriod = R.curry(function(year, maxQuarter, bills) {
    var groups = groupBills.groupReduceSort(groupBills.byQuarter(year), null)(bills);
    if (!groups[maxQuarter - 1]) {
        groups[maxQuarter - 1] = emptyGroup(maxQuarter - 1);
    }
    var reindexFn = reindexArray(function(obj) {
        return obj.group - 1;
    }, emptyGroup);

    return reindexFn(groups);
});


var groupByCustomerDescending = exports.groupByCustomerDescending = R.pipe(
    groupByCustomer,
    R.reverse
);


exports.findTopCustomer = function(num) {
    return R.pipe(
        groupByCustomerDescending,
        R.take(num),
        R.map(R.prop('group'))
    );
};
