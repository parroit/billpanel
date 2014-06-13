'use strict';

var React = require('react');


var template = require('./built-templates/bills-tabs');

 
var BillsTabs = React.createClass({
    render: function() {
        
        return template(this.props);
    
    }
});

module.exports = BillsTabs;