'use strict';

var moment = require('moment');
var React = require('react');
var groupBillsByCustomer = require('./groupBillsByCustomer');
var groupBills = require('./groupBills');
var colors = require('./colors');
var template = require('./built-templates/bill-charts');


function findTopCustomer(bills) {
    var billsByCustomer = groupBillsByCustomer.onlyData(bills);
    var topCustomers = [];
    var i = 0;

    for (; i < 5; i++) {
        topCustomers.push(billsByCustomer[i].group);
    }

    return topCustomers;
}

function findMinYear(bills) {
    var minYear = 99999;

    bills.forEach(function(bill) {
        if (bill.data.year() < minYear) {
            minYear = bill.data.year();
        }
    });

    return minYear;
}

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
    var byQuarter = groupBills.onlyData(bills, function(bill) {
        return (bill.data.year() - minYear) * 4 + bill.data.quarter();
    });

    var quarterSerie = [];

    byQuarter.forEach(function(dt) {
        var quarter = dt.group;
        quarterSerie[quarter - 1] = dt.tot;

    });
    var maxValue = 0;
    var i = 0;
    var l = (moment().year() - minYear + 1) * 4 - 1;
    for (; i <= l; i++) {
        var value = quarterSerie[i];
        if (!value) {
            quarterSerie[i] = 0;
        } else if (value > maxValue) {
            maxValue = value;
        }
    }

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


function groupTop5ByQuarter(bills) {
    var data = {};

    var topCustomers = findTopCustomer(bills);

    topCustomers.forEach(function(customer) {
        data[customer] = [];
    });


    var minYear = findMinYear(bills);

    var topCustomersBills = bills.filter(function(bill) {
        return topCustomers.indexOf(bill.customer) > -1;
    });

    var byCustomerQuarter = groupBills.onlyData(topCustomersBills, function(bill) {
        return bill.customer + '|' + ((bill.data.year() - minYear) * 4 + bill.data.quarter());
    });

    byCustomerQuarter.forEach(function(dt) {
        var parts = dt.group.split('|');
        var customer = parts[0];
        var quarter = parts[1];
        var customerSerie = data[customer];
        customerSerie[quarter - 1] = dt.tot;

    });

    var datasets = [];
    var customerColors = [colors.red, colors.blue, colors.yellow, colors.teal, colors.orange];
    var legend = [];
    var currentColor = 0;
    var maxValue = 0;

    topCustomers.forEach(function(customer) {
        var i = 0;
        var l = (moment().year() - minYear + 1) * 4 - 1;
        var customerSerie = data[customer];
        for (; i <= l; i++) {
            var value = customerSerie[i];
            if (!value) {
                customerSerie[i] = 0;
            } else if (value > maxValue) {
                maxValue = value;
            }
        }

        datasets.push({
            strokeColor: customerColors[currentColor],
            pointColor: customerColors[currentColor],
            pointStrokeColor: '#fff',
            data: customerSerie
        });

        legend.push({
            customer: customer,
            color: customerColors[currentColor]
        });

        currentColor++;
    });



    var graphData = {
        labels: getLabels(minYear),
        datasets: datasets
    };

    return {
        data: graphData,
        legend: legend,
        maxValue: maxValue * 1.2
    };
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
