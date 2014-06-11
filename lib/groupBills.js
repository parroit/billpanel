/** @jsx React.DOM */
'use strict';

var React = require('react');

var GroupRow = React.createClass({
    render: function() {
        

        var b = this.props.group;
        return ( 
            <tr>
              <td className="group-name">{b.group}</td>
              <td className="currency">{b.tot.toFixed(2).replace('.',',')} €</td>
              <td className="number">{b.count}</td>
              
            </tr>
        );
    
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
      }
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
     return <GroupRow group={group}/>;    
  });
}

module.exports = groupBills;
module.exports.onlyData = onlyData;