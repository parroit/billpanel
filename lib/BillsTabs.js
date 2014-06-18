'use strict';

var React = require('react');


var template = require('./built-templates/bills-tabs');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);


var BillsTabs = React.createClass({
    mixins: [FluxMixin],

    render: function() {
        
        return template(this.props);
    
    }
});

module.exports = BillsTabs;