'use strict';

var moment = require('moment');
var React = require('react');
var R = require('ramda');
var colors = require('./colors');
var template = require('./built-templates/bill-charts');
var model = require('./model');

var findTopCustomer = model.findTopCustomer(5);

var findMinYear = model.minYear;

function getLabels(minYear) {
    var labels = [];
    var year = minYear;
    var quarter;

    for (; year <= moment().year(); year++) {
        quarter = 1;

        for (; quarter <= 4; quarter++) {
            labels.push(quarter + '/' + year);
        }

    }

    return labels;


}



function groupByQuarter(bills) {
    var minYear = findMinYear(bills);
    var byQuarter = model.groupByQuarter(bills);

    var quarterSerie = R.map(R.prop('tot'), byQuarter);

    var maxValue = R.max(quarterSerie);

    return {
        maxValue: maxValue * 1.2,
        labels: getLabels(minYear),
        datasets: [{
            strokeColor: colors.purple,
            pointColor: colors.purple,
            pointStrokeColor: '#fff',
            data: quarterSerie
        }]
    };

}

var customerFilter = function(customer) {
    return R.filter(function(b) {
        return b.customer === customer;
    });
};

function groupTop5ByQuarter(bills) {
    var topCustomers = findTopCustomer(bills);
    var minYear = findMinYear(bills);
    var maxQuarter = model.maxQuarter(minYear)(bills);
    var customerColors = [colors.red, colors.blue, colors.yellow, colors.teal, colors.orange];
    var currentColor = 0;

    var graph = {
        data: {
            labels: getLabels(minYear),
            datasets: []
        },
        legend: [],
        maxValue: 0
    };

    topCustomers.forEach(function(customer) {
        var filter = customerFilter(customer);
        var customerBills = filter(bills);
        var byQuarter = model.groupByQuarterPeriod(minYear, maxQuarter, customerBills);
        var color = customerColors[currentColor];
        currentColor++;

        graph.data.datasets.push({
            strokeColor: color,
            pointColor: color,
            pointStrokeColor: '#fff',
            data: R.map(R.prop('tot'), byQuarter)
        });

        graph.legend.push({
            customer: customer,
            color: color
        });


    });

    graph.maxValue = 1.2 * R.max(
        R.flatten(
            R.map(
                R.prop('data'),
                graph.data.datasets
            )
        )
    );

    return graph;
}

var BillCharts = React.createClass({
    render: function() {

        var top5ByQuarter = groupTop5ByQuarter(this.props.bills);
        var byQuarter = groupByQuarter(this.props.bills);

        var optionsTop5ByQuarter = {
            datasetFill: false,
            scaleOverride: true,
            scaleSteps: Math.round(top5ByQuarter.maxValue / 1000),
            scaleStepWidth: 1000,
            scaleStartValue: 0,
            scaleLabel: '<%=value%> €'
        };

        var optionsByQuarter = {
            datasetFill: false,
            scaleOverride: true,
            scaleSteps: Math.round(byQuarter.maxValue / 1000),
            scaleStepWidth: 1000,
            scaleStartValue: 0,
            scaleLabel: '<%=value%> €'
        };

        return template({
            top5ByQuarter: top5ByQuarter,
            optionsTop5ByQuarter: optionsTop5ByQuarter,
            byQuarter: byQuarter,
            optionsByQuarter: optionsByQuarter
        });


    }
});

module.exports = BillCharts;
