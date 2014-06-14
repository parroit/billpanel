'use strict';

var React = require('react');

var groupRows = require('./groupRows');
var statusTemplate = require('./built-templates/status');

var Status = React.createClass({
    

    render: function() {
        var args = {
          

          rows: groupRows.statusRows(this.props.bills)
            
        };
        

        return statusTemplate(args);
    
    }
});

module.exports = Status;
