'use strict';

var React = require('react');

var groupBills = require('./groupBills');
var groupBillsByCustomer = require('./groupBillsByCustomer');
var billsTotalsTemplate = require('./built-templates/bills-totals');

var BillsTotals = React.createClass({
    

    render: function() {
        var args = {
          byYear: groupBills(this.props.bills, function(bill){
              return bill.data.year();
          }),

          byQuarter: groupBills(this.props.bills, function(bill){
              return bill.data.quarter()+' ' + bill.data.year();
          }),

          byCustomer: groupBillsByCustomer(this.props.bills)
            
        };
        

        return billsTotalsTemplate(args);
    
    }
});

module.exports = BillsTotals;