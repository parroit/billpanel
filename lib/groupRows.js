'use strict';

var React = require('react');
var totalsTableTemplate = require('./built-templates/group-bill-row');
var R = require('ramda');
var model = require('./model');

var GroupRow = React.createClass({
    render: function() {
        return totalsTableTemplate(this.props.group);
    }
});


var mapToGroupRow = R.map(function(group) {
    return new GroupRow({
        group: group
    });
});


function groupBills(groupBy, sortBy) {

    return R.pipe(
        model.groupReduceSort(groupBy, sortBy),
        mapToGroupRow

    );
}

exports.rows = function(bills, groupBy, sortBy) {
    return groupBills(groupBy, sortBy)(bills);
};


exports.mapToGroupRow = mapToGroupRow;


exports.byCustomerDescendingRows = R.pipe(
    model.groupByCustomerDescending, 
    mapToGroupRow
);
