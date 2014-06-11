/** @jsx React.DOM */
'use strict';

var React = require('react');
var Table = require('react-bootstrap').Table;
var Panel = require('react-bootstrap').Panel;
var BillRow = React.createClass({
    render: function() {
        var b = this.props.bill;
        return ( 
            <tr>
              <td>{b.code}</td>
              <td>{b.customer}</td>
              <td className="date">{b.data.format("DD/MM/YYYY")}</td>
              <td className="currency">{b.totale.toFixed(2).replace('.',',')} €</td>
            </tr>
        );
    
    }
});

var BillsTable = React.createClass({
    render: function() {
        var bills = this.props.bills.map(function(bill){
            return <BillRow bill={bill}/>;
        });

        return ( 
          <Panel header="Fatture">
               <Table responsive striped bordered condensed hover>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Customer</th>
                      
                      <th>Date</th>
                      <th>Total</th>
                      
                    </tr>
                  </thead>

                  <tbody>
                        {bills}
                        
                    </tbody>
                </Table>
           </Panel>
        );
    
    }
});

module.exports = BillsTable;
