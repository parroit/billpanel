/** @jsx React.DOM */
'use strict';

var React = require('react');
var Table = require('react-bootstrap').Table;
var Panel = require('react-bootstrap').Panel;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var groupBills = require('./groupBills');
var groupBillsByCustomer = require('./groupBillsByCustomer');


var TotalsTable = React.createClass({

    render: function() {
      return (
        <Col xs={12} md={4}>
               <Panel header={this.props.caption}>
                   <Table responsive striped bordered condensed hover>
                  <thead>
                    <tr>
                      <th>{this.props.groupName}</th>
                      <th>Total</th>
                      <th>Count</th>
                    </tr>
                  </thead>

                  <tbody>
                        {this.props.data}
                    </tbody>
                </Table>
              </Panel>
        </Col>
        );
    }
 });


var BillsTotals = React.createClass({
    

    render: function() {
        
        var byYear = groupBills(this.props.bills, function(bill){
            return bill.data.year();
        });

        var byQuarter = groupBills(this.props.bills, function(bill){
            return bill.data.quarter()+' ' + bill.data.year();
        });

        var byCustomer = groupBillsByCustomer(this.props.bills);
        

        return ( 
          <Row className="totals">
            <TotalsTable caption="By year" groupName="Year" data={byYear}/>
            <TotalsTable caption="By quarter" groupName="Quarter" data={byQuarter}/>
            <TotalsTable caption="By customer" groupName="Customer" data={byCustomer}/>
          
          </Row>
          
        );
    
    }
});

module.exports = BillsTotals;
