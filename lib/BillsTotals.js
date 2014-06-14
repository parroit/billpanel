'use strict';

var React = require('react');

var groupRows = require('./groupRows');
var billsTotalsTemplate = require('./built-templates/bills-totals');

var BillsTotals = React.createClass({
    

    render: function() {
        var args = {
          byYear: groupRows.rows(this.props.bills, function(bill){
              return bill.data.year();
          }),

          byQuarter: groupRows.rows(this.props.bills, function(bill){
              return bill.data.year() + '/' + bill.data.quarter();
          }),

          byCustomer: groupRows.byCustomerDescendingRows(this.props.bills)
            
        };
        

        return billsTotalsTemplate(args);
    
    }
});

module.exports = BillsTotals;
