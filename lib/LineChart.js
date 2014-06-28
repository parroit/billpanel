'use strict';

var React = require('react');
var chart = require('nchart');

var LineChart = React.createClass({
  getDefaultProps: function() {
    return {
      width: 1000,
      height: 300
    };
  },
  
  componentDidMount: function(){
    var canvas = this.getDOMNode();
    var ctx = canvas.getContext('2d');
    chart(ctx).Line(this.props.data,this.props.options);
  },

  componentDidUpdate: function(){
    var canvas = this.getDOMNode();
    var ctx = canvas.getContext('2d');
    chart(ctx).Line(this.props.data,this.props.options);
  },

  render: function() {
    
    return React.DOM.canvas({
        width: this.props.width,
        height: this.props.height
      });
  }

});

module.exports = LineChart;