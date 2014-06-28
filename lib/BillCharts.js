'use strict';

var React = require('react');
var template = require('./built-templates/bill-charts');


var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var BillCharts = React.createClass({
    mixins: [FluxMixin, new StoreWatchMixin('ChartDataStore')],
    
    getStateFromFlux: function() {
        var flux = this.getFlux();
        
        return flux.store('ChartDataStore').getState();
    },

    render: function() {
        var state = this.getStateFromFlux();
        
        var top5ByQuarter = state.top5ByQuarter;
        var byQuarter = state.byQuarter;

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
