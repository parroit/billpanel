'use strict';

var React = require('react');
var totalsTableTemplate = require('./built-templates/group-bill-row');
var R = require('ramda');

var GroupRow = React.createClass({
    render: function() {
        return totalsTableTemplate(this.props.group);
    }
});

var reduceBills = R.reduce(function(result, bill) {
    result.tot += bill.totale;
    result.count++;
    //console.log("%s: %d",bill.data.year(),bill.totale);
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

var mapToGroupRow = R.map(function(group) {
    return new GroupRow({
        group: group
    });
});

function groupBills(groupBy, sortBy) {

    return R.pipe(
        groupReduceSort(groupBy, sortBy),
        mapToGroupRow

    );
}

exports.rows = function(bills, groupBy, sortBy) {
    return groupBills(groupBy, sortBy)(bills);
};

exports.byQuarter = R.curry(function(minYear, bill) {
    return (bill.data.year() - minYear) * 4 + bill.data.quarter();
});

//exports.datePart =  require('./model').datePart;




exports.byCustomerQuarter = R.curry(function(minYear, bill) {
    return bill.customer + '|' + ((bill.data.year() - minYear) * 4 + bill.data.quarter());
});


exports.groupReduceSort = groupReduceSort;
exports.mapToGroupRow = mapToGroupRow;

