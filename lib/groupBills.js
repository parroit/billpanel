'use strict';

var React = require('react');
var totalsTableTemplate = require('./built-templates/group-bill-row');

var GroupRow = React.createClass({
    render: function() {
        return totalsTableTemplate( this.props.group);
    }
});

function onlyData(bills, groupBy, sortBy){
  var allGroups = bills.reduce(function(groups, bill){
            
    var group = groupBy(bill);
    var groupData;

    if ( !(group in groups) ) {
      groupData = {
        tot: 0,
        count: 0
      };
      groups[group] = groupData;
    } else {
      groupData = groups[group];
    }

    groupData.tot += bill.totale;
    groupData.count++;

    return groups;
  },{});

  var flattened = Object.keys(allGroups).map(function(group){

    var groupData = allGroups[group]; 
    return {
      group: group,
      tot: groupData.tot,
      count: groupData.count,
    };

  });

  if ( sortBy ) {
      flattened = sortBy(flattened);
  }

  return flattened;
}

function groupBills(bills, groupBy, sortBy){
  
  return onlyData(bills,groupBy,sortBy).map(function(group){
     return new GroupRow({group:group});    
  });
}

module.exports = groupBills;
module.exports.onlyData = onlyData;