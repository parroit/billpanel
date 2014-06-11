/** @jsx React.DOM */
'use strict';

var React = require('react');
var TabbedArea = require('react-bootstrap').TabbedArea;
var TabPane = require('react-bootstrap').TabPane;
var Panel = require('react-bootstrap').Panel;
var BillsTable = require('./BillsTable');
var BillsTotals = require('./BillsTotals');
var BillCharts = require('./BillCharts');

 
var BillsTabs = React.createClass({
    render: function() {
        
        return ( 
            <TabbedArea defaultActiveKey={1}>
              <TabPane key={1} tab="Totals">
                <BillsTotals bills={this.props.bills}/> 
              </TabPane>
              <TabPane key={2} tab="All bills">
                <BillsTable bills={this.props.bills}/> 
              </TabPane>
              <TabPane key={3} tab="Charts">
                 
                   <BillCharts bills={this.props.bills} /> 
                 
              </TabPane>
              
            </TabbedArea>
        );
    
    }
});

module.exports = BillsTabs;