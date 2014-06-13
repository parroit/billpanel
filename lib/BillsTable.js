'use strict';

var React = require('react');
var rowTemplate = require('./built-templates/bills-table-row');
var tableTemplate = require('./built-templates/bills-table');

var BillRow = React.createClass({
    render: function() {
        return rowTemplate(this.props.bill);
    }
});

module.exports = React.createClass({
    render: function() {
        var bills = this.props.bills.map(function(bill){
            return new BillRow({bill:bill});
        });

        return tableTemplate(bills);
    
    }
});

