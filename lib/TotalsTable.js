'use strict';

var React = require('react');
var totalsTableTemplate = require('./built-templates/totals-table');

module.exports = React.createClass({

    render: function() {
      return totalsTableTemplate(this.props);
    }
 });