'use strict';

//var moment = require('moment');

var React = require('react');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React),
    FluxChildMixin = Fluxxor.FluxChildMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;


var template = require('./built-templates/billpanel-app');

var BillPanelApp = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin('TotalsStore')],

    componentWillMount: function() {
        var flux = this.getFlux();
        flux.actions.refreshData(true);
    },

    getStateFromFlux: function() {
        var flux = this.getFlux();
        return flux.store('TotalsStore').getState();
    },

    getInitialState: function() {
        return {
            
        };
    },


    render: function() {
        return template({
            busy: this.state.busy,
            bills: this.state.bills
        });

    }
});

module.exports = BillPanelApp;
