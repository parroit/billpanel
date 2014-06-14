'use strict';

var R = require('ramda');
var moment = require('moment');
var colors = require('./colors');
var byQuarter = exports.byQuarter = R.curry(function(minYear, bill) {
    return (bill.data.year() - minYear) * 4 + bill.data.quarter();
});



var reduceBills = R.reduce(function(result, bill) {
    result.tot += bill.totale;
    result.count++;
    return result;
});

function reduceBillsTotals(groupGenerator) {
    return R.mapObj(function(bills) {
        var startValue = {
            group: groupGenerator(bills[0]),
            tot: 0,
            count: 0
        };

        return reduceBills(startValue, bills);
    });
}



function groupReduceSort(groupGenerator, sortGenerator) {
    var group = R.groupBy(groupGenerator);
    var reduce = reduceBillsTotals(groupGenerator);
    var sort = R.sortBy(sortGenerator || R.prop('group'));

    return R.pipe(group, reduce, R.values, sort);

}

var groupByCustomer = exports.groupByCustomer = groupReduceSort(
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
        R.map(byQuarter(minYear)),
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
    var groups = groupReduceSort(byQuarter(year), null)(bills);
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


var calculateDueDate = R.each(function(bill) {
    bill.dueDate = moment(bill.data);
    if (bill.pagamentoFM) {
        bill.dueDate.endOf('month');
    }

    bill.dueDate.add('days', bill.pagamentoGG).valueOf();

});

var calculateStatus = R.each(function(bill) {
    var now = moment();
    bill.status = bill.dueDate.from(now);

    if (bill.dueDate.isAfter(now)) {
        return (bill.gravity = colors.green);
        
    }
    
    var dueFrom = now.diff(bill.dueDate, 'days');
    if (dueFrom <= 10) {
        return (bill.gravity = colors.yellow);
    }

    if (dueFrom <= 30) {
        return (bill.gravity = colors.orange);
    }

    bill.gravity = colors.red;
    


});


var filterUnpayed = R.filter(function(bill) {
    return bill.pagata === false || bill.pagata === 'false';
});


exports.buildStatusBills = function(bills) {

    return R.pipe(
        filterUnpayed,
        calculateDueDate,
        calculateStatus,
        R.sortBy(R.prop('data')),
        R.reverse
    )(bills);
};








exports.byCustomerQuarter = R.curry(function(minYear, bill) {
    return bill.customer + '|' + exports.byQuarter(minYear, bill);
});


exports.groupReduceSort = groupReduceSort;
