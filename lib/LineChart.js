/** @jsx React.DOM */

'use strict';

var React = require('react');
var _ = require('underscore');
var Chart = require('nchart');



var LineChart = React.createClass({
  getDefaultProps: function() {
    return {
      width: 1000,
      height: 300
    }
  },
  
  componentDidMount: function(){
    var canvas = this.getDOMNode();
    var ctx = canvas.getContext('2d')
    Chart(ctx).Line(this.props.data,this.props.options);
  },

  render: function() {
    
    return (
      <canvas width={this.props.width} height={this.props.height}>
       
        
      </canvas>
    );
  }
});

module.exports = LineChart;