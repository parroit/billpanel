'use strict';

var React = require('react');

var groupRows = require('./groupRows');
var statusTemplate = require('./built-templates/status');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);


var Status = React.createClass({
    mixins: [FluxMixin],

    render: function() {
        var args = {
            flux: this.getFlux(),
            rows: groupRows.statusRows(this.props.bills, this.getFlux())

        };


        return statusTemplate(args);

    }
});

module.exports = Status;
