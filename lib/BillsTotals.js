'use strict';

var React = require('react');

var groupBills = require('./groupBills');
var groupByCustomer = require('./groupByCustomer');
var billsTotalsTemplate = require('./built-templates/bills-totals');

var BillsTotals = React.createClass({
    

    render: function() {
        var args = {
          byYear: groupBills.rows(this.props.bills, function(bill){
              return bill.data.year();
          }),

          byQuarter: groupBills.rows(this.props.bills, function(bill){
              return bill.data.year() + '/' + bill.data.quarter();
          }),

          byCustomer: groupByCustomer.descendingRows(this.props.bills)
            
        };
        

        return billsTotalsTemplate(args);
    
    }
});

module.exports = BillsTotals;
