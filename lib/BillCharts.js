/** @jsx React.DOM */
'use strict';

var moment = require('moment');
var React = require('react');
var LineChart = require('./LineChart');
var groupBillsByCustomer = require('./groupBillsByCustomer');
var groupBills = require('./groupBills');
var colors =require('./colors');
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Panel = require('react-bootstrap').Panel;

function findTopCustomer(bills){
        var billsByCustomer = groupBillsByCustomer.onlyData(bills);
        var topCustomers = [];
        var i = 0;
        
        for ( ; i<5; i++) {
          topCustomers.push( billsByCustomer[i].group );
        }

        return topCustomers
}

function findMinYear(bills){
        var minYear = 99999;

        bills.forEach(function(bill){
          if ( bill.data.year() < minYear ) {
            minYear = bill.data.year();
          }
        });

        return minYear;
}

 function getLabels(minYear){
            var labels = [];
            var year = minYear;
            var quarter;

            for (; year <= moment().year();  year++) {
              quarter = 1;
              
              for (; quarter <= 4; quarter++ ){
                labels.push(quarter+"/"+year);
              }

            }

            return labels;


        }
        
       

function groupByQuarter(bills){
  var minYear = findMinYear(bills);
  var byQuarter = groupBills.onlyData(bills, function(bill){
      return ( bill.data.year() - minYear ) * 4 + bill.data.quarter();
  });

  var quarterSerie = [];

  byQuarter.forEach(function(dt){
      var quarter = dt.group;
      quarterSerie[quarter-1] = dt.tot;
    
  });

  var i = 0;
  var l = (moment().year() - minYear +1) * 4 -1;
  for (; i<=l; i++) {
    if (!quarterSerie[i] ) {
      quarterSerie[i] = 0;
    }  
  }

  return {
          labels : getLabels(minYear),
          datasets : [{
              strokeColor : colors.purple,
              pointColor : colors.purple,
              pointStrokeColor : "#fff",
              data : quarterSerie
            }]
        };

}


function groupTop5ByQuarter(bills){
      var data = { };
        
        var topCustomers = findTopCustomer(bills);
        
        topCustomers.forEach(function(customer){
          data[customer] = [];
        });
          
        
        var minYear = findMinYear(bills);

        var topCustomersBills = bills.filter(function(bill){
            return topCustomers.indexOf(bill.customer) > -1 ;
        });

        var byCustomerQuarter = groupBills.onlyData(topCustomersBills,function(bill){
            return bill.customer + "|" + (( bill.data.year() - minYear ) * 4 + bill.data.quarter());  
        });

        byCustomerQuarter.forEach(function(dt){
          var parts = dt.group.split("|");
          var customer = parts[0];
          var quarter = parts[1];
          var customerSerie = data[customer];
          customerSerie[quarter-1] = dt.tot;
        
        });
        
        var datasets = [];
        var customerColors = [colors.red, colors.blue, colors.yellow, colors.teal, colors.orange];
        var legend = [];
        var currentColor = 0;

        topCustomers.forEach(function(customer){
          var i = 0;
          var l = (moment().year() - minYear +1) * 4 -1;
          var customerSerie = data[customer];
          for (; i<=l; i++) {
            if (!customerSerie[i] ) {
              customerSerie[i] = 0;
            }  
          }

          datasets.push({
              strokeColor : customerColors[currentColor],
              pointColor : customerColors[currentColor],
              pointStrokeColor : "#fff",
              data : customerSerie
            });

          legend.push({
            customer: customer,
            color: customerColors[currentColor]
          });

          currentColor++;
        });
        
        

        var data = {
          labels : getLabels(minYear),
          datasets : datasets
        };

        return  {
          data: data,
          legend: legend
        };
}

var BillCharts = React.createClass({
    render: function() {
  
        var top5ByQuarter = groupTop5ByQuarter(this.props.bills);
        var byQuarter = groupByQuarter(this.props.bills);

        return ( 
            <div>
            <Panel header="Top 5 customer by quarters">
              <Row>

                <Col md={10}>
                  <LineChart data={top5ByQuarter.data} options={{datasetFill : false}} />
                </Col>

                <Col md={2}>
                {
                    top5ByQuarter.legend.map(function(item){ 
                      return (
                        <p style={{color: item.color}} >
                          {item.customer}
                        </p>
                      );
                    })
                  }
                </Col>
          
              </Row>
           </Panel>

            <Panel header="Totals by quarters">
              <Row>

                <Col md={12}>
                  <LineChart data={byQuarter} options={{datasetFill : false}} />
                </Col>

          
              </Row>
           </Panel>
           </div>
        );
    
    }
});

module.exports = BillCharts;