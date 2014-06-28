'use strict';

var moment = require('moment');
var Fluxxor = require('fluxxor');
var R = require('ramda');
var colors = require('../colors');
var model = require('../model');

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
        data: {
            labels: getLabels(minYear),
            datasets: [{
                strokeColor: colors.purple,
                pointColor: colors.purple,
                pointStrokeColor: '#fff',
                data: quarterSerie
            }]
        },
        legend: []
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

module.exports = Fluxxor.createStore({
    actions: {
        'REFRESH_DATA': 'onRefreshData',
        'SET_BILL_PAYED': 'onSetPayed'
    },
    onRefreshData: function(data) {
        this.onTotalsStoreChanged();
    },
    onSetPayed: function(data) {
        this.onTotalsStoreChanged();
    },
    onTotalsStoreChanged: function() {
        var onTotalsStoreChanged = this.onTotalsStoreChanged.bind(this);
        //this.waitFor(['TotalsStore'], function(store) {
        var store = this.flux.store('TotalsStore');
        store.on('change', onTotalsStoreChanged);
        var state = store.getState();
        this.state = {
            top5ByQuarter: groupTop5ByQuarter(state.bills),
            byQuarter: groupByQuarter(state.bills)
        };
        this.emit('change');
        //});


    },

    initialize: function() {
        this.state = {
            top5ByQuarter: groupTop5ByQuarter([]),
            byQuarter: groupByQuarter([])
        };



    },

    getState: function() {
        return this.state;
    }
});
